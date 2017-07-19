import * as React from "react"
import * as ReactDOM from "react-dom"
import * as Immutable from "immutable"
import * as i18next from 'i18next'

import {C, Mode, Cont, CmdCommon, Context, make_C, unit, bind} from './core'
import {div, a} from './html'
import {bool} from './primitives'

export type RepeatProps<A> = { kind:"repeat", value:A, p:(_:A)=>C<A> } & CmdCommon<A>
export type AllProps<A> = { kind:"all", ps:Array<C<A>> } & CmdCommon<Array<A>>
export type AnyProps<A,B> = { kind:"any", value:A, ps:Array<(_:A)=>C<B>>, className:string } & CmdCommon<B>
export type NeverProps<A,B> = { kind:"never", p:C<A> } & CmdCommon<B>
export type RetractProps<A,B> = { kind:"retract", inb:(_:A)=>B, out:(_:A)=>(_:B)=>A, p:(_:B)=>C<B>, value:A } & CmdCommon<A>
export type DelayProps<A> = { kind:"delay", dt:number, value:A, p:(_:A)=>C<A> } & CmdCommon<A>
export type RetryStrategy = "never" | "semi exponential"
export type LiftPromiseProps<A,B> = { kind:"lift promise", p:(_:B)=>Promise<A>, retry_strategy:RetryStrategy, value:B } & CmdCommon<A>
export type SimpleMenuType = "side menu" | { kind:"tabs", max_tabs:number }

type RepeatState<A> = { current_value:A, frame_index:number }
class Repeat<A> extends React.Component<RepeatProps<A>,RepeatState<A>> {
  constructor(props:RepeatProps<A>,context:any) {
    super()
    this.state = { current_value: props.value, frame_index:1 }
  }
  render() {
    this.props.debug_info && console.log("Render:", this.props.debug_info(), this.state.current_value)
    return this.props.p(this.state.current_value).comp(this.props.context)(callback => new_value =>
      this.setState({...this.state, frame_index:this.state.frame_index+1, current_value:new_value}, () =>
        this.props.cont(callback)(new_value)))
  }
}

export let repeat = function<A>(key?:string, dbg?:() => string) : ((p:(_:A)=>C<A>) => (_:A) => C<A>) {
  return p => initial_value => make_C<A>(ctxt => cont =>
    React.createElement<RepeatProps<A>>(Repeat,
    ({ kind:"repeat", debug_info:dbg, p:p as (_:A)=>C<A>, value:initial_value, context:ctxt, cont:cont, key:key })))
}

type AnyState<A,B> = { ps:"creating"|Array<JSX.Element> }
class Any<A,B> extends React.Component<AnyProps<A,B>,AnyState<A,B>> {
  constructor(props:AnyProps<A,B>,context:any) {
    super()
    this.state = { ps:"creating" }
  }
  componentWillReceiveProps(new_props:AnyProps<A,B>) {
    this.setState({...this.state,
      ps:new_props.ps.map(p =>
          p(new_props.value).comp(new_props.context)(callback => new_value =>
            new_props.cont(callback)(new_value)))})
  }
  componentWillMount() {
    this.setState({...this.state,
      ps:this.props.ps.map(p =>
          p(this.props.value).comp(this.props.context)(callback => new_value =>
            this.props.cont(callback)(new_value)))})
  }
  render() {
    return <div className={this.props.className}> { this.state.ps != "creating" ? this.state.ps : null } </div>
  }
}

export let any = function<A,B>(key?:string, className?:string, dbg?:() => string) : ((ps:Array<(_:A)=>C<B>>) => (_:A) => C<B>) {
  return ps => initial_value => make_C<B>(ctxt => cont =>
    React.createElement<AnyProps<A,B>>(Any,
      { kind:"any", debug_info:dbg, ps:ps, value:initial_value, context:ctxt, cont:cont, key:key, className:className }))
}

