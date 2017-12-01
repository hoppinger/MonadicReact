import * as React from "react"
import * as ReactDOM from "react-dom"
import * as Immutable from "immutable"
import {C, unit, bind, Mode, make_C, CmdCommon} from '../react_monad/core'
import {string, number, bool} from '../react_monad/primitives'
import {button, selector, multi_selector, label, image} from '../react_monad/html'
import {custom, repeat, any, lift_promise, retract, delay, simple_menu, hide} from '../react_monad/combinators'
import {paginate, Page} from '../react_monad/paginator'

type ListProps<A,B> = {
  kind:"list",
  items:Immutable.List<A>
  className:string,
  renderer:((index:number) => (_:A) => C<B>) } & CmdCommon<B>
type ListState<A,B> = { ps:"creating"|Immutable.List<JSX.Element> }
class List<A,B> extends React.Component<ListProps<A,B>,ListState<A,B>> {
  constructor(props:ListProps<A,B>,context:any) {
    super(props, context)
    this.state = { ps:"creating" }
  }
  componentWillReceiveProps(new_props:ListProps<A,B>) {
    this.setState({...this.state,
      ps:new_props.items.map((item, index) =>
          new_props.renderer(index)(item).comp(new_props.context)(callback => new_value =>
            new_props.cont(callback)(new_value))).toList()})
  }
  componentWillMount() {
    this.setState({...this.state,
      ps:this.props.items.map((item, index) =>
          this.props.renderer(index)(item).comp(this.props.context)(callback => new_value =>
            this.props.cont(callback)(new_value))).toList()})
  }
  render() {
    return <div className={`monadic-list ${this.props.className || ""}`}> { this.state.ps != "creating" ? this.state.ps : null } </div>
  }
}

export let list = function<A,B>(items:Immutable.List<A>, key?:string, className?:string, dbg?:() => string) : ((renderer:(index:number) => (_:A)=> C<B>) => C<B>) {
  return renderer => make_C<B>(context => cont =>
        React.createElement<ListProps<A,B>>(List,
          { kind:"list",
            items:items, renderer:renderer,
            cont:cont, context:context, key:key, className:className, debug_info:dbg }))
}
