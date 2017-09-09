import * as React from "react"
import * as ReactDOM from "react-dom"
import * as Immutable from "immutable"
import * as i18next from 'i18next'
import * as Option from "./option"
import * as Slugify from "slugify"

import {C, Mode, Cont, CmdCommon, Context, make_C, unit, bind} from './core'
import {button} from './html'

export type UrlElement<K> = string | { kind:"int", name:K }
export type UrlTemplate<K> = Array<UrlElement<K>>
export let parse_url = function<T,K extends keyof(T)>(template:UrlTemplate<K>) : ((url:string) => Option.Option<T>) {
  return url => {
    let res : any = {}
    let url_items = url.split("/")
    if (url_items.length != template.length) return Option.none<T>()
    for (var i = 0; i < url_items.length; i++) {
      let x = Slugify(url_items[i])
      let y = Slugify(template[i])
      if (typeof y === "string") {
        if (x != y) return Option.none<T>()
      } else {
        let n = parseInt(x)
        if (isNaN(n)) return Option.none<T>()
        res[y.name] = n
      }
    }

    return Option.some<T>(res as T)
  }
}
export let instantiate_url = function<T,K extends keyof(T)>(template:UrlTemplate<K>) : ((t:T) => string) {
  return t => {
    let url = ""
    for (var i = 0; i < template.length; i++) {
      let el = Slugify(template[i])
      if (typeof el === "string") {
        url = i == 0 ? el : `${url}/${el}`
      } else {
        url = i == 0 ? `${t[el.name]}` : `${url}/${t[el.name]}`
      }
    }
    return url
  }
}
export type Url<T> = PartialRetraction<string, T>
export let make_url = function<T,K extends keyof(T)>(template:UrlTemplate<K>) : Url<T> {
  return { in:parse_url<T,K>(template), out:instantiate_url<T,K>(template) }
}
export let fallback_url = function() : Url<{}> {
  return { in:_ => Option.some({}), out:_ => "" }
}

export type PartialRetraction<A,B> = { in:(_:A)=>Option.Option<B>, out:(_:B)=>A }
export type Route<A> = { url:Url<A>, page:(_:A)=>C<void> }

export type ApplicationProps = { mode:Mode, base_url:string, slug:string, routes:() => Promise<Array<Route<{}>>> }
export type ApplicationState = { kind:"loading routes" } | { kind:"running", context:Context, routes:Immutable.List<Route<{}>> }
export class Application extends React.Component<ApplicationProps, ApplicationState> {
  constructor(props:ApplicationProps, context:any) {
    super(props, context)

    this.state = { kind:"loading routes" }
  }

  load() {
    this.props.routes().then(raw_routes => {
      let routes = Immutable.List<Route<{}>>(raw_routes)
      let initial_page:C<void> = undefined
      routes.forEach(r => {
          let p = r.url.in(this.props.slug).map(r.page)
          if (p.kind == "some") {
            initial_page = p.value
            return false
          }
          return true
      })

      this.setState({...this.state, kind:"running",
        context:this.context_from_props(this.props, initial_page),
        routes:routes })
    }).catch(() => setTimeout(() => this.load(), 250))
  }

  componentDidMount() {
    this.load()
    let self = this
    let load = () => {
      if (self.state.kind != "running") return
      if (self.history.count() == 1) {
        let slug = self.history.peek()
        window.history.pushState(`${self.props.base_url}${slug}`, `${self.props.base_url}${slug}`, `${self.props.base_url}${slug}`)
        return
      }
      self.history = self.history.pop()
      let slug = self.history.peek()

      // console.log("back to", slug, old_history.toArray(), self.history.toArray())
      let routes = self.state.routes

      let new_page:C<void> = undefined
      routes.forEach(r => {
        let p = r.url.in(slug).map(r.page)
        if (p.kind == "some") {
          new_page = p.value
          return false
        }
        return true
      })

      window.history.pushState(`${self.props.base_url}${slug}`, `${self.props.base_url}${slug}`, `${self.props.base_url}${slug}`)

      let new_context:Context = {...self.state.context, current_page:new_page, logic_frame:self.state.context.logic_frame + 1}
      let new_state:ApplicationState = {...self.state, context:new_context}
      self.setState(new_state)
    }

    window.onpopstate = function(e) {
      load()
    }
  }

