import * as React from "react"
import * as ReactDOM from "react-dom"
import {List, Map, Set} from "immutable"
import * as Immutable from "immutable"
import {UrlTemplate, application, get_context, Route, Url, make_url, fallback_url, link_to_route,
Option, C, Mode, unit, bind, string, number, bool, button, selector, multi_selector, label, h1, h2, div, form, image, link, file, overlay,
custom, repeat, all, any, lift_promise, retract, delay, Context, Cont,
simple_menu, mk_menu_entry, mk_submenu_entry, MenuEntry, MenuEntryValue, MenuEntrySubMenu,
rich_text, paginate, Page, list, editable_list} from '../../../dist/monadic_react'

type CounterProps = { target:number, context:()=>Context, cont:Cont<number> }
type CounterState = { current:number, signals_sent:number }
class Counter extends React.Component<CounterProps, CounterState> {
  constructor(props:CounterProps, context:any) {
    super(props, context)

    this.state = { current:0, signals_sent:0 }
  }

  render() {
    return <div>
      <label style={{margin:"10px"}}>Progress: {this.state.current}/{this.props.target}</label>
      <button onClick={() => this.setState({...this.state, current: this.state.current+1}, () =>
        this.state.current >= this.props.target + 1 && this.setState({...this.state, current: 0}, () =>
        this.props.cont(() =>
          this.setState({...this.state, signals_sent:this.state.signals_sent+1}))
          (this.state.signals_sent + 1)))}>+1</button>
    </div>
  }
}

export let selector_sample : C<void> =
  selector<number>("dropdown", x => x.toString())(List<number>([1, 3, 5])).bind(`target_selector`, n =>
  custom<number>()(ctxt => cont => <Counter target={n} context={ctxt} cont={cont} />).bind<void>(`counter`, s =>
  string("view")(`The component has ticked ${s} times.`).ignore()))
