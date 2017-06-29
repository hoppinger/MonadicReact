import * as React from "react"
import * as ReactDOM from "react-dom"
import * as Immutable from "immutable"

export type Mode = "edit"|"view"
export type CmdCommon<A> = { cont:Cont<A>, key:string, debug_info:() => string }
export type UnitProps<A> = { kind:"unit", value:A } & CmdCommon<A>
export type BindProps<B,A> = { kind:"bind", once:boolean, p:C<B>, k:(_:B) => C<A> } & CmdCommon<A>
export type IntProps = { kind:"int", value:number, mode:Mode } & CmdCommon<number>
export type LabelProps<A> = { kind:"label", text:string, value:A, p:(_:A)=>C<A> } & CmdCommon<A>
export type RepeatProps<A> = { kind:"repeat", value:A, p:(_:A)=>C<A> } & CmdCommon<A>
export type StringProps = { kind:"string", value:string, mode:Mode } & CmdCommon<string>
export type AnyProps<A> = { kind:"any", value:A, ps:Array<(_:A)=>C<A>> } & CmdCommon<A>
export type RetractProps<A,B> = { kind:"retract", inb:(_:A)=>B, out:(_:A)=>(_:B)=>A, p:(_:B)=>C<B>, value:A } & CmdCommon<A>
export type BooleanStyle = "checkbox"|"fancy toggle"|"plus/minus"
export type BoolProps = { kind:"bool", value:boolean, mode:Mode, style:BooleanStyle } & CmdCommon<boolean>
export type MultiSelectorType = "list"|"checkbox"
export type MultiSelectorProps<A> = { kind:"multi selector", type:MultiSelectorType, to_string:(_:A)=>string, items:Immutable.List<A>,
          selected_items:undefined|Immutable.List<A> } & CmdCommon<Immutable.List<A>>
export type ImageProps = { kind:"image", src:string, mode:Mode } & CmdCommon<string>
export type DelayProps<A> = { kind:"delay", dt:number, value:A, p:(_:A)=>C<A> } & CmdCommon<A>
export type LiftPromiseProps<A,B> = { kind:"lift promise", p:(_:B)=>Promise<A>, value:any, is_value_changed:(old_value:B,new_value:B)=>boolean } & CmdCommon<A>
export type SelectorType = "dropdown"|"radio"
export type SelectorProps<A> = { kind:"selector", type:SelectorType, to_string:(_:A)=>string, items:Immutable.List<A>, selected_item:undefined|A } & CmdCommon<A>
export type MenuType = "side menu"|"tabs"
export type MenuProps<A,B> = { kind:"menu", type:MenuType, to_string:(_:A)=>string, items:Immutable.List<A>, selected_item:undefined|A, p:(_:A)=>C<B> } & CmdCommon<B>


export type Cont<A> = (callback:() => void) => (_:A) => void
export type C<A> = {
  comp:(cont:Cont<A>) => JSX.Element
  bind:<B>(key:string, k:(_:A)=>C<B>, dbg?:()=>string)=>C<B>
  bind_once:<B>(key:string, k:(_:A)=>C<B>, dbg?:()=>string)=>C<B>
  ignore:()=>C<void>
}

function make_C<A>(comp:(cont:Cont<A>) => JSX.Element) : C<A> {
  return {
    comp:comp,
    bind:function<B>(this:C<A>, key:string, k:(_:A)=>C<B>, dbg?:()=>string) : C<B> {
            return bind<A,B>(key || "", this, k, dbg)
          },
    bind_once:function<B>(this:C<A>, key:string, k:(_:A)=>C<B>, dbg?:()=>string) : C<B> {
            return bind_once<A,B>(key || "", this, k, dbg)
          },
    ignore:function(this:C<A>) : C<void> {
      return this.bind(``, _ => unit<void>(null))
    }
  }
}

type UnitState<A> = {}
class Unit<A> extends React.Component<UnitProps<A>,UnitState<A>> {
  constructor(props:UnitProps<A>,context:any) {
    super()
    this.state = {}
  }
  render() {
    this.props.debug_info && console.log("Render:", this.props.debug_info())
    return null
  }
}

export let unit = function<A>(x:A, dbg?:() => string) : C<A> { return make_C<A>(cont =>
  (React.createElement<UnitProps<A>>(Unit, { kind:"unit", debug_info:dbg, value:x, cont:cont, key:null }))) }

