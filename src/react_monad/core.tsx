import * as React from "react"
import * as ReactDOM from "react-dom"
import * as Immutable from "immutable"
import * as Option from "./option"
import {never} from './combinators'
import {Route, Url} from './router'

export type CmdCommon<A> = { cont:Cont<A>, context:()=>Context, key:string, debug_info:() => string }
export type UnitProps<A> = { kind:"unit", value:A } & CmdCommon<A>
export type BindProps<B,A> = { kind:"bind", once:boolean, p:C<B>, k:(_:B) => C<A>, className:string } & CmdCommon<A>
export type MapProps<A,B> = { kind:"map", p:C<A>, f:(_:A)=>B } & CmdCommon<B>
export type FilterProps<A> = { kind:"filter", p:C<A>, f:(_:A)=>boolean } & CmdCommon<A>
export type Mode = "edit"|"view"

export type Context = {
  logic_frame:number,
  force_reload:(callback?:()=>void) => C<void>
  current_page:C<void>
  // pages:Immutable.Stack<C<void>>
  set_page:<T>(x:T, new_page:Route<T>, callback?:()=>void) => C<void>
  set_url:<T>(x:T, new_url:Url<T>, callback?:()=>void) => C<void>
  push_route:(new_route:Route<{}>, callback?:()=>void) => C<void>
  set_routes:(routes:Array<Route<{}>>, callback?:()=>void) => C<void>
  // push_page:(new_page:ApplicationPage, callback?:()=>void) => C<void>
  // pop_page:(callback?:()=>void) => C<void>
}

export type Cont<A> = (callback:() => void) => (_:A) => void
export type C<A> = {
  comp:(ctxt:() => Context) => (cont:Cont<A>) => JSX.Element
  then:<B>(key:string, k:(_:A)=>C<B>, className?:string, dbg?:()=>string)=>C<B>
  // bind_once:<B>(key:string, k:(_:A)=>C<B>, dbg?:()=>string)=>C<B>
  never:<B>(key?:string)=>C<B>
  ignore:(key?:string)=>C<void>
  ignore_with:<B>(x:B)=>C<B>
  map:<B>(f:(_:A)=>B, key?:string, dbg?:()=>string)=>C<B>,
  filter:(f:(_:A)=>boolean, key?:string, dbg?:()=>string)=>C<A>
}

export function make_C<A>(comp:(ctxt:()=>Context) => (cont:Cont<A>) => JSX.Element) : C<A> {
  return {
    comp:comp,
    then:function<B>(this:C<A>, key:string, k:(_:A)=>C<B>, className?:string, dbg?:()=>string) : C<B> {
            return bind<A,B>(key, this, k, className, dbg)
          },
    map:function<B>(this:C<A>, f:(_:A)=>B, key?:string, dbg?:()=>string) : C<B> {
            return map<A,B>(key, dbg)(f)(this)
          },
    filter:function(this:C<A>, f:(_:A)=>boolean, key?:string, dbg?:()=>string) : C<A> {
            return filter<A>(key, dbg)(f)(this)
          },
    // bind_once:function<B>(this:C<A>, key:string, k:(_:A)=>C<B>, dbg?:()=>string) : C<B> {
    //         return bind_once<A,B>(key, this, k, dbg)
    //       },
    never:function<B>(this:C<A>, key?:string) : C<B> {
      return never<A, B>(this, key)
    },
    ignore_with:function<B>(this:C<A>, x:B) : C<B> {
      return this.then<B>(``, _ => unit<B>(x))
    },
    ignore:function(this:C<A>, key?:string) : C<void> {
      return this.then(key, _ => unit<void>(null))
    }
  }
}

type UnitState<A> = {}
class Unit<A> extends React.Component<UnitProps<A>,UnitState<A>> {
  constructor(props:UnitProps<A>,context:any) {
    super(props, context)
    this.state = {}
  }
  componentWillReceiveProps(new_props:UnitProps<A>) {
    new_props.debug_info && console.log("New props:", new_props.debug_info(), new_props.value)
    new_props.cont(() => {})(new_props.value)
  }
  componentWillMount() {
    this.props.debug_info && console.log("Component will mount:", this.props.debug_info(), this.props.value)
    this.props.cont(() => {})(this.props.value)
  }
  render(): JSX.Element[] {
    this.props.debug_info && console.log("Render:", this.props.debug_info())
    return []
  }
}