type NeverState<A,B> = { p:"loading"|JSX.Element }
class Never<A,B> extends React.Component<NeverProps<A,B>,NeverState<A,B>> {
  constructor(props:NeverProps<A,B>,context:any) {
    super()
    this.state = { p:"loading" }
  }
  componentWillReceiveProps(new_props:NeverProps<A,B>) {
    this.setState({...this.state,
      p:new_props.p.comp(new_props.context)(callback => new_value => {})})
  }
  componentWillMount() {
    this.setState({...this.state,
      p:this.props.p.comp(this.props.context)(callback => new_value => {})})
  }
  render() {
    return this.state.p != "loading" ? this.state.p : null
  }
}

export let never = function<A,B>(p:C<A>, key?:string) : C<B> {
  return make_C<B>(ctxt => cont =>
    React.createElement<NeverProps<A,B>>(Never,
      { kind:"never", p:p, context:ctxt, cont:cont, key:key, debug_info:undefined }))
}

type AllState<A> = { results:Immutable.Map<number,A>, ps:"creating"|Array<JSX.Element> }
class All<A> extends React.Component<AllProps<A>,AllState<A>> {
  constructor(props:AllProps<A>,context:any) {
    super()
    this.state = { results:Immutable.Map<number,A>(), ps:"creating" }
  }

  componentWillReceiveProps(new_props:AllProps<A>) {
    this.setState({...this.state,
      ps:new_props.ps.map((p,p_i) =>
          p.comp(new_props.context)(callback => result =>
            this.setState({...this.state, results:this.state.results.set(p_i, result) }, () => {
              if (this.state.results.keySeq().toSet().equals(Immutable.Range(0, new_props.ps.length).toSet())) {
                let results = this.state.results.sortBy((r,r_i) => r_i).toArray()
                this.setState({...this.state, results:Immutable.Map<number,A>()}, () =>
                new_props.cont(callback)(results))
              }
            })
        ))})
  }
  componentWillMount() {
    this.setState({...this.state,
      ps:this.props.ps.map((p,p_i) =>
          p.comp(this.props.context)(callback => result =>
            this.setState({...this.state, results:this.state.results.set(p_i, result) }, () => {
              if (this.state.results.keySeq().toSet().equals(Immutable.Range(0, this.props.ps.length).toSet())) {
                let results = this.state.results.sortBy((r,r_i) => r_i).toArray()
                this.setState({...this.state, results:Immutable.Map<number,A>()}, () =>
                this.props.cont(callback)(results))
              }
            })
        ))})
  }
  render() {
    return <div> { this.state.ps != "creating" ? this.state.ps : null } </div>
  }
}

export let all = function<A>(ps:Array<C<A>>, key?:string, dbg?:() => string) : C<Array<A>> {
  return make_C<A[]>(ctxt => cont =>
    React.createElement<AllProps<A>>(All,
      { kind:"all", debug_info:dbg, ps:ps, context:ctxt, cont:cont, key:key }))
}

type RetractState<A,B> = { p:"creating"|JSX.Element }
class Retract<A,B> extends React.Component<RetractProps<A,B>,RetractState<A,B>> {
  constructor(props:RetractProps<A,B>,context:any) {
    super()
    this.state = { p:"creating" }
  }
  componentWillReceiveProps(new_props:RetractProps<A,B>) {
    this.setState({...this.state,
      p:new_props.p(new_props.inb(new_props.value)).comp(new_props.context)
            (callback => new_value =>
              new_props.cont(callback)
                (new_props.out(new_props.value)(new_value)))})
  }
  componentWillMount() {
    this.setState({...this.state,
      p:this.props.p(this.props.inb(this.props.value)).comp(this.props.context)
            (callback => new_value =>
              this.props.cont(callback)
                (this.props.out(this.props.value)(new_value)))})
  }
  render() {
    return this.state.p != "creating" ? this.state.p : null
  }
}