type BindState<B,A> = { k:"waiting for p"|JSX.Element }
class Bind<B,A> extends React.Component<BindProps<B,A>,BindState<B,A>> {
  constructor(props:BindProps<B,A>,context:any) {
    super()
    this.state = { k:"waiting for p" }
  }
  componentWillReceiveProps(new_props:BindProps<B,A>) {
    this.props.debug_info && console.log("New props:", this.props.debug_info())
    if (this.props.once) this.setState({...this.state, step:"waiting for p" })
  }
  componentWillMount() {
  }
  render() {
    this.props.debug_info && console.log("Render:", this.props.debug_info())
    return <div className="bind">
      {
        (this.state.k == "waiting for p" || !this.props.once) ?
          this.props.p.comp(callback => x =>
            this.setState({...this.state,
              k:this.props.k(x).comp(callback => x =>
                this.props.cont(callback)(x))}, callback)
          )
        :
          null
      }
      {
        this.state.k != "waiting for p" ?
          this.state.k
        :
          null
      }
    </div>
  }
}

export let bind = function<A,B>(key:string, p:C<A>, k:((_:A)=>C<B>), dbg?:() => string) : C<B> {
  return make_C<B>(cont =>
    (React.createElement<BindProps<A,B>>(Bind,
      { kind:"bind", debug_info:dbg, p:p, k:k, once:false, cont:cont, key:key })))
}

export let bind_once = function<A,B>(key:string, p:C<A>, k:((_:A)=>C<B>), dbg?:() => string) : C<B> {
  return make_C<B>(cont =>
    (React.createElement<BindProps<A,B>>(Bind,
      ({ kind:"bind", debug_info:dbg, p:p, k:k, once:true, cont:cont, key:key }))))
}

type RepeatState<A> = { current_value:A, frame_index:number }
class Repeat<A> extends React.Component<RepeatProps<A>,RepeatState<A>> {
  constructor(props:RepeatProps<A>,context:any) {
    super()
    this.state = { current_value: props.value, frame_index:1 }
  }
  render() {
    return this.props.p(this.state.current_value).comp(callback => new_value =>
      this.setState({...this.state, frame_index:this.state.frame_index+1, current_value:new_value}, () =>
        this.props.cont(callback)(new_value)))
  }
}

export let repeat = function<A>(p:(_:A)=>C<A>, key?:string, dbg?:() => string) : ((_:A) => C<A>) {
  return initial_value => make_C<A>(cont =>
    React.createElement<RepeatProps<A>>(Repeat,
    ({ kind:"repeat", debug_info:dbg, p:p as (_:A)=>C<A>, value:initial_value, cont:cont, key:key })))
}

type LabelState<A> = {}
class Label<A> extends React.Component<LabelProps<A>,LabelState<A>> {
  constructor(props:LabelProps<A>,context:any) {
    super()
    this.state = {}
  }
  render() {
    return <label>
                  <span>{this.props.text}</span>
                  {this.props.p(this.props.value).comp(callback => x =>
                             this.props.cont(callback)(x))}
           </label>
  }
}

export function label<A>(text:string, key?:string, dbg?:() => string) : (p:(_:A)=>C<A>) => ((_:A) => C<A>) {
  return p => value => make_C<A>(cont =>
    (React.createElement<LabelProps<A>>(Label,
    { kind:"label", debug_info:dbg, text:text, value:value, p:p as (_:A)=>C<A>, cont:cont, key:key })))
}

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
    if (new_props.value != this.state.value) this.setState({...this.state, value: new_props.value})
  }
  render() {
    return this.props.mode == "edit" ? <input type="text"
                  value={this.state.value}
                  onChange={e => {
                    if (this.state.value == e.currentTarget.value) return
                    this.setState({...this.state,
                      value:e.currentTarget.value},
                      () => this.props.cont(()=>null)(this.state.value))}
                  } />
            :
              <span>{this.state.value}</span>
  }
}

export let string = (mode:Mode, key?:string, dbg?:() => string) => function(value:string) : C<string> {
  return make_C<string>(cont =>
    React.createElement<StringProps>(String, { kind:"string", debug_info:dbg, mode:mode, value:value, cont:cont, key:key }))
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
          p(this.props.value).comp(callback => new_value =>
            this.props.cont(callback)(new_value))
        )
      }
    </div>
  }
}


