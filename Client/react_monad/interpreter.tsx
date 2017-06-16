import * as React from "react"
import * as ReactDOM from "react-dom"
import * as Immutable from "immutable"
import * as Monad from './monad'

export type InterpreterProps<A> = { cmd:Monad.Cmd<A> }
export type InterpreterState<A> = void
export class Interpreter<A> extends React.Component<InterpreterProps<A>,InterpreterState<A>> {
  constructor(props:InterpreterProps<A>,context:any) {
    super()

    if (props.cmd.kind == "unit") {
      props.cmd.cont(() => null)(props.cmd.value)
    }
  }
  render() {
    return this.props.cmd.kind == "unit" ?
      null
    : this.props.cmd.kind == "bind" ?
      React.createElement<BindProps<A>>(Bind, this.props.cmd)
    : this.props.cmd.kind == "lift promise" ?
      React.createElement<LiftPromiseProps<A>>(LiftPromise, this.props.cmd)
    : this.props.cmd.kind == "retract" ?
      React.createElement<RetractProps<A>>(Retract, this.props.cmd)
    : this.props.cmd.kind == "repeat" ?
      React.createElement<RepeatProps<A>>(Repeat, this.props.cmd)
    : this.props.cmd.kind == "delay" ?
      React.createElement<DelayProps<A>>(Delay, this.props.cmd)
    : this.props.cmd.kind == "string" ?
      React.createElement<StringProps>(String, this.props.cmd)
    :
      null
  }
}

type BindProps<A> = Monad.Bind<A>
type BindState<A> = { step:"waiting for p"|Monad.Cmd<A> }
class Bind<A> extends React.Component<BindProps<A>,BindState<A>> {
  constructor(props:BindProps<A>,context:any) {
    super()
    this.state = { step:"waiting for p" }
  }
  componentWillReceiveProps(new_props:BindProps<A>) {
    this.setState({...this.state, step:"waiting for p" })
  }
  render() {
    return <div key={`${this.props.key}_bind`} className="bind">
      {
        this.state.step == "waiting for p" || !this.props.once ?
          <Interpreter cmd={this.props.p(callback => x =>
            this.setState({...this.state, step:this.props.k(x)(this.props.cont)}, callback)
          )} />
        :
          null
      }
      {
        this.state.step != "waiting for p" ?
          <Interpreter cmd={this.state.step} />
        :
          null
      }
    </div>
  }
}

type StringProps = Monad.String
type StringState = { value:string }
class String extends React.Component<StringProps,StringState> {
  constructor(props:StringProps,context:any) {
    super()
    this.state = { value:props.value }
  }
  componentWillReceiveProps(new_props:StringProps) {
    // console.log("string update", new_props.value)
    this.setState({...this.state, value: new_props.value})
  }
  render() {
    // console.log("string render", this.state.value)
    return <input type="text"
                  value={this.state.value}
                  onChange={e =>
                    this.setState({...this.state,
                      value:e.currentTarget.value},
                      () => this.props.cont(()=>null)(this.state.value))} />
  }
}

type LiftPromiseProps<A> = Monad.LiftPromise<A>
type LiftPromiseState<A> = { value:"busy"|"error"|A}
class LiftPromise<A> extends React.Component<LiftPromiseProps<A>,LiftPromiseState<A>> {
  constructor(props:LiftPromiseProps<A>,context:any) {
    super()
    this.state = { value:"busy" }
  }
  componentWillReceiveProps(new_props:LiftPromiseProps<A>) {
    this.load(new_props)
  }
  load(props:LiftPromiseProps<A>) {
    props.p(props.value).then(x =>
      this.setState({...this.state, value:x}, () =>
      props.cont(() => null)(x)))
    .catch(() => this.setState({...this.state, value:"error"}))
  }
  componentWillMount() { this.load(this.props) }
  render() {
    return this.state.value == "busy" ? <div className="busy">busy</div>
            : this.state.value == "error" ? <div className="error">Error</div>
            : null
  }
}

type RetractProps<A> = Monad.Retract<A>
type RetractState<A> = {}
class Retract<A> extends React.Component<RetractProps<A>,RetractState<A>> {
  constructor(props:RetractProps<A>,context:any) {
    super()
    this.state = {}
  }
  render() {
    return <Interpreter
      cmd={this.props.p(this.props.inb(this.props.value))
            (callback => new_value =>
              // console.log("retracting from ", new_value, this.props.out(this.props.value)(new_value)) ||
              this.props.cont(callback)
                (this.props.out(this.props.value)(new_value)))} />
  }
}

type RepeatProps<A> = Monad.Repeat<A>
type RepeatState<A> = { current_value:A, frame_index:number }
class Repeat<A> extends React.Component<RepeatProps<A>,RepeatState<A>> {
  constructor(props:RepeatProps<A>,context:any) {
    super()
    this.state = { current_value: props.value, frame_index:1 }
  }
  render() {
    // console.log("rendering repeater", this.state.current_value)
    return <Interpreter cmd={this.props.p(this.state.current_value)(callback => new_value =>
      // console.log("repeating with", new_value) ||
      this.setState({...this.state, frame_index:this.state.frame_index+1, current_value:new_value}, () =>
        this.props.cont(callback)(new_value)))
    } />
  }
}

type DelayProps<A> = Monad.Delay<A>
type DelayState<A> = { status:"dirty"|"waiting", value:A }
class Delay<A> extends React.Component<DelayProps<A>,DelayState<A>> {
  constructor(props:DelayProps<A>,context:any) {
    super()
    this.state = { status:"dirty", value:props.value }
  }
  running:boolean
  componentWillMount() {
    this.running = true
    let process = () => setTimeout(() => {
      if (this.state.status == "dirty") {
        this.setState({...this.state, status:"waiting"}, () => {
          this.props.cont(process)(this.state.value)
        })
      } else {
        if (this.running)
          process()
      }
    }, this.props.dt)
    process()
  }
  componentWillUnmount() {
    this.running = false
  }
  componentWillReceiveProps(new_props:DelayProps<A>) {
    this.setState({...this.state, value: new_props.value, status:"dirty"})
  }
  render() {
    return <Interpreter
      cmd={this.props.p(this.state.value)
        (callback => new_value => this.setState({...this.state, status:"dirty", value:new_value}, callback))} />
  }
}

