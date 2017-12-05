import * as React from "react"
import * as ReactDOM from "react-dom"
import * as Immutable from "immutable"
import * as Moment from "moment"
import {C, unit, bind, Mode, make_C, CmdCommon} from '../react_monad/core'
import {string, number, bool} from '../react_monad/primitives'
import {button, selector, multi_selector, label, image} from '../react_monad/html'
import {custom, repeat, any, lift_promise, retract, delay, simple_menu, hide} from '../react_monad/combinators'

type MemoizerProps<A,B> = {
  kind:"memoizer",
  value: A,
  input: (_:A) => C<B>,
  time: number
} & CmdCommon<B>

type MemoizerState<A,B> = {  
  value: A
  last_command:JSX.Element 
}

class Memoizer<A,B> extends React.Component<MemoizerProps<A,B>,MemoizerState<A,B>> {
  constructor(props:MemoizerProps<A,B>,context:any) {
    super(props, context)
    this.state = {value:props.value, last_command:props.input(props.value).comp(props.context)(props.cont) }

  }
  componentWillReceiveProps(new_props:MemoizerProps<A,B>) {
    new_props.debug_info && console.log("New props:", new_props.debug_info()) 
  }
  componentWillMount() {
    this.props.debug_info && console.log("Component will mount:", this.props.debug_info())
  }
  render() {
    this.props.debug_info && console.log("Render:", this.props.debug_info())
    return this.state.last_command
  }
}

export let memoizer = function<A,B>(value: A, input:(_:A) => C<B>, time?:number, key?:string, dbg?:() => string) :C<B> {
  return make_C<B>(context => cont =>
        React.createElement<MemoizerProps<A,B>>(Memoizer,
          { kind:"memoizer",value: value, input:input, time: time,  cont:cont, context:context, key:key,  debug_info:dbg }))
}