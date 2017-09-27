import * as React from "react"
import * as ReactDOM from "react-dom"
import * as Immutable from "immutable"
import {C, Cont, CmdCommon, Mode, make_C, unit, bind} from './core'

export type H1Props<A,B> = { kind:"h1", className:string|undefined, text:string, value:A, p:(_:A)=>C<B> } & CmdCommon<B>
export type H2Props<A,B> = { kind:"h2", className:string|undefined, text:string, value:A, p:(_:A)=>C<B> } & CmdCommon<B>
export type LabelProps<A,B> = { kind:"label", className:string|undefined, text:string, span_before_content:boolean, value:A, p:(_:A)=>C<B> } & CmdCommon<B>
export type DivProps<A,B> = { kind:"div", className:string|undefined, value:A, p:(_:A)=>C<B> } & CmdCommon<B>
export type FormProps<A,B> = { kind:"form", className:string|undefined, value:A, p:(_:A)=>C<B> } & CmdCommon<B>
export type MultiSelectorType = "list"|"checkbox"
export type MultiSelectorProps<A> = { kind:"multi selector", type:MultiSelectorType, to_string:(_:A)=>string, items:Immutable.List<A>,
          selected_items:undefined|Immutable.List<A> } & CmdCommon<Array<A>>
export type ImageProps = { kind:"image", src:string, mode:Mode } & CmdCommon<string>
export type SelectorType = "dropdown"|"radio"
export type SelectorProps<A> = { kind:"selector", type:SelectorType, to_string:(_:A)=>string, items:Immutable.List<A>, selected_item:undefined|A } & CmdCommon<A>
export type ButtonProps<A> = { label:string, x:A, disabled:boolean, className:string } & CmdCommon<A> & ({ kind:"button" } | { kind:"a", href:string, rel?:"nofollow" })
export type LinkProps = { kind:"link", label:string, url:string, disabled:boolean, className:string } & CmdCommon<void>
export type FileProps = { kind:"file", label:string, url:string, mode:Mode, disabled:boolean } & CmdCommon<File>

type LabelState<A,B> = { p:"creating"|JSX.Element }
class Label<A,B> extends React.Component<LabelProps<A,B>,LabelState<A,B>> {
  constructor(props:LabelProps<A,B>,context:any) {
    super()
    this.state = { p:"creating" }
  }
  componentWillReceiveProps(new_props:LabelProps<A,B>) {
    this.props.debug_info && console.log("New props:", this.props.debug_info())
    this.setState({...this.state, p:new_props.p(new_props.value).comp(new_props.context)(callback => x =>
                             new_props.cont(callback)(x))})
  }
  componentWillMount() {
    this.setState({...this.state, p:this.props.p(this.props.value).comp(this.props.context)(callback => x =>
                             this.props.cont(callback)(x))})
  }

  render() {
    let content : JSX.Element = this.state.p == "creating" ? null : this.state.p
    let span = <span key="label_span">{this.props.text}</span>
    return <label className={this.props.className}>
             {this.props.span_before_content ? [span,content] : [content,span]}
           </label>
  }
}

export function label<A,B>(text:string, span_before_content?:boolean, className?:string, key?:string, dbg?:() => string) : (p:(_:A)=>C<B>) => ((_:A) => C<B>) {
  return p => value => make_C<B>(ctxt => cont =>
    (React.createElement<LabelProps<A,B>>(Label,
    { kind:"label", className:className, debug_info:dbg, text:text, span_before_content:span_before_content, value:value, p:p, context:ctxt, cont:cont, key:key })))
}

