import * as React from "react"
import * as ReactDOM from "react-dom"
import * as Immutable from "immutable"
import * as Moment from "moment"
import {C, unit, bind, Mode, make_C, CmdCommon} from '../react_monad/core'
import {string, number, bool} from '../react_monad/primitives'
import {button, selector, multi_selector, label, image} from '../react_monad/html'
import {custom, repeat, any, lift_promise, retract, delay, simple_menu, hide} from '../react_monad/combinators'
import TupleMap from "../react_monad/tuplemap"

type MemoizerProps<A,B> = {
  kind:"memoizer",
  value: A,
  input: (_:A) => C<B>,
  time: number
} & CmdCommon<B>

type MemoizerState<A,B> = {  
  value: A
  //last_command:JSX.Element 
}

class Memoizer<A,B> extends React.Component<MemoizerProps<A,B>,MemoizerState<A,B>> {
  constructor(props:MemoizerProps<A,B>,context:any) {
    super(props, context)
    this.state = {value:props.value,/* last_command:props.input(props.value).comp(props.context)(props.cont) */}
    console.log("Memoizer: ctor", Memoizer.mem_cache)
  }

  componentWillReceiveProps(new_props:MemoizerProps<A,B>) {
    new_props.debug_info && console.log("Memoizer: New props:", new_props.debug_info()) 
  }

  componentWillMount() {
    this.props.debug_info && console.log("Memoizer: Component will mount:", this.props.debug_info())
    //create cache
    if (!Memoizer.mem_cache.has([this.props.value, this.props.input.toString()]))
    {
      console.log("Add component to cache ", this.props.input.toString() )
      Memoizer.mem_cache = Memoizer.mem_cache.set([this.props.value, this.props.input.toString()], this.props.input(this.props.value).comp(this.props.context)(this.props.cont) ) 
      console.log("After add component count = ", Memoizer.mem_cache.count() )
    }
  }

  render() {
    this.props.debug_info && console.log("Memoizer: Render:", this.props.debug_info())
    console.log("in cache ", Memoizer.mem_cache.count())
    //return this.state.last_command
    return Memoizer.mem_cache.get([this.props.value, this.props.input.toString()],null)
  }

  componentWillUnmount() {
    this.props.debug_info && console.log("Memoizer: Component will unmount:", this.props.debug_info())
  }
  //static mem_cache: Immutable.Map<any,JSX.Element> = Immutable.Map<any,JSX.Element>();
  static mem_cache: TupleMap<any,JSX.Element> = new TupleMap<any,JSX.Element>();
  //static mem_cache: Map<any,JSX.Element> = new Map<any,JSX.Element>();
}

export let memoizer = function<A,B>(value: A, input:(_:A) => C<B>, time?:number, key?:string, dbg?:() => string) :C<B> {
  return make_C<B>(context => cont =>
        React.createElement<MemoizerProps<A,B>>(Memoizer,
          { kind:"memoizer",value: value, input:input, time: time,  cont:cont, context:context, key:key,  debug_info:dbg }))
}