export let any = function<A>(ps:Array<(_:A)=>C<A>>, key?:string, dbg?:() => string) : ((_:A) => C<A>) {
  return initial_value => make_C<A>(cont =>
    React.createElement<AnyProps<A>>(Any,
      { kind:"any", debug_info:dbg, ps:ps as Array<(_:A)=>C<A>>, value:initial_value, cont:cont, key:key }))
}

type RetractState<A,B> = {}
class Retract<A,B> extends React.Component<RetractProps<A,B>,RetractState<A,B>> {
  constructor(props:RetractProps<A,B>,context:any) {
    super()
    this.state = {}
  }
  render() {
    return this.props.p(this.props.inb(this.props.value)).comp
            (callback => new_value =>
              this.props.cont(callback)
                (this.props.out(this.props.value)(new_value)))
  }
}

export let retract = function<A,B>(inb:(_:A)=>B, out:(_:A)=>(_:B)=>A, p:(_:B)=>C<B>, key?:string, dbg?:() => string) : ((_:A) => C<A>) {
  return (initial_value:A) => make_C<A>((cont:Cont<A>) =>
    React.createElement<RetractProps<A,B>>(Retract,
      { kind:"retract", debug_info:dbg, inb:inb as (_:A)=>any, out:out as (_:A)=>(_:any)=>A, p:p as (_:any)=>C<any>, value:initial_value, cont:cont, key:key }))
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
  load(props:LiftPromiseProps<A,B>) {
    this.setState({...this.state, result:"busy"}, () =>
    props.p(this.state.input).then(x =>
      (this.props.debug_info && console.log("Promise done:", this.props.debug_info())) ||
      this.setState({...this.state, result:x}, () =>
      props.cont(() => null)(x)))
    .catch(() => this.setState({...this.state, result:"error"})))
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

export let lift_promise = function<A,B>(p:(_:A) => Promise<B>, is_value_changed:(old_value:A,new_value:A)=>boolean, key?:string, dbg?:() => string) : ((_:A)=>C<B>) {
  return x => make_C<B>(cont =>
    React.createElement<LiftPromiseProps<B,A>>(LiftPromise,
      { kind:"lift promise", debug_info:dbg, is_value_changed:is_value_changed, value:x, p:p as (_:any)=>Promise<B>, cont:cont, key:key }))
}


type DelayState<A> = { status:"dirty"|"waiting", value:A, last_command:JSX.Element }
class Delay<A> extends React.Component<DelayProps<A>,DelayState<A>> {
  constructor(props:DelayProps<A>,context:any) {
    super()
    this.state = { status:"dirty", value:props.value, last_command:props.p(props.value).comp(props.cont) }
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
    // console.log("Delay received new props and is going back to dirty")
    this.setState({...this.state, value: new_props.value, status:"dirty"})
  }
  render() {
    return this.state.last_command
  }
}

export let delay = function<A>(dt:number, key?:string, dbg?:() => string) : (p:(_:A)=>C<A>) => ((_:A) => C<A>) {
  return p => initial_value => make_C<A>(cont =>
    React.createElement<DelayProps<A>>(Delay,
      { kind:"delay", debug_info:dbg, dt:dt, p:p as (_:A)=>C<A>, value:initial_value, cont:cont, key:key }))
}

export let custom = function<A>(key?:string, dbg?:() => string) : (render:(_:Cont<A>) => JSX.Element) => C<A> {
  return (render) => make_C<A>(cont => render(cont))
}


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
    else if (this.props.type == "radio") {
      return <form>
        {
          this.props.items.map((i,i_index) => {
            let i_s = this.props.to_string(i)
            return <div key={i_s}>
                <label>{i_s}
                  <input key={i_s} name={name} type="radio" checked={i_index == this.state.selected}
                        onChange={e => {
                          if (e.currentTarget.checked == false) return
                          let selected = this.props.items.get(i_index)
                          this.setState({...this.state, selected: i_index}, () =>
                            this.props.cont(() => {})(selected))
                        } } />
                </label>
              </div>
          })
        }
      </form>
    }
  }
}

