import * as React from "react"
import * as ReactDOM from "react-dom"
import * as Immutable from "immutable"
import {never} from './combinators'

export type CmdCommon<A> = { cont:Cont<A>, context:Context, key:string, debug_info:() => string }
export type UnitProps<A> = { kind:"unit", value:A } & CmdCommon<A>
export type BindProps<B,A> = { kind:"bind", once:boolean, p:C<B>, k:(_:B) => C<A>, className:string } & CmdCommon<A>
export type MapProps<A,B> = { kind:"map", p:C<A>, f:(_:A)=>B } & CmdCommon<B>
export type FilterProps<A> = { kind:"filter", p:C<A>, f:(_:A)=>boolean } & CmdCommon<A>
export type Mode = "edit"|"view"

export type Context = {
  mode:Mode
  set_mode:(new_mode:Mode, callback?:()=>void) => void
  logic_frame:number,
  force_reload:(callback?:()=>void) => void
  current_page:C<void>
  pages:Immutable.Stack<C<void>>
  set_page:(new_page:C<void>, callback?:()=>void) => void
  push_page:(new_page:C<void>, callback?:()=>void) => void
  pop_page:(callback?:()=>void) => void
}

export type Cont<A> = (callback:() => void) => (_:A) => void
export type C<A> = {
  comp:(ctxt:Context) => (cont:Cont<A>) => JSX.Element
  bind:<B>(key:string, k:(_:A)=>C<B>, className?:string, dbg?:()=>string)=>C<B>
  // bind_once:<B>(key:string, k:(_:A)=>C<B>, dbg?:()=>string)=>C<B>
  never:<B>(key?:string)=>C<B>
  ignore:(key?:string)=>C<void>
  ignore_with:<B>(x:B)=>C<B>
  map:<B>(f:(_:A)=>B, key?:string, dbg?:()=>string)=>C<B>,
  filter:(f:(_:A)=>boolean, key?:string, dbg?:()=>string)=>C<A>
}

export function make_C<A>(comp:(ctxt:Context) => (cont:Cont<A>) => JSX.Element) : C<A> {
  return {
    comp:comp,
    bind:function<B>(this:C<A>, key:string, k:(_:A)=>C<B>, className?:string, dbg?:()=>string) : C<B> {
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
      return this.bind<B>(``, _ => unit<B>(x))
    },
    ignore:function(this:C<A>, key?:string) : C<void> {
      return this.bind(key, _ => unit<void>(null))
    }
  }
}

type UnitState<A> = {}
class Unit<A> extends React.Component<UnitProps<A>,UnitState<A>> {
  constructor(props:UnitProps<A>,context:any) {
    super()
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
  render() {
    this.props.debug_info && console.log("Render:", this.props.debug_info())
    return null
  }
}

export let unit = function<A>(x:A, key?:string, dbg?:() => string) : C<A> { return make_C<A>(ctxt => cont =>
  (React.createElement<UnitProps<A>>(Unit, { kind:"unit", debug_info:dbg, value:x, context:ctxt, cont:cont, key:key }))) }

type BindState<B,A> = { k:"waiting for p"|JSX.Element, p:"creating"|JSX.Element }
class Bind<B,A> extends React.Component<BindProps<B,A>,BindState<B,A>> {
  constructor(props:BindProps<B,A>,context:any) {
    super()
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
        (this.state.k == "waiting for p" || !this.props.once) && this.state.p != "creating" ?
          this.state.p
        :
          null
      }
      {
        this.state.k != "waiting for p" ?
          this.state.k
        :
          null
      }
    </div>
  }
}

export let bind = function<A,B>(key:string, p:C<A>, k:((_:A)=>C<B>), className?:string, dbg?:() => string) : C<B> {
  return make_C<B>(ctxt => cont =>
    (React.createElement<BindProps<A,B>>(Bind,
      { kind:"bind", debug_info:dbg, p:p, k:k, once:false, cont:cont, context:ctxt, key:key, className:className })))
}

// export let bind_once = function<A,B>(key:string, p:C<A>, k:((_:A)=>C<B>), dbg?:() => string) : C<B> {
//   return make_C<B>(cont =>
//     (React.createElement<BindProps<A,B>>(Bind,
//       ({ kind:"bind", debug_info:dbg, p:p, k:k, once:true, cont:cont, key:key }))))
// }


type MapState<A,B> = { p:"creating"|JSX.Element }
class Map<A,B> extends React.Component<MapProps<A,B>,MapState<A,B>> {
  constructor(props:MapProps<A,B>,context:any) {
    super()
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
    return this.state.p != "creating" ? this.state.p : null
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
    super()
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
    return this.state.p != "creating" ? this.state.p : null
  }
}

export let filter = function<A>(key?:string, dbg?:() => string) : ((_:(_:A) => boolean) => (_:C<A>) => C<A>) {
  return f => p =>
    make_C<A>(ctxt => cont =>
      React.createElement<FilterProps<A>>(Filter,
        { kind:"filter", debug_info:dbg, p:p, f:f, context:ctxt, cont:cont, key:key }))
}