export let unit = function<A>(x:A, key?:string, dbg?:() => string) : C<A> { return make_C<A>(ctxt => cont =>
  (React.createElement<UnitProps<A>>(Unit, { kind:"unit", debug_info:dbg, value:x, context:ctxt, cont:cont, key:key }))) }

export type JoinProps<A> = { p:C<C<A>> } & CmdCommon<A>
export type JoinState<A> = { p_inner:"waiting"|JSX.Element, p_outer:JSX.Element }
class Join<A> extends React.Component<JoinProps<A>,JoinState<A>> {
  constructor(props:JoinProps<A>,context:any) {
    super(props, context)
    this.state = { p_inner:"waiting", p_outer:props.p.comp(props.context)(cont => p_inner =>
      this.setState({...this.state,
        p_inner:p_inner.comp(this.props.context)(cb => x => this.props.cont(cb)(x))})) }
  }
  componentWillReceiveProps(new_props:JoinProps<A>) {
    new_props.debug_info && console.log("New join props:", new_props.debug_info())
    this.setState({ p_outer:new_props.p.comp(new_props.context)(cont => p_inner =>
      this.setState({...this.state,
        p_inner:p_inner.comp(new_props.context)(cb => x => new_props.cont(cb)(x))})) })
  }
  render() {
    return <div>
        { this.state.p_outer }
        { this.state.p_inner == "waiting" 
          ? [] 
          : this.state.p_inner }
      </div>
  }
}

let join = function<A>(p:C<C<A>>, key?:string, dbg?:() => string) : C<A> {
  return make_C<A>(ctxt => cont => React.createElement<JoinProps<A>>(Join, { p:p, context:ctxt, cont: cont, debug_info:dbg, key:key }))
}



type BindState<B,A> = { k:"waiting for p"|JSX.Element, p:"creating"|JSX.Element }
class Bind<B,A> extends React.Component<BindProps<B,A>,BindState<B,A>> {
  constructor(props:BindProps<B,A>,context:any) {
    super(props, context)
    this.state = { k:"waiting for p", p:"creating" }
  }
  componentWillReceiveProps(new_props:BindProps<B,A>) {
    this.props.debug_info && console.log("New props:", this.props.debug_info())
    if (this.props.once)
      this.setState({...this.state, p:"creating" })
    else
      this.setState({...this.state, p:new_props.p.comp(new_props.context)(callback => x =>
              this.setState({...this.state,
                k:new_props.k(x).comp(new_props.context)(callback => x =>
                  new_props.cont(callback)(x))}, callback)
            )})
  }
  componentWillMount() {
    this.setState({...this.state, p:this.props.p.comp(this.props.context)(callback => x =>
            this.setState({...this.state,
              k:this.props.k(x).comp(this.props.context)(callback => x =>
                this.props.cont(callback)(x))}, callback)
          )})
  }
  render() {
    this.props.debug_info && console.log("Render:", this.props.debug_info())
    return <div className={`bind ${this.props.className || ""}`}>
      {
        (this.state.k == "waiting for p" || !this.props.once) && this.state.p != "creating" 
          ? this.state.p
          : []
      }
      {
        this.state.k != "waiting for p" 
          ? this.state.k
          : []
      }
    </div>
  }
}

export let bind = function<A,B>(key:string, p:C<A>, k:((_:A)=>C<B>), className?:string, dbg?:() => string) : C<B> {
  let q = p.map(k, `${key}_map`, dbg);
  return join(q, `${key}_join`, dbg);
  // return make_C<B>(ctxt => cont =>
  //   (React.createElement<BindProps<A,B>>(Bind,
  //     { kind:"bind", debug_info:dbg, p:p, k:k, once:false, cont:cont, context:ctxt, key:key, className:className })))
}

