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
    : this.props.cmd.kind == "any" ?
      React.createElement<AnyProps<A>>(Any, this.props.cmd)
    : this.props.cmd.kind == "delay" ?
      React.createElement<DelayProps<A>>(Delay, this.props.cmd)
    : this.props.cmd.kind == "custom" ?
      React.createElement<CustomProps<A>>(Custom, this.props.cmd)
    : this.props.cmd.kind == "selector" ?
      React.createElement<SelectorProps<A>>(Selector, this.props.cmd)
    : this.props.cmd.kind == "multi selector" ?
      React.createElement<any>(MultiSelector, this.props.cmd)
    : this.props.cmd.kind == "string" ?
      React.createElement<StringProps>(String, this.props.cmd)
    : this.props.cmd.kind == "int" ?
      React.createElement<IntProps>(Int, this.props.cmd)
    : this.props.cmd.kind == "bool" ?
      React.createElement<BoolProps>(Bool, this.props.cmd)
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
    if (this.props.once) this.setState({...this.state, step:"waiting for p" })
  }
  render() {
    return <div className="bind">
      {
        this.state.step == "waiting for p" || !this.props.once ?
          <Interpreter cmd={this.props.p.comp(callback => x =>
            this.setState({...this.state, step:this.props.k(x).comp(this.props.cont)}, callback)
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
    if (new_props.value != this.state.value) this.setState({...this.state, value: new_props.value})
  }
  render() {
    return this.props.mode == "edit" ? <input type="text"
                  value={this.state.value}
                  onChange={e =>
                    this.setState({...this.state,
                      value:e.currentTarget.value},
                      () => this.props.cont(()=>null)(this.state.value))} />
            :
              <span>{this.state.value}</span>
  }
}

type IntProps = Monad.Int
type IntState = { value:number }
class Int extends React.Component<IntProps,IntState> {
  constructor(props:IntProps,context:any) {
    super()
    this.state = { value:props.value }
  }
  componentWillReceiveProps(new_props:IntProps) {
    if (new_props.value != this.state.value) this.setState({...this.state, value: new_props.value})
  }
  render() {
    return this.props.mode == "edit" ? <input type="number"
                  value={this.state.value}
                  onChange={e =>
                    this.setState({...this.state,
                      value:isNaN(e.currentTarget.valueAsNumber) ? 0 : e.currentTarget.valueAsNumber},
                      () => this.props.cont(()=>null)(this.state.value))} />
            :
              <span>{this.state.value}</span>
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
      cmd={this.props.p(this.props.inb(this.props.value)).comp
            (callback => new_value =>
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
    return <Interpreter cmd={this.props.p(this.state.current_value).comp(callback => new_value =>
      this.setState({...this.state, frame_index:this.state.frame_index+1, current_value:new_value}, () =>
        this.props.cont(callback)(new_value)))
    } />
  }
}

type AnyProps<A> = Monad.Any<A>
type AnyState<A> = { current_value:A, frame_index:number }
class Any<A> extends React.Component<AnyProps<A>,AnyState<A>> {
  constructor(props:AnyProps<A>,context:any) {
    super()
    this.state = { current_value: props.value, frame_index:1 }
  }
  render() {
    return <div>
      {
        this.props.ps.map(p =>
          <Interpreter cmd={p(this.state.current_value).comp(callback => new_value =>
            // console.log("repeating with", new_value) ||
            this.setState({...this.state, frame_index:this.state.frame_index+1, current_value:new_value}, () =>
              this.props.cont(callback)(new_value)))
          } />
        )
      }
    </div>
  }
}

type DelayProps<A> = Monad.Delay<A>
type DelayState<A> = { status:"dirty"|"waiting", value:A, last_command:Monad.Cmd<A> }
class Delay<A> extends React.Component<DelayProps<A>,DelayState<A>> {
  constructor(props:DelayProps<A>,context:any) {
    super()
    this.state = { status:"dirty", value:props.value, last_command:props.p(props.value).comp(props.cont) }
  }
  running:boolean
  componentWillMount() {
    // console.log("starting delay thread")
    this.running = true
    var self = this
    let process = () => setTimeout(() => {
      // console.log("delay is ticking", self.state.status, self.state.value)
      if (self.state.status == "dirty") {
        // console.log("delay is submitting the data to save")
        self.setState({...self.state, status:"waiting", last_command:self.props.p(self.state.value).comp(callback => new_value => {
          // console.log("calling the continuation of dirty", self.state.value)
          self.props.cont(callback)(new_value)
        })})
        process()
      } else {
        if (self.running)
          process()
      }
    }, self.props.dt)
    process()
  }
  componentWillUnmount() {
    // console.log("stopping delay thread")
    this.running = false
  }
  componentWillReceiveProps(new_props:DelayProps<A>) {
    this.setState({...this.state, value: new_props.value, status:"dirty"})
  }
  render() {
    return <Interpreter cmd={this.state.last_command} />
  }
}

type CustomProps<A> = Monad.Lift<A>
type CustomState<A> = {}
class Custom<A> extends React.Component<CustomProps<A>,CustomState<A>> {
  constructor(props:CustomProps<A>,context:any) {
    super()
    this.state = {}
  }

  render() {
    return React.createElement<Monad.Lift<A>>(this.props.react_class, {...this.props})
  }
}


type SelectorProps<A> = Monad.Selector<A>
type SelectorState<A> = { selected:undefined|number }
class Selector<A> extends React.Component<SelectorProps<A>,SelectorState<A>> {
  constructor(props:SelectorProps<A>,context:any) {
    super()
    this.state = { selected:props.selected_item != undefined ? props.items.findIndex(i => props.to_string(i) == props.to_string(props.selected_item)) : undefined }
  }
  componentWillMount() {
    if (this.props.selected_item != undefined)
      this.props.cont(() => null)(this.props.selected_item)
  }
  render() {
    if (this.props.type == "dropdown")
      return <select value={this.state.selected == undefined ? "-1" : this.state.selected} onChange={e => {
          if (e.currentTarget.value == "-1") {
            this.setState({...this.state, selected: undefined})
            return
          }
          let selected_index = parseInt(e.currentTarget.value)
          let selected = this.props.items.get(selected_index)
          this.setState({...this.state, selected: selected_index}, () => this.props.cont(() => {})(selected))
        } }>
        <option value="-1"></option>
        {
          this.props.items.map((i,i_index) => {
            let i_s = this.props.to_string(i)
            return <option key={i_s} value={i_index}>{i_s}</option>
          })
        }
      </select>
    else if (this.props.type.kind == "radio") {
      let name = this.props.type.name
      return <form>
        {
          this.props.items.map((i,i_index) => {
            let i_s = this.props.to_string(i)
            return <div key={i_s}>
                <input id={`${name}_${i_index}`} key={i_s} name={name} type="radio" checked={i_index == this.state.selected}
                      onChange={e => {
                        if (e.currentTarget.checked == false) return
                        let selected = this.props.items.get(i_index)
                        this.setState({...this.state, selected: i_index}, () =>
                          this.props.cont(() => {})(selected))
                      } } />
                  <label htmlFor={`${name}_${i_index}`}>{i_s}
                </label>
              </div>
          })
        }
      </form>
    }
  }
}

type MultiSelectorProps<A> = Monad.MultiSelector<Immutable.List<A>>
type MultiSelectorState<A> = { selected:Immutable.Set<number> }
class MultiSelector<A> extends React.Component<MultiSelectorProps<A>,MultiSelectorState<A>> {
  constructor(props:MultiSelectorProps<A>,context:any) {
    super()
    this.state = { selected:Immutable.Set<number>(
      props.selected_items != undefined ?
        props.items.map((i,i_index) : [string, number] => [props.to_string(i), i_index])
                   .filter(x => props.selected_items.some(selected => props.to_string(selected) == x[0]))
                   .map(x => x[1])
                   .toArray()
      :
        []) }
  }
  componentWillMount() {
    if (this.props.selected_items != undefined)
      this.props.cont(() => null)(this.state.selected.map(index => this.props.items.get(index)).toList())
  }
  render() {
    if (this.props.type == "list") {
      return <select value={this.state.selected.map(index => index.toString()).toArray()} multiple={true} onChange={e => {
          let options = e.currentTarget.options
          let selection = Immutable.Set<number>()
          for (var i = 0, l = options.length; i < l; i++) {
              if (options[i].selected) {
                let index = parseInt(options[i].value)
                selection = selection.add(index)
              }
            }
          this.setState({...this.state, selected: selection}, () =>
          this.props.cont(() => {})(selection.map(index => this.props.items.get(index)).toList()))
        } }>
        {
          this.props.items.map((i,i_index) => {
            let i_s = this.props.to_string(i)
            return <option key={i_s} value={i_index}>{i_s}</option>
          })
        }
      </select>
    } else if (this.props.type.kind == "checkbox") {
      let name = this.props.type.name
      return <form>
        {
          this.props.items.map((i,i_index) => {
            let i_s = this.props.to_string(i)
            return <div key={i_s}>
                <input id={`${name}_${i_index}`} key={i_s} name={name} type="checkbox" checked={this.state.selected.has(i_index)}
                      onChange={e => {
                        let selected = this.props.items.get(i_index)
                        let selection = e.currentTarget.checked ? this.state.selected.add(i_index) : this.state.selected.remove(i_index)
                        this.setState({...this.state, selected: selection}, () => this.props.cont(() => {})(selection.map(index => this.props.items.get(index)).toList()))
                      } } />
                  <label htmlFor={`${name}_${i_index}`}>{i_s}
                </label>
              </div>
          })
        }
      </form>
    }
  }
}

type BoolProps = Monad.Bool
type BoolState = { value:boolean }
class Bool extends React.Component<BoolProps,BoolState> {
  constructor(props:BoolProps,context:any) {
    super()
    this.state = { value:props.value }
  }
  componentWillReceiveProps(new_props:BoolProps) {
    if (new_props.value != this.state.value) this.setState({...this.state, value: new_props.value})
  }
  render() {
    // disable if mode is not edit!!!
    return this.props.style == "fancy toggle" ?
              <a disabled={this.props.mode == "view"}
                 className={`toggle-mode toggle-mode--${this.state.value ? "edit" : "view"}`}
                 onClick={() => this.setState({...this.state, value:!this.state.value},
                                  () => this.props.cont(()=>null)(this.state.value))}>
                  <span></span>
              </a>
            : this.props.style == "plus/minus" ?
                <a disabled={this.props.mode == "view"} className={`"button button--toggle ${this.state.value ? 'button--toggle--open' : ''}`}
                  onClick={() => this.setState({...this.state, value:!this.state.value},
                                  () => this.props.cont(()=>null)(this.state.value))}>
                  <span></span>
                </a>
            :
              <form>
                <input type="checkbox"
                      id={this.props.style.name}
                      disabled={this.props.mode == "view"}
                      checked={this.state.value}
                      onChange={e =>
                        this.setState({...this.state,
                          value:e.currentTarget.checked },
                          () => this.props.cont(()=>null)(this.state.value))} />
                <label htmlFor={this.props.style.name}>{this.props.style.label}</label>
              </form>

    // return this.props.mode == "edit" ?
  }
}