type H1State<A,B> = { p:"creating"|JSX.Element }
class H1<A,B> extends React.Component<H1Props<A,B>,H1State<A,B>> {
  constructor(props:H1Props<A,B>,context:any) {
    super()
    this.state = { p:"creating" }
  }
  componentWillReceiveProps(new_props:H1Props<A,B>) {
    this.props.debug_info && console.log("New props:", this.props.debug_info())
    this.setState({...this.state, p:new_props.p(new_props.value).comp(new_props.context)(callback => x =>
                             new_props.cont(callback)(x))})
  }
  componentWillMount() {
    this.setState({...this.state, p:this.props.p(this.props.value).comp(this.props.context)(callback => x =>
                             this.props.cont(callback)(x))})
  }

  render() {
    let content : JSX.Element = this.state.p == "creating" ? null : this.state.p
    let span = <span>{this.props.text}</span>
    return <div className={this.props.className}>
             <h1>{span}</h1>
             {content}
           </div>
  }
}

export function h1<A,B>(text:string, className?:string, key?:string, dbg?:() => string) : (p:(_:A)=>C<B>) => ((_:A) => C<B>) {
  return p => value => make_C<B>(ctxt => cont =>
    (React.createElement<H1Props<A,B>>(H1,
    { kind:"h1", className:className, debug_info:dbg, text:text, value:value, p:p, context:ctxt, cont:cont, key:key })))
}

type H2State<A,B> = { p:"creating"|JSX.Element }
class H2<A,B> extends React.Component<H2Props<A,B>,H2State<A,B>> {
  constructor(props:H2Props<A,B>,context:any) {
    super()
    this.state = { p:"creating" }
  }
  componentWillReceiveProps(new_props:H2Props<A,B>) {
    this.props.debug_info && console.log("New props:", this.props.debug_info())
    this.setState({...this.state, p:new_props.p(new_props.value).comp(new_props.context)(callback => x =>
                             new_props.cont(callback)(x))})
  }
  componentWillMount() {
    this.setState({...this.state, p:this.props.p(this.props.value).comp(this.props.context)(callback => x =>
                             this.props.cont(callback)(x))})
  }

  render() {
    let content : JSX.Element = this.state.p == "creating" ? null : this.state.p
    let span = <span>{this.props.text}</span>
    return <div className={this.props.className}>
             <h2>{span}</h2>
             {content}
           </div>
  }
}

export function h2<A,B>(text:string, className?:string, key?:string, dbg?:() => string) : (p:(_:A)=>C<B>) => ((_:A) => C<B>) {
  return p => value => make_C<B>(ctxt => cont =>
    (React.createElement<H2Props<A,B>>(H2,
    { kind:"h2", className:className, debug_info:dbg, text:text, value:value, p:p, context:ctxt, cont:cont, key:key })))
}

type DivState<A,B> = { p:"creating"|JSX.Element }
class Div<A,B> extends React.Component<DivProps<A,B>,DivState<A,B>> {
  constructor(props:DivProps<A,B>,context:any) {
    super()
    this.state = { p:"creating" }
  }
  componentWillReceiveProps(new_props:DivProps<A,B>) {
    this.props.debug_info && console.log("New props:", this.props.debug_info())
    this.setState({...this.state, p:new_props.p(new_props.value).comp(new_props.context)(callback => x =>
                             new_props.cont(callback)(x))})
  }
  componentWillMount() {
    this.setState({...this.state, p:this.props.p(this.props.value).comp(this.props.context)(callback => x =>
                             this.props.cont(callback)(x))})
  }
  render() {
    return <div className={this.props.className}>
        { this.state.p  != "creating" ? this.state.p  : null }
      </div>
  }
}

export function div<A,B>(className?:string, key?:string, dbg?:() => string) : (p:(_:A)=>C<B>) => ((_:A) => C<B>) {
  return p => value => make_C<B>(ctxt => cont =>
    (React.createElement<DivProps<A,B>>(Div,
    { kind:"div", className:className, debug_info:dbg, value:value, p:p, context:ctxt, cont:cont, key:key })))
}

export function overlay<A,B>(key?:string, dbg?:() => string) : (p:(_:A)=>C<B>) => ((_:A) => C<B>) {
  return p => div<A,B>(`overlay`)(div<A,B>(`overlay__item`)(p))
}

