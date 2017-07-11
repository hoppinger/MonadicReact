import * as React from "react"
import * as ReactDOM from "react-dom"
import * as Immutable from "immutable"
import * as Models from '../generated_models'
import * as Api from '../generated_api'
import * as ViewUtils from '../generated_views/view_utils'
import {C, unit, bind, Mode, make_C, CmdCommon} from '../react_monad/core'
import {string, number, bool} from '../react_monad/primitives'
import {button, selector, multi_selector, label, image} from '../react_monad/html'
import {custom, repeat, any, lift_promise, retract, delay, menu, hide} from '../react_monad/combinators'

export type Page<A> = { num_pages:number, page_index:number, items:A }
type PaginateState<A,B> = {
  page_index:number,
  get_page_cache:"loading"|JSX.Element
  current_page:"loading"|Page<A>,
  page_cache:"loading"|JSX.Element }
type PaginateProps<A,B> = {
  kind:"paginate",
  items_per_page:number,
  get_page:(page_index:number, items_per_page:number) => C<Page<A>>,
  renderer:((items:A) => C<B>) } & CmdCommon<B>

class Paginate<A,B> extends React.Component<PaginateProps<A,B>,PaginateState<A,B>> {
  constructor(props:PaginateProps<A,B>,context:any) {
    super()
    this.state = { page_index:0, get_page_cache:"loading", current_page:"loading", page_cache:"loading" }
  }
  componentWillReceiveProps(new_props:PaginateProps<A,B>) {
    new_props.debug_info && console.log("New props:", new_props.debug_info())
    this.setState({...this.state,
      get_page_cache:new_props.get_page(this.state.page_index, new_props.items_per_page).comp(new_props.context)(callback => page =>
      this.setState({...this.state, current_page:page, page_cache:new_props.renderer(page.items).comp(new_props.context)(new_props.cont)}))})
  }
  componentWillMount() {
    this.props.debug_info && console.log("Component will mount:", this.props.debug_info())
    this.setState({...this.state,
      get_page_cache:this.props.get_page(this.state.page_index, this.props.items_per_page).comp(this.props.context)(callback => page =>
      this.setState({...this.state, current_page:page, page_cache:this.props.renderer(page.items).comp(this.props.context)(this.props.cont)}))})
  }
  goto(page_index:number) {
    this.setState({...this.state,
      get_page_cache:this.props.get_page(page_index, this.props.items_per_page).comp(this.props.context)(callback => page =>
      this.setState({...this.state, current_page:page, page_cache:this.props.renderer(page.items).comp(this.props.context)(this.props.cont)}))})
  }
  render() {
    this.props.debug_info && console.log("Render:", this.props.debug_info())
    return <div className="monadic-paginated-content">
      {this.state.get_page_cache != "loading" ? this.state.get_page_cache : null}
      { this.state.current_page != "loading" && this.state.current_page.num_pages > 1 ?
        <div className="monadic-paginator">
          { this.state.current_page.page_index > 0 && this.state.current_page.num_pages > 3 ? <a className="page first-page" style={{margin:"5px"}}
              onClick={() => this.goto(0)}>{1}</a> : null}
          {
            this.state.current_page.page_index > 2 ? "..." : null
          }
          {this.state.current_page.page_index > 0 ?
            <a className="page prev-page" style={{margin:"5px"}} onClick={() => this.goto(this.state.current_page != "loading" && this.state.current_page.page_index - 1)}>{'<'}</a> : null}
          {/*{this.state.current_page.page_index > 0 ?
            <a className="page" style={{margin:"5px"}} onClick={() => this.goto(this.state.current_page != "loading" && this.state.current_page.page_index - 1)}>{this.state.current_page.page_index}</a> : null}*/}
          { <span className="page current-page" style={{margin:"5px"}}>{this.state.current_page.page_index + 1}</span>}
          {/*{this.state.current_page.page_index < this.state.current_page.num_pages - 1 ?
            <a className="page" style={{margin:"5px"}} onClick={() => this.state.current_page != "loading" && this.goto(this.state.current_page.page_index + 1)}>{this.state.current_page.page_index + 2}</a> : null}*/}
          {this.state.current_page.page_index < this.state.current_page.num_pages - 1 ?
            <a className="page next-page" style={{margin:"5px"}} onClick={() => this.state.current_page != "loading" && this.goto(this.state.current_page.page_index + 1)}>{'>'}</a> : null}
          {
            this.state.current_page.page_index < this.state.current_page.num_pages - 2 ? "..." : null
          }
          { this.state.current_page.page_index < this.state.current_page.num_pages - 1 &&  this.state.current_page.num_pages > 3 ?
            <a className="page last-page" style={{margin:"5px"}} onClick={() => this.state.current_page != "loading" && this.goto(this.state.current_page.num_pages - 1)}>{this.state.current_page.num_pages}</a> : null}
        </div>
        :
          null }
      {this.state.page_cache != "loading" ? this.state.page_cache : null}
    </div>
  }
}


export let paginate =
  function<A,B>(items_per_page:number, get_page:((current_page:number, items_per_page:number) => C<Page<A>>), key?:string, dbg?:() => string) :
    ((renderer:((items:A) => C<B>)) => C<B>) {
      return renderer => make_C<B>(context => cont =>
        React.createElement<PaginateProps<A,B>>(Paginate,
          { kind:"paginate", items_per_page:items_per_page,
            get_page:get_page, renderer:renderer,
            cont:cont, context:context, key:key, debug_info:dbg }))
    }