export let retract = function<A,B>(key?:string, dbg?:() => string) : ((inb:(_:A)=>B, out:(_:A)=>(_:B)=>A, p:(_:B)=>C<B>) => (_:A) => C<A>) {
  return (inb, out, p) => (initial_value:A) => make_C<A>(ctxt => (cont:Cont<A>) =>
    React.createElement<RetractProps<A,B>>(Retract,
      { kind:"retract", debug_info:dbg, inb:inb as (_:A)=>any, out:out as (_:A)=>(_:any)=>A, p:p, value:initial_value, context:ctxt, cont:cont, key:key }))
}


type LiftPromiseState<A,B> = { result:"busy"|"error"|A, input:any }
class LiftPromise<A,B> extends React.Component<LiftPromiseProps<A,B>,LiftPromiseState<A,B>> {
  constructor(props:LiftPromiseProps<A,B>,context:any) {
    super()
    this.state = { result:"busy", input:props.value }
  }
  componentWillReceiveProps(new_props:LiftPromiseProps<A,B>) {
    // if (this.state.result != "busy" && this.state.result != "error") {
    //   this.props.debug_info && console.log("New props (ignored):", this.props.debug_info(), this.state.input, new_props.value)
    //   return
    // }
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
    return this.state.result == "busy" ? <div className="busy">{i18next.t("busy")}</div>
            : this.state.result == "error" ? <div className="error">{i18next.t("error")}</div>
            : null // <div className="done">{i18next.t("done")}</div>
  }
}