type FormState<A,B> = { p:"creating"|JSX.Element }
class Form<A,B> extends React.Component<FormProps<A,B>,FormState<A,B>> {
  constructor(props:FormProps<A,B>,context:any) {
    super()
    this.state = { p:"creating" }
  }
  componentWillReceiveProps(new_props:FormProps<A,B>) {
    this.props.debug_info && console.log("New props:", this.props.debug_info())
    this.setState({...this.state, p:new_props.p(new_props.value).comp(new_props.context)(callback => x =>
                             new_props.cont(callback)(x))})
  }
  componentWillMount() {
    this.setState({...this.state, p:this.props.p(this.props.value).comp(this.props.context)(callback => x =>
                             this.props.cont(callback)(x))})
  }
  render() {
    return <form className={this.props.className}>
        { this.state.p  != "creating" ? this.state.p  : null }
      </form>
  }
}

export function form<A,B>(className?:string, key?:string, dbg?:() => string) : (p:(_:A)=>C<B>) => ((_:A) => C<B>) {
  return p => value => make_C<B>(ctxt => cont =>
    (React.createElement<FormProps<A,B>>(Form,
    { kind:"form", className:className, debug_info:dbg, value:value, p:p, context:ctxt, cont:cont, key:key })))
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
      return <select value={this.state.selected == undefined ? "-1" : this.state.selected.toString()} onChange={e => {
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
    } else {
      return null
    }
  }
}

export let selector = function<A>(type:SelectorType, to_string:(_:A)=>string, key?:string, dbg?:() => string) : ((items:Array<A>, selected_item?:A) => C<A>) {
  return (items, selected_item) => make_C<A>(ctxt => cont =>
    React.createElement<SelectorProps<A>>(Selector,
      { kind:"selector", debug_info:dbg, items:Immutable.List<A>(items), selected_item:selected_item, type:type, to_string:to_string, context:ctxt, cont:cont, key:key }))
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
      this.props.cont(() => null)(this.state.selected.map(index => this.props.items.get(index)).toArray())
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
          this.props.cont(() => {})(selection.map(index => this.props.items.get(index)).toArray()))
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
                  <input key={i_s} type="checkbox" checked={this.state.selected.has(i_index)}
                        className="monadic-input-choices monadic-input-choices--checkbox"
                        onChange={e => {
                          let selected = this.props.items.get(i_index)
                          let selection = e.currentTarget.checked ? this.state.selected.add(i_index) : this.state.selected.remove(i_index)
                          this.setState({...this.state, selected: selection}, () => this.props.cont(() => {})(selection.map(index => this.props.items.get(index)).toArray()))
                        } } />
                  <span>{i_s}</span>
                </label>
              </div>
          })
        }
      </form>
    } else {
      return null
    }
  }
}

export let multi_selector = function<A>(type:MultiSelectorType, to_string:(_:A)=>string, key?:string, dbg?:() => string) : ((items:Array<A>, selected_items?:Array<A>) => C<Array<A>>) {
  return (items, selected_items) => make_C<Array<A>>(ctxt => (cont:Cont<Array<A>>) =>
    React.createElement<MultiSelectorProps<A>>(
      MultiSelector,
      { kind:"multi selector",
        debug_info:dbg,
        items:Immutable.List<A>(items),
        selected_items:selected_items ? Immutable.List<A>(selected_items) : Immutable.List<A>(),
        type:type,
        to_string:to_string,
        cont:cont,
        context:ctxt,
        key:key }))
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
                  <div className="image-controls">
                    <a className="user button button--delete"
                        onClick={() => {
                            if(confirm('Are you sure?')) {
                              let new_value = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAMSURBVBhXY/j//z8ABf4C/qc1gYQAAAAASUVORK5CYII="
                              this.setState({...this.state, src:new_value }, () =>
                              this.props.cont(() => null)(new_value))
                            }
                          }
                        }>
                    </a>
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
                  </div>
                :
                  null
              }
            </div>

  }
}

