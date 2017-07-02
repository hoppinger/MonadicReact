import * as React from "react"
import * as ReactDOM from "react-dom"
import * as Immutable from "immutable"

export type CmdCommon<A> = { cont:Cont<A>, key:string, debug_info:() => string }
export type UnitProps<A> = { kind:"unit", value:A } & CmdCommon<A>
export type BindProps<B,A> = { kind:"bind", once:boolean, p:C<B>, k:(_:B) => C<A> } & CmdCommon<A>

export type Cont<A> = (callback:() => void) => (_:A) => void
export type C<A> = {
  comp:(cont:Cont<A>) => JSX.Element
  bind:<B>(key:string, k:(_:A)=>C<B>, dbg?:()=>string)=>C<B>
  // bind_once:<B>(key:string, k:(_:A)=>C<B>, dbg?:()=>string)=>C<B>
  ignore:()=>C<void>
}

export function make_C<A>(comp:(cont:Cont<A>) => JSX.Element) : C<A> {
  return {
    comp:comp,
    bind:function<B>(this:C<A>, key:string, k:(_:A)=>C<B>, dbg?:()=>string) : C<B> {
            return bind<A,B>(key || "", this, k, dbg)
          },
    // bind_once:function<B>(this:C<A>, key:string, k:(_:A)=>C<B>, dbg?:()=>string) : C<B> {
    //         return bind_once<A,B>(key || "", this, k, dbg)
    //       },
    ignore:function(this:C<A>) : C<void> {
      return this.bind(``, _ => unit<void>(null))
    }
  }
}

type UnitState<A> = {}
class Unit<A> extends React.Component<UnitProps<A>,UnitState<A>> {
  constructor(props:UnitProps<A>,context:any) {
    super()
    this.state = {}
  }
  render() {
    this.props.debug_info && console.log("Render:", this.props.debug_info())
    return null
  }
}

export let unit = function<A>(x:A, dbg?:() => string) : C<A> { return make_C<A>(cont =>
  (React.createElement<UnitProps<A>>(Unit, { kind:"unit", debug_info:dbg, value:x, cont:cont, key:null }))) }

type BindState<B,A> = { k:"waiting for p"|JSX.Element }
class Bind<B,A> extends React.Component<BindProps<B,A>,BindState<B,A>> {
  constructor(props:BindProps<B,A>,context:any) {
    super()
    this.state = { k:"waiting for p" }
  }
  componentWillReceiveProps(new_props:BindProps<B,A>) {
    this.props.debug_info && console.log("New props:", this.props.debug_info())
    if (this.props.once) this.setState({...this.state, step:"waiting for p" })
  }
  componentWillMount() {
  }
  render() {
    this.props.debug_info && console.log("Render:", this.props.debug_info())
    return <div className="bind">
      {
        (this.state.k == "waiting for p" || !this.props.once) ?
          this.props.p.comp(callback => x =>
            this.setState({...this.state,
              k:this.props.k(x).comp(callback => x =>
                this.props.cont(callback)(x))}, callback)
          )
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

export let bind = function<A,B>(key:string, p:C<A>, k:((_:A)=>C<B>), dbg?:() => string) : C<B> {
  return make_C<B>(cont =>
    (React.createElement<BindProps<A,B>>(Bind,
      { kind:"bind", debug_info:dbg, p:p, k:k, once:false, cont:cont, key:key })))
}

// export let bind_once = function<A,B>(key:string, p:C<A>, k:((_:A)=>C<B>), dbg?:() => string) : C<B> {
//   return make_C<B>(cont =>
//     (React.createElement<BindProps<A,B>>(Bind,
//       ({ kind:"bind", debug_info:dbg, p:p, k:k, once:true, cont:cont, key:key }))))
// }