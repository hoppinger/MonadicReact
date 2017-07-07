import * as React from "react"
import * as ReactDOM from "react-dom"
import * as Immutable from "immutable"
import * as Moment from 'moment'
import {C, Cont, CmdCommon, make_C, unit, bind} from './core'

function format_int(num:number, length:number) : string {
    return (num / Math.pow(10, length)).toFixed(length).substr(2);
}

export type Mode = "edit"|"view"
export type NumberProps = { kind:"number", value:number, mode:Mode } & CmdCommon<number>
export type StringType = "email"|"tel"|"text"|"url"
export type StringProps = { kind:"string", value:string, type:StringType, mode:Mode } & CmdCommon<string>
export type BooleanStyle = "checkbox"|"fancy toggle"|"plus/minus"
export type BoolProps = { kind:"bool", value:boolean, mode:Mode, style:BooleanStyle } & CmdCommon<boolean>
export type DateProps = { kind:"date", value:Moment.Moment, mode:Mode } & CmdCommon<Moment.Moment>
export type DateTimeProps = { kind:"date time", value:Moment.Moment, mode:Mode } & CmdCommon<Moment.Moment>
export type TimeProps = { kind:"time", value:Moment.Moment, mode:Mode } & CmdCommon<Moment.Moment>

type IntState = { value:number }
class Number extends React.Component<NumberProps,IntState> {
  constructor(props:NumberProps,context:any) {
    super()
    this.state = { value:props.value }
  }
  componentWillReceiveProps(new_props:NumberProps) {
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
    return this.props.mode == "edit" && this.props.context.mode == "edit" ?
        <input type="number"
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

export let number = (mode:Mode, key?:string, dbg?:() => string) => function(value:number) : C<number> {
  return make_C<number>(ctxt => cont =>
    React.createElement<NumberProps>(Number,
    { kind:"number", debug_info:dbg, mode:mode, value:value, context:ctxt, cont:cont, key:key }))
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
    return this.props.mode == "edit" && this.props.context.mode == "edit" ? <input type={this.props.type}
                  value={this.state.value}
                  onChange={e => {
                    if (this.state.value == e.currentTarget.value) return
                    this.setState({...this.state,
                      value:e.currentTarget.value},
                      () => this.call_cont(this.state.value))}
                  } />
            :
              this.props.type == "text" ?
                 <span>{this.state.value}</span>
              : this.props.type == "tel" ?
                <a href={`tel:${this.state.value}`}>{this.state.value}</a>
              : this.props.type == "email" ?
                <a href={`mailto:${this.state.value}`}>{this.state.value}</a>
              : this.props.type == "url" ?
                <a href={this.state.value}>{this.state.value}</a>
              :
                <span>{this.state.value}</span>
  }
}

export let string = (mode:Mode, type?:StringType, key?:string, dbg?:() => string) => function(value:string) : C<string> {
  return make_C<string>(ctxt => cont =>
    React.createElement<StringProps>(String, { kind:"string", debug_info:dbg, type:type || "text", mode:mode, value:value, context:ctxt, cont:cont, key:key }))
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
              disabled={this.props.mode == "view" || this.props.context.mode == "view"}
              checked={this.state.value}
              onChange={e =>
                this.setState({...this.state,
                  value:e.currentTarget.checked },
                  () => this.props.cont(()=>null)(this.state.value))} />
            : this.props.style == "plus/minus" ?
              <input type="checkbox"
                className="monadic-input-choices monadic-input-choices--toggle"
                disabled={this.props.mode == "view" || this.props.context.mode == "view"}
                checked={this.state.value}
                onChange={e =>
                  this.setState({...this.state,
                    value:e.currentTarget.checked },
                    () => this.props.cont(()=>null)(this.state.value))} />
            :
              <input type="checkbox"
                className="monadic-input-choices monadic-input-choices--checkbox"
                disabled={this.props.mode == "view" || this.props.context.mode == "view"}
                checked={this.state.value}
                onChange={e =>
                  this.setState({...this.state,
                    value:e.currentTarget.checked },
                    () => this.props.cont(()=>null)(this.state.value))} />
  }
}

export let bool = (mode:Mode, style:BooleanStyle, key?:string, dbg?:() => string) => function(value:boolean) : C<boolean> {
  return make_C<boolean>(ctxt => cont =>
    React.createElement<BoolProps>(Bool, { kind:"bool", debug_info:dbg, style:style, mode:mode, value:value, context:ctxt, cont:cont, key:key }))
}


