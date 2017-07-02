import * as React from "react"
import * as ReactDOM from "react-dom"
import {List, Map, Set} from "immutable"
import * as Immutable from "immutable"
import * as Models from '../generated_models'
import * as Api from '../generated_api'
import * as ViewUtils from '../generated_views/view_utils'
import {C, Cont, unit, bind} from '../react_monad/core'
import {string, int, bool} from '../react_monad/primitives'
import {button, selector, multi_selector, label, image} from '../react_monad/html'
import {custom, repeat, any, lift_promise, retract, delay, menu} from '../react_monad/combinators'

type CounterProps = { target:number, cont:Cont<number> }
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
  custom<number>()(cont => <Counter target={n} cont={cont} />).bind<void>(`counter`, s =>
  string("view")(`The component has ticked ${s} times.`).ignore()))
