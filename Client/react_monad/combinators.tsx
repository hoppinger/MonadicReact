import * as React from "react"
import * as ReactDOM from "react-dom"
import * as Immutable from "immutable"
import {C, Cont, CmdCommon, Context, make_C, unit, bind} from './core'
import {bool} from './primitives'

export type Mode = "edit"|"view"
export type RepeatProps<A> = { kind:"repeat", value:A, p:(_:A)=>C<A> } & CmdCommon<A>
export type AllProps<A> = { kind:"all", ps:Array<C<A>> } & CmdCommon<Array<A>>
export type AnyProps<A> = { kind:"any", value:A, ps:Array<(_:A)=>C<A>> } & CmdCommon<A>
export type RetractProps<A,B> = { kind:"retract", inb:(_:A)=>B, out:(_:A)=>(_:B)=>A, p:(_:B)=>C<B>, value:A } & CmdCommon<A>
export type DelayProps<A> = { kind:"delay", dt:number, value:A, p:(_:A)=>C<A> } & CmdCommon<A>
export type RetryStrategy = "never" | "semi exponential"
export type LiftPromiseProps<A,B> = { kind:"lift promise", p:(_:B)=>Promise<A>, retry_strategy:RetryStrategy, value:B, is_value_changed:(old_value:B,new_value:B)=>boolean } & CmdCommon<A>
export type MenuType = "side menu"|"tabs"
export type MenuProps<A,B> = { kind:"menu", type:MenuType, to_string:(_:A)=>string, items:Immutable.List<A>, selected_item:undefined|A, p:(_:A)=>C<B> } & CmdCommon<B>

type RepeatState<A> = { current_value:A, frame_index:number }
class Repeat<A> extends React.Component<RepeatProps<A>,RepeatState<A>> {
  constructor(props:RepeatProps<A>,context:any) {
    super()
    this.state = { current_value: props.value, frame_index:1 }
  }
  render() {
    return this.props.p(this.state.current_value).comp(this.props.context)(callback => new_value =>
      this.setState({...this.state, frame_index:this.state.frame_index+1, current_value:new_value}, () =>
        this.props.cont(callback)(new_value)))
  }
}

export let repeat = function<A>(p:(_:A)=>C<A>, key?:string, dbg?:() => string) : ((_:A) => C<A>) {
  return initial_value => make_C<A>(ctxt => cont =>
    React.createElement<RepeatProps<A>>(Repeat,
    ({ kind:"repeat", debug_info:dbg, p:p as (_:A)=>C<A>, value:initial_value, context:ctxt, cont:cont, key:key })))
}

type AnyState<A> = {}
class Any<A> extends React.Component<AnyProps<A>,AnyState<A>> {
  constructor(props:AnyProps<A>,context:any) {
    super()
    this.state = {}
  }
  render() {
    return <div>
      {
        this.props.ps.map(p =>
          p(this.props.value).comp(this.props.context)(callback => new_value =>
            this.props.cont(callback)(new_value))
        )
      }
    </div>
  }
}

export let any = function<A>(ps:Array<(_:A)=>C<A>>, key?:string, dbg?:() => string) : ((_:A) => C<A>) {
  return initial_value => make_C<A>(ctxt => cont =>
    React.createElement<AnyProps<A>>(Any,
      { kind:"any", debug_info:dbg, ps:ps as Array<(_:A)=>C<A>>, value:initial_value, context:ctxt, cont:cont, key:key }))
}

type AllState<A> = { results:Immutable.Map<number,A> }
class All<A> extends React.Component<AllProps<A>,AllState<A>> {
  constructor(props:AllProps<A>,context:any) {
    super()
    this.state = { results:Immutable.Map<number,A>() }
  }
  render() {
    return <div>
      {
        this.props.ps.map((p,p_i) =>
          p.comp(this.props.context)(callback => result =>
            this.setState({...this.state, results:this.state.results.set(p_i, result) }, () => {
              if (this.state.results.keySeq().toSet().equals(Immutable.Range(0, this.props.ps.length).toSet())) {
                let results = this.state.results.sortBy((r,r_i) => r_i).toArray()
                this.setState({...this.state, results:Immutable.Map<number,A>()}, () =>
                this.props.cont(callback)(results))
              }
            })
        ))
      }
    </div>
  }
}

