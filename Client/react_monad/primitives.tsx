import * as React from "react"
import * as ReactDOM from "react-dom"
import * as Immutable from "immutable"
import {C, Cont, CmdCommon, make_C, unit, bind} from './core'

export type Mode = "edit"|"view"
export type IntProps = { kind:"int", value:number, mode:Mode } & CmdCommon<number>
export type StringProps = { kind:"string", value:string, mode:Mode } & CmdCommon<string>
export type BooleanStyle = "checkbox"|"fancy toggle"|"plus/minus"
export type BoolProps = { kind:"bool", value:boolean, mode:Mode, style:BooleanStyle } & CmdCommon<boolean>

type IntState = { value:number }
class Int extends React.Component<IntProps,IntState> {
  constructor(props:IntProps,context:any) {
    super()
    this.state = { value:props.value }
  }
  componentWillReceiveProps(new_props:IntProps) {
    if (new_props.value != this.state.value)
      this.setState({...this.state, value: new_props.value}, () => this.call_cont(this.state.value))
  }
  componentWillMount() {
    this.call_cont(this.state.value)
  }
  call_cont(value:number) {
    this.props.cont(()=>null)(value)
  }
  render() {
    return this.props.mode == "edit" ? <input type="number"
                  value={this.state.value}
                  onChange={e => {
                    let new_value = isNaN(e.currentTarget.valueAsNumber) ? 0 : e.currentTarget.valueAsNumber
                    if (new_value == this.state.value) return
                    this.setState({...this.state, value:new_value},
                      () => this.props.cont(()=>null)(this.state.value))}
                  }/>
            :
              <span>{this.state.value}</span>
  }
}

export let int = (mode:Mode, key?:string, dbg?:() => string) => function(value:number) : C<number> {
  return make_C<number>(cont =>
    React.createElement<IntProps>(Int,
    { kind:"int", debug_info:dbg, mode:mode, value:value, cont:cont, key:key }))
}

type StringState = { value:string }
class String extends React.Component<StringProps,StringState> {
  constructor(props:StringProps,context:any) {
    super()
    this.state = { value:props.value }
  }
  componentWillReceiveProps(new_props:StringProps) {
    if (new_props.value != this.state.value)
      this.setState({...this.state, value: new_props.value}, () => this.call_cont(this.state.value))
  }
  componentWillMount() {
    this.call_cont(this.state.value)
  }
  call_cont(value:string) {
    this.props.cont(()=>null)(value)
  }
  render() {
    return this.props.mode == "edit" ? <input type="text"
                  value={this.state.value}
                  onChange={e => {
                    if (this.state.value == e.currentTarget.value) return
                    this.setState({...this.state,
                      value:e.currentTarget.value},
                      () => this.call_cont(this.state.value))}
                  } />
            :
              <span>{this.state.value}</span>
  }
}

export let string = (mode:Mode, key?:string, dbg?:() => string) => function(value:string) : C<string> {
  return make_C<string>(cont =>
    React.createElement<StringProps>(String, { kind:"string", debug_info:dbg, mode:mode, value:value, cont:cont, key:key }))
}


type BoolState = { value:boolean }
class Bool extends React.Component<BoolProps,BoolState> {
  constructor(props:BoolProps,context:any) {
    super()
    this.state = { value:props.value }
  }
  componentWillReceiveProps(new_props:BoolProps) {
    if (new_props.value != this.state.value)
      this.setState({...this.state, value: new_props.value}, () => this.call_cont(this.state.value))
  }
  componentWillMount() {
    this.call_cont(this.state.value)
  }
  call_cont(value:boolean) {
    this.props.cont(()=>null)(value)
  }
  render() {
    return this.props.style == "fancy toggle" ?
            <input type="checkbox"
              className="monadic-input-choices monadic-input-choices--switch"
              disabled={this.props.mode == "view"}
              checked={this.state.value}
              onChange={e =>
                this.setState({...this.state,
                  value:e.currentTarget.checked },
                  () => this.props.cont(()=>null)(this.state.value))} />
            : this.props.style == "plus/minus" ?
                <a disabled={this.props.mode == "view"} className={`button button--toggle ${this.state.value ? 'button--toggle--open' : ''}`}
                  onClick={() => this.setState({...this.state, value:!this.state.value},
                                  () => this.props.cont(()=>null)(this.state.value))}>
                  <span></span>
                </a>
            :
              <input type="checkbox"
                className="monadic-input-choices monadic-input-choices--checkbox"
                disabled={this.props.mode == "view"}
                checked={this.state.value}
                onChange={e =>
                  this.setState({...this.state,
                    value:e.currentTarget.checked },
                    () => this.props.cont(()=>null)(this.state.value))} />

    // return this.props.mode == "edit" ?
  }
}

export let bool = (mode:Mode, style:BooleanStyle, key?:string, dbg?:() => string) => function(value:boolean) : C<boolean> {
  return make_C<boolean>(cont =>
    React.createElement<BoolProps>(Bool, { kind:"bool", debug_info:dbg, style:style, mode:mode, value:value, cont:cont, key:key }))
}