export let selector = function<A>(type:SelectorType, to_string:(_:A)=>string, key?:string, dbg?:() => string) : ((items:Immutable.List<A>, selected_item?:A) => C<A>) {
  return (items, selected_item) => make_C<A>(cont =>
    React.createElement<SelectorProps<A>>(Selector,
      { kind:"selector", debug_info:dbg, items:items, selected_item:selected_item, type:type, to_string:to_string, cont:cont, key:key }))
}

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
    } else if (this.props.type == "checkbox") {
      return <form>
        {
          this.props.items.map((i,i_index) => {
            let i_s = this.props.to_string(i)
            return <div key={i_s}>
                <label>
                  <span>{i_s}</span>
                  <input key={i_s} type="checkbox" checked={this.state.selected.has(i_index)}
                        onChange={e => {
                          let selected = this.props.items.get(i_index)
                          let selection = e.currentTarget.checked ? this.state.selected.add(i_index) : this.state.selected.remove(i_index)
                          this.setState({...this.state, selected: selection}, () => this.props.cont(() => {})(selection.map(index => this.props.items.get(index)).toList()))
                        } } />
                </label>
              </div>
          })
        }
      </form>
    }
  }
}

export let multi_selector = function<A>(type:MultiSelectorType, to_string:(_:A)=>string, key?:string, dbg?:() => string) : ((items:Immutable.List<A>, selected_items?:Immutable.List<A>) => C<Immutable.List<A>>) {
  return (items, selected_items) => make_C<Immutable.List<A>>((cont:Cont<Immutable.List<A>>) =>
    React.createElement<MultiSelectorProps<A>>(
      MultiSelector,
      { kind:"multi selector",
        debug_info:dbg,
        items:items,
        selected_items:selected_items,
        type:type,
        to_string:to_string,
        cont:cont,
        key:key }))
}


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
    return this.props.style == "fancy toggle" ?
            <input type="checkbox"
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


type ImageState = { src:string }
class Image extends React.Component<ImageProps,ImageState> {
  constructor(props:ImageProps,context:any) {
    super()
    this.state = { src:props.src }
  }
  componentWillReceiveProps(new_props:ImageProps) {
    if (new_props.src != this.state.src) this.setState({...this.state, src: new_props.src})
  }
  render() {
    return <div>
              <img src={this.state.src} />
              {
                this.props.mode == "edit" ?
                  <input type="file" accept="image/*" onChange={(e:any) => {
                      let files:FileList = (e.target as any).files;
                      let file_reader = new FileReader()

                      file_reader.onload = ((e) => {
                        let new_value = file_reader.result

                        this.setState({...this.state, src:new_value }, () =>
                        this.props.cont(() => null)(new_value))
                      })

                    file_reader.readAsDataURL(files[0]);
                    }
                  } />
                :
                  null
              }
            </div>

  }
}

export let image = (mode:Mode, key?:string, dbg?:() => string) => function(src:string) : C<string> {
  return make_C<string>(cont =>
    React.createElement<ImageProps>(Image, { kind:"image", debug_info:dbg, mode:mode, src:src, cont:cont, key:key }))
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
          content:this.state.selected != undefined ? this.props.p(this.props.items.get(this.state.selected)).comp(this.props.cont) : undefined})
  }
  render() {
    if (this.props.type == "side menu")
      return <div className="content_with_menu">
        <div className="side_menu">
          <img className="logo" src={"/images/logo.png"} alt="Logo"/>
          <div className="side_menu_entries">

            {this.props.items.map((i, i_i) =>
                  <div className={`side_menu_entry${i_i == this.state.selected ? " active" : ""}`}>
                    <a onClick={() =>
                        {
                          this.setState({...this.state, selected:i_i,
                              content:this.props.p(this.props.items.get(i_i)).comp(this.props.cont)})
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
        <div className="content">
          { this.state.content }
        </div>
      </div>
    else if (this.props.type == "tabs") {
      return <div>Not implemented</div>
    }
  }
}

export let menu = function<A,B>(type:MenuType, to_string:(_:A)=>string, key?:string, dbg?:() => string) : ((items:Immutable.List<A>, p:(_:A)=>C<B>, selected_item?:A) => C<B>) {
  return (items, p, selected_item) => make_C<B>(cont =>
    React.createElement<MenuProps<A,B>>(Menu,
      { kind:"menu", debug_info:dbg, items:items, selected_item:selected_item, type:type, to_string:to_string, p:p, cont:cont, key:key }))
}