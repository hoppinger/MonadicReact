import * as React from "react"
import * as ReactDOM from "react-dom"
import * as Immutable from "immutable"
import {C, Cont, unit, bind} from './monad'

export let lift_promise = function<A,B>(key:string, p:(_:A) => Promise<B>) : ((_:A)=>C<B>) {
  type Props = { input:A, cont:Cont<B> }
  type State = { value:"busy"|"error"|B}
  class LiftPromise extends React.Component<Props,State> {
    constructor(props:Props,context:any) {
      super()
      this.state = { value:"busy" }
    }
    load() {
      p(this.props.input).then(x => this.setState({...this.state, value:x}, () => this.props.cont(() => null)(x)))
       .catch(() => this.setState({...this.state, value:"error"}))
    }
    componentWillMount() { this.load() }
    render() {
      return this.state.value == "busy" ? <div className="busy">busy</div>
             : this.state.value == "error" ? <div className="error">Error</div>
             : null
    }
  }
  return input => cont => React.createElement<Props>(LiftPromise, { key:key, cont: cont, input: input })
}

export let retract = function<A,B>(key:string, inb:(_:A)=>B, out:(_:A)=>(_:B)=>A, p:(_:B)=>C<B>) : ((_:A) => C<A>) {
  type Props = { value:A, cont:Cont<A> }
  type State = {}
  class Focus extends React.Component<Props,State> {
    constructor(props:Props,context:any) {
      super()
      this.state = {}
    }
    render() {
      return p(inb(this.props.value))(callback => new_value => this.props.cont(callback)(out(this.props.value)(new_value)))
    }
  }
  return initial_value => cont => React.createElement<Props>(Focus, { key:key, cont: cont, value: initial_value })
}

export let repeat = function<A>(key:string, p:(_:A)=>C<A>) : ((_:A) => C<A>) {
  type Props = { initial_value:A, cont:Cont<A> }
  type State = { p_cache:JSX.Element }
  class Repeat extends React.Component<Props,State> {
    constructor(props:Props,context:any) {
      super()
      let p_cache = (v) => p(v)(continuation => new_value => {
        let new_p_cache = p_cache(new_value)
        this.setState({...this.state, p_cache:new_p_cache}, () =>
        this.props.cont(continuation)(new_value))
      })
      this.state = { p_cache:p_cache(props.initial_value) }
    }
    render() {
      return this.state.p_cache
    }
  }
  return initial_value => cont => React.createElement<Props>(Repeat, { key:key, cont: cont, initial_value: initial_value })
}

export let delay = (key:string, dt:number) => function<A>(p:(_:A)=>C<A>) : ((_:A) => C<A>) {
  type Props = { cont:Cont<A>, initial_value:A }
  type State = { status:"dirty"|"waiting", value:A }
  class Delay extends React.Component<Props,State> {
    constructor(props:Props,context:any) {
      super()
      this.state = { status:"dirty", value:props.initial_value }
    }
    running:boolean
    componentWillMount() {
      this.running = true
      let process = () => setTimeout(() => {
        if (this.state.status == "dirty") {
          this.setState({...this.state, status:"waiting"}, () => {
            this.props.cont(process)(this.state.value)
          })
        } else {
          process()
        }
      }, dt)
      process()
    }
    componentWillUnmount() {
      this.running = false
    }
    render() {
      return p(this.state.value)(callback => new_value => this.setState({...this.state, status:"dirty", value:new_value}, callback))
    }
  }
  return initial_value => cont => React.createElement<Props>(Delay, { key:key, cont: cont, initial_value: initial_value })
}