export let all = function<A>(ps:Array<C<A>>, key?:string, dbg?:() => string) : C<Array<A>> {
  return make_C<A[]>(ctxt => cont =>
    React.createElement<AllProps<A>>(All,
      { kind:"all", debug_info:dbg, ps:ps, context:ctxt, cont:cont, key:key }))
}

type RetractState<A,B> = {}
class Retract<A,B> extends React.Component<RetractProps<A,B>,RetractState<A,B>> {
  constructor(props:RetractProps<A,B>,context:any) {
    super()
    this.state = {}
  }
  render() {
    return this.props.p(this.props.inb(this.props.value)).comp(this.props.context)
            (callback => new_value =>
              this.props.cont(callback)
                (this.props.out(this.props.value)(new_value)))
  }
}

export let retract = function<A,B>(inb:(_:A)=>B, out:(_:A)=>(_:B)=>A, p:(_:B)=>C<B>, key?:string, dbg?:() => string) : ((_:A) => C<A>) {
  return (initial_value:A) => make_C<A>(ctxt => (cont:Cont<A>) =>
    React.createElement<RetractProps<A,B>>(Retract,
      { kind:"retract", debug_info:dbg, inb:inb as (_:A)=>any, out:out as (_:A)=>(_:any)=>A, p:p as (_:any)=>C<any>, value:initial_value, context:ctxt, cont:cont, key:key }))
}


type LiftPromiseState<A,B> = { result:"busy"|"error"|A, input:any }
class LiftPromise<A,B> extends React.Component<LiftPromiseProps<A,B>,LiftPromiseState<A,B>> {
  constructor(props:LiftPromiseProps<A,B>,context:any) {
    super()
    this.state = { result:"busy", input:props.value }
  }
  componentWillReceiveProps(new_props:LiftPromiseProps<A,B>) {
    if (this.state.result != "busy" && this.state.result != "error" &&
        !this.props.is_value_changed(new_props.value, this.state.input)) {
      this.props.debug_info && console.log("New props (ignored):", this.props.debug_info(), this.state.input, new_props.value)
      return
    }
    this.props.debug_info && console.log("New props:", this.props.debug_info(), this.state.input, new_props.value)
    this.setState({...this.state, input:new_props.value}, () =>
    this.load(new_props))
  }
  wait_time:number = 500
  load(props:LiftPromiseProps<A,B>) {
    this.setState({...this.state, result:"busy"}, () =>
    props.p(this.state.input).then(x => {
      this.wait_time = 500
      if (this.props.debug_info) console.log("Promise done:", this.props.debug_info())
      this.setState({...this.state, result:x}, () => props.cont(() => null)(x))
    })
    .catch(() => {
      if (props.retry_strategy == "never")
        this.setState({...this.state, result:"error"})
      else {
        this.wait_time = Math.floor(Math.max(this.wait_time * 1.5, 2500))
        setTimeout(() => this.load(props), this.wait_time)
      }
    }))
  }
  componentWillMount() {
    this.props.debug_info && console.log("Mount:", this.props.debug_info())
    this.load(this.props)
  }
  render() {
    this.props.debug_info && console.log("Render:", this.props.debug_info())
    return this.state.result == "busy" ? <div className="busy">busy</div>
            : this.state.result == "error" ? <div className="error">error</div>
            : null // <div className="done">done</div>
  }
}

export let lift_promise = function<A,B>(p:(_:A) => Promise<B>, is_value_changed:(old_value:A,new_value:A)=>boolean, retry_strategy:RetryStrategy, key?:string, dbg?:() => string) : ((_:A)=>C<B>) {
  return x => make_C<B>(ctxt => cont =>
    React.createElement<LiftPromiseProps<B,A>>(LiftPromise,
      { kind:"lift promise", debug_info:dbg, is_value_changed:is_value_changed, value:x, retry_strategy:retry_strategy, p:p, context:ctxt, cont:cont, key:key }))
}


