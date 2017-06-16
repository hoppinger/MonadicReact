import * as React from "react"
import * as ReactDOM from "react-dom"
import * as Immutable from "immutable"
import {C, unit, bind} from './monad'

export let string = (key:string) => function(value:string) : C<string> {
  type Props = { value:string, cont:(callback:() => void)=>(_:string)=>void }
  type State = { value:string }
  class String extends React.Component<Props,State> {
    constructor(props:Props,context:any) {
      super()
      this.state = { value:props.value }
    }
    componentWillReceiveProps(new_props:Props) {
      this.setState({...this.state, current_value: new_props.value}, ()=>this.props.cont(()=>null)(this.state.value))
    }
    render() {
      return <input key={`${key}_input`} type="text"
                    value={this.state.value}
                    onChange={e =>
                      this.setState({...this.state,
                        value:e.currentTarget.value},
                        ()=>this.props.cont(()=>null)(this.state.value))} />
    }
  }
  return cont => React.createElement<Props>(String, { key:key, cont: cont, value: value })
}
