import * as React from "react"
import * as ReactDOM from "react-dom"
import * as Immutable from "immutable"
import * as i18next from 'i18next'
import * as Option from "./option"

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
      let x = url_items[i]
      let y = template[i]
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
      let el = template[i]
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

export type ApplicationProps = { mode:Mode, base_url:string, slug:string, routes:Immutable.List<Route<{}>> }
export type ApplicationState = { context:Context }
export class Application extends React.Component<ApplicationProps, ApplicationState> {
  constructor(props:ApplicationProps, context:any) {
    super(props, context)

    let initial_page:C<void> = undefined
    props.routes.forEach(r => {
        let p = r.url.in(props.slug).map(r.page)
        if (p.kind == "some") {
          initial_page = p.value
          return false
        }
        return true
    })

    this.state = { context:this.context_from_props(this.props, initial_page) }
  }

  context_from_props(props:ApplicationProps, p:C<void>) : Context {
     let self = this
     return {
        mode:props.mode,
        current_page:p,
        set_mode:(new_mode, callback) =>
          make_C<void>(ctxt => inner_callback => this.setState({...this.state, context:{...this.state.context, mode:new_mode}},
              () => inner_callback(callback)(null)) || null),
        logic_frame:0,
        force_reload:(callback) =>
          make_C<void>(ctxt => inner_callback => this.setState({...this.state, context:{...this.state.context, logic_frame:this.state.context.logic_frame+1}},
              () => inner_callback(callback)(null)) || null),
        set_page:function<T>(x:T, new_page:Route<T>, callback?:()=>void) {
          window.history.pushState("", "", `${self.props.base_url}${new_page.url.out(x)}`)
          let new_context:Context = {...self.state.context, current_page:new_page.page(x)}
          return make_C<void>(ctxt => inner_callback => self.setState({...self.state, context:new_context},
              () => inner_callback(callback)(null)) || null)
        },
        set_url:function<T>(x:T, new_url:Url<T>, callback?:()=>void) {
          // console.log(self.props.base_url, new_url.out(x))
          window.history.pushState("", "", `${self.props.base_url}${new_url.out(x)}`)
          return unit<void>(null)
        }
      }
  }

  render() {
    return <div className="monadic-application" key={`application@${this.state.context.logic_frame}`}>
      {
        this.state.context.current_page.comp(() => this.state.context)(callback => _ => callback && callback())
      }
    </div>
  }
}

export let application = (mode:Mode, base_url:string, slug:string, routes:Array<Route<{}>>) : JSX.Element => {
  console.log("Calling application with", window.location.href, slug, base_url)
  return React.createElement<ApplicationProps>(Application, { mode:mode, base_url:base_url, slug:slug, routes:Immutable.List<Route<{}>>(routes) })
}

export let get_context = function(key?:string, dbg?:() => string) : C<Context> { return make_C<Context>(ctxt => cont =>
  (unit<Context>(ctxt()).comp(ctxt)(cont))) }

export let link_to_route = function<T>(label:string, x:T, r:Route<T>, key?:string, className?:string) : C<void> {
  return button<void>(label)(null).then(key, _ =>
           get_context().then(undefined, c =>
           c.set_page(x, r), className).ignore())
}
