import * as React from "react"
import * as ReactDOM from "react-dom"
import * as Immutable from "immutable"

export type Cont<A> = (callback:() => void) => (_:A) => void
export type C<A> = (cont:Cont<A>) => JSX.Element

export let unit = function<A>(x:A) : C<A> { return cont => { cont(() => null)(x); return null } }
// export let bind = function<A,B>(p:C<A>, k:((_:A)=>C<B>)) : C<B> {
//   return (cont) => p(x=> k(x)(cont))
// }

export let bind = function<A,B>(key:string, log:string, p:C<A>, k:((_:A)=>C<B>)) : C<B> {
  log && console.log("binding", log)
  type Props = { cont:Cont<B> }
  type State = { status:"waiting for p"|JSX.Element }
  class Bind extends React.Component<Props,State> {
    constructor(props:Props,context:any) {
      super()
      this.state = { status:"waiting for p" }
    }
    render() {
      return <div key={`${key}_bind`} className="bind">
        {
          p(callback => x =>
            this.setState({...this.state, status:k(x)(this.props.cont)}, callback))
        }
        {
          this.state.status != "waiting for p" ?
            this.state.status
          :
            null
        }
      </div>
    }
  }
  return cont => React.createElement<Props>(Bind, { key:key, cont:cont })
}

export let bind_once = function<A,B>(key:string, log:string, p:C<A>, k:((_:A)=>C<B>)) : C<B> {
  log && console.log("binding once", log)
  type Props = { cont:Cont<B> }
  type State = { status:"waiting for p"|JSX.Element }
  class Bind extends React.Component<Props,State> {
    constructor(props:Props,context:any) {
      super()
      this.state = { status:"waiting for p" }
    }
    render() {
      return this.state.status != "waiting for p" ?
            this.state.status
          :
            p(callback => x => this.setState({...this.state, status:k(x)(this.props.cont)}, callback))
    }
  }
  return cont => React.createElement<Props>(Bind, { key:key, cont:cont })
}