export let image = (mode:Mode, key?:string, dbg?:() => string) => function(src:string) : C<string> {
  return make_C<string>(ctxt => cont =>
    React.createElement<ImageProps>(Image, { kind:"image", debug_info:dbg, mode:mode, src:src, context:ctxt, cont:cont, key:key }))
}

type ButtonState<A> = { x:A }
class Button<A> extends React.Component<ButtonProps<A>, ButtonState<A>> {
  constructor(props:ButtonProps<A>,context:any) {
    super()
    this.state = { x:props.x }
  }
  componentWillReceiveProps(new_props:ButtonProps<A>) {
    this.setState({...this.state, x:new_props.x})
  }
  render() {
    return this.props.kind == "a" ?
      <a href={this.props.href} rel={this.props.rel || ""} className={`${this.props.className ? this.props.className : ""}${this.props.disabled ? " disabled" : ""}`} // disabled={this.props.disabled}
         onClick={e => {
           this.props.cont(() => {})(this.state.x)
           e.preventDefault()
           return false
         } }>{this.props.label}</a>

      :
      <button type="button" className={`button ${this.props.className ? this.props.className : ""}`} disabled={this.props.disabled}
         onClick={() => this.props.cont(() => {})(this.state.x)} >{this.props.label}</button>
  }
}

export let a = function<A>(label:string, href?:string, rel?:"nofollow", disabled?:boolean, key?:string, className?:string, dbg?:() => string) : ((x:A) => C<A>) {
  return x => make_C<A>(ctxt => cont =>
    React.createElement<ButtonProps<A>>(Button,
      { kind:"a", debug_info:dbg, label:label, href:href || "#", rel:rel, disabled:!!disabled, x:x, context:ctxt, cont:cont, key:key, className:className }))
}

export let button = function<A>(label:string, disabled?:boolean, key?:string, className?:string, dbg?:() => string) : ((x:A) => C<A>) {
  return x => make_C<A>(ctxt => cont =>
    React.createElement<ButtonProps<A>>(Button,
      { kind:"button", debug_info:dbg, label:label, disabled:!!disabled, x:x, context:ctxt, cont:cont, key:key, className:className }))
}


type LinkState = {  }
class Link extends React.Component<LinkProps, LinkState> {
  constructor(props:LinkProps, context:any) {
    super()
    this.state = {}
  }
  render() {
    return <a href={this.props.url} className={`${this.props.className || ""} ${this.props.disabled ? "disabled" : ""}`}>{this.props.label}</a>
  }
}

export let link = function<A>(label:string, url:string, disabled?:boolean, key?:string, className?:string, dbg?:() => string) : C<void> {
  return make_C<void>(ctxt => cont =>
    React.createElement<LinkProps>(Link,
      { kind:"link", debug_info:dbg, label:label, url:url, disabled:!!disabled, context:ctxt, cont:cont, key:key, className:className }))
}

type FileState = {}
class FileComponent extends React.Component<FileProps, FileState> {
  constructor(props:FileProps, context:any) {
    super()
    this.state = {}
  }
  render() {
    return <div>
      <span>
        <a href={this.props.url} >{this.props.label}</a></span>
        {this.props.mode == "view" ?
          null
            :
          <input disabled={this.props.disabled}
              type="file"
              onChange={(e:any) => {
                  let files:FileList = (e.target as any).files
                  let f = files[0]
                  this.props.cont(() => {})(f)
                }
              } />
        }
    </div>
  }
}

export let file = function<A>(mode:Mode, label:string, url:string, disabled?:boolean, key?:string, dbg?:() => string) : C<File> {
  return make_C<File>(ctxt => cont =>
    React.createElement<FileProps>(FileComponent,
      { kind:"file", mode:mode, debug_info:dbg, label:label, url:url, disabled:!!disabled, context:ctxt, cont:cont, key:key }))
}