type DateTimeState = { value:Moment.Moment }
class DateTime extends React.Component<DateTimeProps,DateTimeState> {
  constructor(props:DateTimeProps,context:any) {
    super()
    this.state = { value:props.value }
  }
  componentWillReceiveProps(new_props:DateTimeProps) {
    if (new_props.value != this.state.value)
      this.setState({...this.state, value: new_props.value}, () => this.call_cont(this.state.value))
  }
  componentWillMount() {
    this.call_cont(this.state.value)
  }
  call_cont(value:Moment.Moment) {
    this.props.cont(()=>null)(value)
  }
  render() {
    let item = this.state.value
    let default_value = `${format_int(item.year(), 4)}-${format_int(item.month()+1, 2)}-${format_int(item.date(), 2)}T${format_int(item.hours(), 2)}:${format_int(item.minutes(), 2)}`
    return this.props.mode == "view" ?
      <div>{ `${format_int(item.date(), 2)}/${format_int(item.month()+1, 2)}/${format_int(item.year(), 4)}  ${format_int(item.hours(), 2)}:${format_int(item.minutes(), 2)}` }</div>
    : <input type="datetime-local"
      value={default_value}
      onChange={(e) =>
        this.setState({...this.state, value: Moment.utc(e.currentTarget.value)}, () =>
        this.call_cont(this.state.value)) }
    />
  }
}

export let date_time = (mode:Mode, key?:string, dbg?:() => string) => function(value:Moment.Moment) : C<Moment.Moment> {
  return make_C<Moment.Moment>(ctxt => cont =>
    React.createElement<DateTimeProps>(DateTime, { kind:"date time", debug_info:dbg, mode:mode, value:value, context:ctxt, cont:cont, key:key }))
}


type DateState = { value:Moment.Moment }
class DateOnly extends React.Component<DateProps,DateState> {
  constructor(props:DateProps,context:any) {
    super()
    this.state = { value:props.value }
  }
  componentWillReceiveProps(new_props:DateProps) {
    if (new_props.value != this.state.value)
      this.setState({...this.state, value: new_props.value}, () => this.call_cont(this.state.value))
  }
  componentWillMount() {
    this.call_cont(this.state.value)
  }
  call_cont(value:Moment.Moment) {
    this.props.cont(()=>null)(value)
  }
  render() {
    let item = this.state.value
    let default_value = `${format_int(item.year(), 4)}-${format_int(item.month()+1, 2)}-${format_int(item.date(), 2)}`
    return this.props.mode == "view" ?
      <div>{ `${format_int(item.date(), 2)}/${format_int(item.month()+1, 2)}/${format_int(item.year(), 4)}` }</div>
    : <input type="date"
      value={default_value}
      onChange={(e) =>
        this.setState({...this.state, value: Moment.utc(new Date(e.currentTarget.value)).startOf('d').add(12, 'h')}, () =>
        this.call_cont(this.state.value)) }
    />
  }
}

export let date = (mode:Mode, key?:string, dbg?:() => string) => function(value:Moment.Moment) : C<Moment.Moment> {
  return make_C<Moment.Moment>(ctxt => cont =>
    React.createElement<DateProps>(DateOnly, { kind:"date", debug_info:dbg, mode:mode, value:value, context:ctxt, cont:cont, key:key }))
}

type TimeState = { value:Moment.Moment }
class Time extends React.Component<TimeProps,TimeState> {
  constructor(props:TimeProps,context:any) {
    super()
    this.state = { value:props.value }
  }
  componentWillReceiveProps(new_props:TimeProps) {
    if (new_props.value != this.state.value)
      this.setState({...this.state, value: new_props.value}, () => this.call_cont(this.state.value))
  }
  componentWillMount() {
    this.call_cont(this.state.value)
  }
  call_cont(value:Moment.Moment) {
    this.props.cont(()=>null)(value)
  }
  render() {
    let item = this.state.value
    let default_value = `${format_int(item.hours(), 2)}:${format_int(item.minutes(), 2)}`
    return this.props.mode == "view" ?
      <div>{ default_value }</div>
    : <input type="time"
      value={default_value}
      onChange={(e) =>
        this.setState({...this.state, value: Moment.utc(new Date(e.currentTarget.valueAsDate))}, () =>
        this.call_cont(this.state.value)) }
    />
  }
}

export let time = (mode:Mode, key?:string, dbg?:() => string) => function(value:Moment.Moment) : C<Moment.Moment> {
  return make_C<Moment.Moment>(ctxt => cont =>
    React.createElement<TimeProps>(Time, { kind:"time", debug_info:dbg, mode:mode, value:value, context:ctxt, cont:cont, key:key }))
}
