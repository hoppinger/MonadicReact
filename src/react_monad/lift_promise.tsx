import * as React from "react"
import * as ReactDOM from "react-dom"
import * as Immutable from "immutable"
import * as i18next from 'i18next'

import {C, Mode, Cont, CmdCommon, Context, make_C, unit, bind} from './core'
import {div, a} from './html'
import {bool} from './primitives'

export type LiftPromiseProps<A,B> = { 
  kind:"lift promise", 
  p:(_:B)=>Promise<A>, 
  retry_strategy:RetryStrategy, 
  value:B,
  times: number,
  on_failure:C<B>, 
} & CmdCommon<A>

export type RetryStrategy = "never" | "semi exponential" | "retry then show failure"
//  { kind:"retry then show failure", times:number, on_failure:C<B> }
//export type RetryNStrategy<A,B> = { kind:"retry then show failure", times:number, on_failure:C<B> }


type LiftPromiseState<A,B> = { 
  result:"busy"|"error"|A, 
  input:any,
  retry_count: number 
}

class LiftPromise<A,B> extends React.Component<LiftPromiseProps<A,B>,LiftPromiseState<A,B>> {
  constructor(props:LiftPromiseProps<A,B>,context:any) {
    super()
    this.state = { result:"busy", input:props.value, retry_count: 0 }
  }
  componentWillReceiveProps(new_props:LiftPromiseProps<A,B>) {
    // if (this.state.result != "busy" && this.state.result != "error") {
    //   this.props.debug_info && console.log("New props (ignored):", this.props.debug_info(), this.state.input, new_props.value)
    //   return
    // }
    this.props.debug_info && console.log("New props:", this.props.debug_info(), this.state.input, new_props.value)
    this.setState({...this.state, input:new_props.value}, () =>
    this.load(new_props))
  }
  wait_time:number = 500
  stopped:boolean = false
  load(props:LiftPromiseProps<A,B>) {
    if (this.stopped) return
    this.setState({...this.state, result:"busy"}, () =>
    props.p(this.state.input).then(x => {
      this.wait_time = 500
      if (this.props.debug_info) console.log("Promise done:", this.props.debug_info())
      if (this.stopped) return
      this.setState({...this.state, result:x}, () => props.cont(() => null)(x))
    })
    .catch(() => {
      if (props.retry_strategy == "never") {
        if (this.stopped) return
        this.setState({...this.state, result:"error"})
      } else if (props.retry_strategy == "semi exponential") {
        this.wait_time = Math.floor(Math.max(this.wait_time * 1.5, 2500))
        setTimeout(() => this.load(props), this.wait_time)
      } else if (props.retry_strategy == "retry then show failure") {
        if (this.state.retry_count < props.times)
        {
          this.setState({...this.state, retry_count: this.state.retry_count+1 })
          setTimeout(() => this.load(props), this.wait_time)
        }
        else
        {
          this.setState({...this.state, result:"error"})
          //this.props.on_failure
        }
      } 
    }))
  }
  componentWillUnmount() {
    this.stopped = true
  }
  componentWillMount() {
    this.stopped = false
    this.props.debug_info && console.log("Mount:", this.props.debug_info())
    this.load(this.props)
  }
  render() {
    this.props.debug_info && console.log("Render:", this.props.debug_info())
    return this.state.result == "busy" ? <div className="busy">{i18next.t("busy")}</div>
            : this.state.result == "error" ? <div className="error">{i18next.t("error")}</div>
            : null 
  }
}

export let lift_promise_new = function<A,B>(p:(_:A) => Promise<B>, retry_strategy:RetryStrategy, times?:number, on_failure?:C<A>,  key?:string, dbg?:() => string) : ((_:A)=>C<B>) {
  return x => make_C<B>(ctxt => cont =>
    React.createElement<LiftPromiseProps<B,A>>(LiftPromise,
      { kind:"lift promise", debug_info:dbg, value:x, retry_strategy:retry_strategy, times:times, p:p, on_failure: on_failure, context:ctxt, cont:cont, key:key }))
}


