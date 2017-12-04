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
  input: (any) => C<B>,
  time: number
} & CmdCommon<B>

type MemoizerState<A,B> = {  }

class Memoizer<A,B> extends React.Component<MemoizerProps<A,B>,MemoizerState<A,B>> {
  constructor(props:MemoizerProps<A,B>,context:any) {
    super(props, context)
    
  }
  componentWillReceiveProps(new_props:MemoizerProps<A,B>) {
    
  }
  componentWillMount() {
    
  }
  render() {
    return undefined
  }
}

export let memoizer = function<A,B>(input:(any) => C<B>, time?:number, key?:string, dbg?:() => string) :C<B> {
  return make_C<B>(context => cont =>
        React.createElement<MemoizerProps<A,B>>(Memoizer,
          { kind:"memoizer", input:input, time: time,  cont:cont, context:context, key:key,  debug_info:dbg }))
}