  history = Immutable.Stack<string>()

  context_from_props(props:ApplicationProps, p:C<void>) : Context {
    let self = this
    return {
      current_page:p,
      logic_frame:0,
      force_reload:(callback) =>
        make_C<void>(ctxt => inner_callback => {
            if (this.state.kind == "loading routes") return null
            let old_context = this.state.context
            let new_state:ApplicationState = {...this.state, context:{...old_context, logic_frame:this.state.context.logic_frame+1}}
            this.setState(new_state, () =>
            inner_callback(callback)(null))
          return null
        }),
      set_page:function<T>(x:T, new_page:Route<T>, callback?:()=>void) {
        let out = new_page.url.out(x)
        window.history.pushState(`${self.props.base_url}${out}`, `${self.props.base_url}${out}`, `${self.props.base_url}${out}`)
        if (self.history.isEmpty() || self.history.peek() != out)
          self.history = self.history.push(out)
        // console.log("set page", self.history.toArray())
        return make_C<void>(ctxt => inner_callback => {
          if (self.state.kind == "loading routes") return undefined
          let new_context:Context = {...self.state.context, current_page:new_page.page(x)}
          let new_state:ApplicationState = {...this.state, context:new_context}
          self.setState(new_state, () =>
          inner_callback(callback)(null))
          return null
        })
      },
      set_url:function<T>(x:T, new_url:Url<T>, callback?:()=>void) {
        let out = new_url.out(x)
        // console.log("set page", self.props.base_url, out, new_url)
        window.history.pushState(`${self.props.base_url}${out}`, `${self.props.base_url}${out}`, `${self.props.base_url}${out}`)
        if (self.history.isEmpty() || self.history.peek() != out)
          self.history = self.history.push(out)
        // console.log("set url", self.history.toArray())
        return unit<void>(null)
      },
      push_route:(new_route, callback) =>
        make_C<void>(ctxt => inner_callback => {
            if (this.state.kind == "loading routes") return null
            let old_context = this.state.context
            let new_state:ApplicationState = {...this.state, routes:this.state.routes.push(new_route)}
            this.setState(new_state, () =>
            inner_callback(callback)(null))
          return null
        }),
      set_routes:(routes, callback) =>
        make_C<void>(ctxt => inner_callback => {
            if (this.state.kind == "loading routes") return null
            let old_context = this.state.context
            let new_state:ApplicationState = {...this.state, routes:Immutable.List<Route<{}>>(routes)}
            this.setState(new_state, () =>
            inner_callback(callback)(null))
          return null
        }),
    }
  }

  render() {
    if (this.state.kind == "loading routes")
      return <div className="loading">Loading...</div>
    return <div className="monadic-application" key={`application@${this.state.context.logic_frame}`}>
      {
          this.state.context.current_page.comp(() => this.state.kind != "loading routes" && this.state.context)(callback => _ => callback && callback())
      }
    </div>
  }
}

export let application = (mode:Mode, base_url:string, slug:string, routes:() => Promise<Array<Route<{}>>>) : JSX.Element => {
  console.log("Calling application with", window.location.href, slug, base_url)
  return React.createElement<ApplicationProps>(Application, { mode:mode, base_url:base_url, slug:slug, routes:routes })
}

export let get_context = function(key?:string, dbg?:() => string) : C<Context> { return make_C<Context>(ctxt => cont =>
  (unit<Context>(ctxt()).comp(ctxt)(cont))) }

export let link_to_route = function<T>(label:string, x:T, r:Route<T>, key?:string, className?:string) : C<void> {
  return button<void>(label)(null).then(key, _ =>
           get_context().then(undefined, c =>
           c.set_page(x, r), className).ignore())
}