type MapState<A,B> = { p:"creating"|JSX.Element }
class Map<A,B> extends React.Component<MapProps<A,B>,MapState<A,B>> {
  constructor(props:MapProps<A,B>,context:any) {
    super(props, context)
    this.state = { p:"creating" }
  }
  componentWillReceiveProps(new_props:MapProps<A,B>) {
    this.props.debug_info && console.log("New props:", this.props.debug_info())
    this.setState({...this.state, p:new_props.p.comp(new_props.context)(callback => x => new_props.cont(callback)(new_props.f(x)))})
  }
  componentWillMount() {
    this.setState({...this.state, p:this.props.p.comp(this.props.context)(callback => x => this.props.cont(callback)(this.props.f(x)))})
  }
  render() {
    this.props.debug_info && console.log("Render:", this.props.debug_info())
    return this.state.p != "creating" 
      ? this.state.p 
      : []
  }
}

export let map = function<A,B>(key?:string, dbg?:() => string) : ((_:(_:A) => B) => (_:C<A>) => C<B>) {
  return f => p =>
    make_C<B>(ctxt => cont =>
      React.createElement<MapProps<A,B>>(Map,
        { kind:"map", debug_info:dbg, p:p, f:f, context:ctxt, cont:cont, key:key }))
}

type FilterState<A> = { p:"creating"|JSX.Element }
class Filter<A> extends React.Component<FilterProps<A>,FilterState<A>> {
  constructor(props:FilterProps<A>,context:any) {
    super(props, context)
    this.state = { p:"creating" }
  }
  componentWillReceiveProps(new_props:FilterProps<A>) {
    this.props.debug_info && console.log("New props:", this.props.debug_info())
    this.setState({...this.state, p:new_props.p.comp(new_props.context)(callback => x => { if (new_props.f(x)) { new_props.cont(callback)(x) } })})
  }
  componentWillMount() {
    this.setState({...this.state, p:this.props.p.comp(this.props.context)(callback => x => { if (this.props.f(x)) { this.props.cont(callback)(x) } })})
  }
  render() {
    this.props.debug_info && console.log("Render:", this.props.debug_info())
    return this.state.p != "creating" 
      ? this.state.p 
      : []
  }
}

export let filter = function<A>(key?:string, dbg?:() => string) : ((_:(_:A) => boolean) => (_:C<A>) => C<A>) {
  return f => p =>
    make_C<A>(ctxt => cont =>
      React.createElement<FilterProps<A>>(Filter,
        { kind:"filter", debug_info:dbg, p:p, f:f, context:ctxt, cont:cont, key:key }))
}





export type SimpleApplicationProps<A> = { p:C<A>, cont:(_:A)=>void }
export type SimpleApplicationState<A> = { context:Context }
export class SimpleApplication<A> extends React.Component<SimpleApplicationProps<A>, SimpleApplicationState<A>> {
  constructor(props:SimpleApplicationProps<A>, context:any) {
    super(props, context)

    this.state = { context:this.context_from_props(this.props, unit<void>(null)) }
  }

  context_from_props(props:SimpleApplicationProps<A>, p:C<void>) : Context {
     let self = this
     return {
        current_page:p,
        logic_frame:0,
        force_reload:(callback) =>
          make_C<void>(ctxt => inner_callback => this.setState({...this.state, context:{...this.state.context, logic_frame:this.state.context.logic_frame+1}},
              () => inner_callback(callback)(null)) || null),
        set_page:function<T>(x:T, new_page:Route<T>, callback?:()=>void) {
          return unit<void>(null)
        },
        set_url:function<T>(x:T, new_url:Url<T>, callback?:()=>void) {
          return unit<void>(null)
        },
        push_route:function(route, callback?:()=>void) {
          return unit<void>(null)
        },
        set_routes:function(routes, callback?:()=>void) {
          return unit<void>(null)
        }
      }
  }

  render() {
    return <div className="monadic-application" key={`application@${this.state.context.logic_frame}`}>
      {
        this.props.p.comp(() => this.state.context)(callback => x => this.props.cont(x))
      }
    </div>
  }
}

export let simple_application = function<A>(p:C<A>, cont:(_:A)=>void) : JSX.Element {
  return React.createElement<SimpleApplicationProps<A>>(SimpleApplication, { p:p, cont:cont })
}