export let lift_promise = function<A,B>(p:(_:A) => Promise<B>, retry_strategy:RetryStrategy, key?:string, dbg?:() => string) : ((_:A)=>C<B>) {
  return x => make_C<B>(ctxt => cont =>
    React.createElement<LiftPromiseProps<B,A>>(LiftPromise,
      { kind:"lift promise", debug_info:dbg, value:x, retry_strategy:retry_strategy, p:p, context:ctxt, cont:cont, key:key }))
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

export let mk_submenu_entry = function<A>(label:string, children:Array<MenuEntryValue<A>>) : MenuEntrySubMenu<A> { return { kind:"sub menu", label:label, children:children } }
export let mk_menu_entry = function<A>(v:A) : MenuEntryValue<A> { return { kind:"item", value:v } }

export type MenuEntryValue<A> = { kind:"item", value:A }
export type MenuEntrySubMenu<A> = { kind:"sub menu", label:string, children:Array<MenuEntryValue<A>> }
export type MenuEntry<A> = MenuEntryValue<A> | MenuEntrySubMenu<A>
export let simple_menu = function<A,B>(type:SimpleMenuType, to_string:(_:A)=>string, key?:string, dbg?:() => string) :
  ((items:Array<MenuEntry<A>>, p:(_:A)=>C<B>, selected_item?:A, selected_sub_menu?:string) => C<B>) {
  type ShownRange = { first:number, amount:number }
  type MenuState = {
    selected:{ kind:"nothing" } | { kind:"item", value:A }
    sub_selected : { kind:"nothing" } | { kind:"sub menu", label:string }
    last_action:{kind:"init"|"selection"}|{kind:"p", p_res:B }, shown_range:undefined|ShownRange }

  let content_menu_class:string, content_class:string, menu_class:string, entries_class:string, entry_class:string, sub_entry_class:string
  if (type == "side menu") {
    content_menu_class = "monadic-content-with-menu"
    content_class = "monadic-content"
    menu_class = "monadic-content-menu"
    entries_class = "monadic-content-menu__entries"
    entry_class = "monadic-content-menu__entry"
    sub_entry_class = "monadic-content-menu__sub-entry"
  } else {
    content_menu_class = "monadic-content-with-tabs"
    content_class = "monadic-content"
    menu_class = "monadic-tabs"
    entries_class = "monadic-tabs__entries"
    entry_class = "monadic-tabs__entry"
    sub_entry_class = "monadic-tabs__sub-entry"
  }

  return (items_array, p, selected_item:undefined|A, selected_sub_menu:undefined|string) => {
    let items = Immutable.List<MenuEntry<A>>(items_array)

    let entries : (s:MenuState) => Array<(_:MenuState) => C<MenuState>> = (s:MenuState) =>
            (type != "side menu" && s.shown_range.first > 0 ?
                [s => div<MenuState,MenuState>(`${entry_class} monadic-prev-tab`)(a<MenuState>("<"))({...s, shown_range:{...s.shown_range, first:s.shown_range.first-1}})]
              :
                []).concat(
              items.map((item, i) => {
                return (s:MenuState) =>

                  item.kind == "item" ?
                    div<MenuState, MenuState>(`${entry_class} ${s.selected.kind == "item" && item.value == s.selected.value ? ` ${entry_class}--active` : ""}`)(
                      a<MenuState>(to_string(item.value), false, undefined)
                    )({...s, sub_selected:{ kind:"nothing" }, selected:item, last_action:{kind:"selection"} })
                  :
                    any<MenuState, MenuState>()([
                      (s:MenuState) => div<MenuState, MenuState>(`${entry_class} `)(
                        a<MenuState>(item.label, false, undefined)
                      )({...s, sub_selected:item, last_action:{kind:"selection"} })
                    ].concat(
                      (s.sub_selected.kind == "sub menu" && item.label == s.sub_selected.label) ||
                      (s.selected.kind == "item" && item.children.some(c => s.selected.kind == "item" && c.value == s.selected.value)) ?
                        item.children.map(c =>
                          (s:MenuState) => div<MenuState, MenuState>(`${sub_entry_class} ${s.selected.kind == "item" && c.value == s.selected.value ? ` ${sub_entry_class}--active` : ""}`)(
                            a<MenuState>(to_string(c.value), false, undefined)
                          )({...s, sub_selected:item, selected:c, last_action:{kind:"selection"} })
                        )
                      :
                        []
                    ))(s)
              }).filter((i, i_i) => type == "side menu" || i_i >= s.shown_range.first && (i_i - s.shown_range.first) < s.shown_range.amount)
              .concat(
                type != "side menu" && s.shown_range.first + s.shown_range.amount < items.count() ?
                  [s => div<MenuState,MenuState>(`${entry_class} monadic-next-tab`)(a<MenuState>(">"))({...s, shown_range:{...s.shown_range, first:s.shown_range.first+1}})]
                :
                  [])
              .toArray())


    return repeat<MenuState>()(
      div<MenuState, MenuState>()(
      any<MenuState, MenuState>(undefined, content_menu_class)(
        [
          div<MenuState, MenuState>(menu_class)(
            s => any<MenuState, MenuState>(undefined, entries_class)(entries(s))(s)),
          div<MenuState, MenuState>(content_class)(
          (s:MenuState) => s.selected.kind == "item" ?
            p(s.selected.value).bind<MenuState>(undefined, (p_res:B) => unit<MenuState>({...s, last_action:{ kind:"p", p_res:p_res }}))
          :
            unit<MenuState>(s).never<MenuState>())
        ]
      )
    ))({ selected:selected_item == undefined ? { kind:"nothing" } : { kind:"item", value:selected_item },
         sub_selected:selected_sub_menu == undefined ? { kind:"nothing" } : { kind:"sub menu", label:selected_sub_menu },
         last_action:{ kind:"init" },
         shown_range:type=="side menu" ? undefined : { first:0, amount:type.max_tabs } })
    .filter(s => s.last_action.kind != "p")
    .map<B>(s => s.last_action.kind == "p" && s.last_action.p_res)
  }
}

export let custom = function<A>(key?:string, dbg?:() => string) : (render:(ctxt:()=>Context) => (_:Cont<A>) => JSX.Element) => C<A> {
  return (render) => make_C<A>(ctxt => cont => render(ctxt)(cont))
}

export let hide = (f_name:string, f:C<void>) =>
  repeat<boolean>()(visible =>
    bool("edit", "plus/minus")(visible))(false).bind(`${f_name} toggle`, visible =>
    !visible ?
      unit<void>(null)
    :
      f.bind(`visible ${f_name}`, _ => unit<void>(null)))