type DelayState<A> = { status:"dirty"|"waiting", value:A, last_command:JSX.Element }
class Delay<A> extends React.Component<DelayProps<A>,DelayState<A>> {
  constructor(props:DelayProps<A>,context:any) {
    super()
    this.state = { status:"dirty", value:props.value, last_command:props.p(props.value).comp(props.context)(props.cont) }
  }
  running:boolean = false
  componentWillMount() {
    // console.log("starting delay thread")
    if (this.running) return
    this.running = true
    var self = this
    let process = () => setTimeout(() => {
      // console.log("delay is ticking", self.state.status, self.state.value)
      if (self.state.status == "dirty") {
        // console.log("delay is submitting the data to save")
        self.setState({...self.state, status:"waiting", last_command:self.props.p(self.state.value).comp(this.props.context)(callback => new_value => {
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
    // console.log("Delay received new props and is going back to dirty")
    this.setState({...this.state, value: new_props.value, status:"dirty"})
  }
  render() {
    return this.state.last_command
  }
}

export let delay = function<A>(dt:number, key?:string, dbg?:() => string) : (p:(_:A)=>C<A>) => ((_:A) => C<A>) {
  return p => initial_value => make_C<A>(ctxt => cont =>
    React.createElement<DelayProps<A>>(Delay,
      { kind:"delay", debug_info:dbg, dt:dt, p:p as (_:A)=>C<A>, value:initial_value, context:ctxt, cont:cont, key:key }))
}

type MenuState<A,B> = { selected:undefined|number, content:undefined|JSX.Element }
class Menu<A,B> extends React.Component<MenuProps<A,B>,MenuState<A,B>> {
  constructor(props:MenuProps<A,B>,context:any) {
    super()
    this.state = { selected:props.selected_item != undefined ? props.items.findIndex(i => props.to_string(i) == props.to_string(props.selected_item)) : undefined,
                   content:undefined }
  }
  componentWillMount() {
    if (this.state.selected != undefined)
      this.setState({...this.state,
          content:this.state.selected != undefined ? this.props.p(this.props.items.get(this.state.selected)).comp(this.props.context)(this.props.cont) : undefined})
  }
  render() {
    let content_menu_class:string, content_class:string, menu_class:string, entries_class:string, entry_class:string
    if (this.props.type == "side menu") {
      content_menu_class = "content_with_menu"
      content_class = "content"
      menu_class = "side_menu"
      entries_class = "side_menu_entries"
      entry_class = "side_menu_entry"
    } else if (this.props.type == "tabs"){
      content_menu_class = "content_with_tabs"
      content_class = "content"
      menu_class = "tabs"
      entries_class = "tab_entries"
      entry_class = "tab_entry"
    }
    return <div className={content_menu_class}>
      <div className={menu_class}>
        <div className={entries_class}>

          {this.props.items.map((i, i_i) =>
                <div className={`${entry_class} ${i_i == this.state.selected ? " active" : ""}`}>
                  <a onClick={() =>
                      {
                        this.setState({...this.state, selected:i_i,
                            content:this.props.p(this.props.items.get(i_i)).comp(this.props.context)(this.props.cont)})
                      }
                    }>
                    { this.props.to_string(i) }
                  </a>
                </div>)
              }
              {/*<div className="menu_entry menu_entry--with-sub">

              </div>*/}
        </div>
      </div>
      <div className={content_class}>
        { this.state.content }
      </div>
    </div>
  }
}

export let menu = function<A,B>(type:MenuType, to_string:(_:A)=>string, key?:string, dbg?:() => string) : ((items:Immutable.List<A>, p:(_:A)=>C<B>, selected_item?:A) => C<B>) {
  return (items, p, selected_item) => make_C<B>(ctxt => cont =>
    React.createElement<MenuProps<A,B>>(Menu,
      { kind:"menu", debug_info:dbg, items:items, selected_item:selected_item, p:p, type:type, to_string:to_string, context:ctxt, cont:cont, key:key }))
}

export let custom = function<A>(key?:string, dbg?:() => string) : (render:(ctxt:Context) => (_:Cont<A>) => JSX.Element) => C<A> {
  return (render) => make_C<A>(ctxt => cont => render(ctxt)(cont))
}

export let hide = (f_name:string, f:C<void>) =>
  repeat<boolean>(visible =>
    bool("edit", "plus/minus")(visible))(false).bind(`${f_name} toggle`, visible =>
    !visible ?
      unit<void>(null)
    :
      f.bind(`visible ${f_name}`, _ => unit<void>(null)))

