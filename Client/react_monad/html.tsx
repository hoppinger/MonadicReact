import * as React from "react"
import * as ReactDOM from "react-dom"
import * as Immutable from "immutable"
import {C, Cont, CmdCommon, make_C, unit, bind} from './core'

export type Mode = "edit"|"view"
export type LabelProps<A,B> = { kind:"label", className:string|undefined, text:string, value:A, p:(_:A)=>C<B> } & CmdCommon<B>
export type DivProps<A,B> = { kind:"div", className:string|undefined, value:A, p:(_:A)=>C<B> } & CmdCommon<B>
export type MultiSelectorType = "list"|"checkbox"
export type MultiSelectorProps<A> = { kind:"multi selector", type:MultiSelectorType, to_string:(_:A)=>string, items:Immutable.List<A>,
          selected_items:undefined|Immutable.List<A> } & CmdCommon<Immutable.List<A>>
export type ImageProps = { kind:"image", src:string, mode:Mode } & CmdCommon<string>
export type SelectorType = "dropdown"|"radio"
export type SelectorProps<A> = { kind:"selector", type:SelectorType, to_string:(_:A)=>string, items:Immutable.List<A>, selected_item:undefined|A } & CmdCommon<A>
export type ButtonProps<A> = { kind:"button", label:string, x:A, disabled:boolean } & CmdCommon<A>

type LabelState<A,B> = {}
class Label<A,B> extends React.Component<LabelProps<A,B>,LabelState<A,B>> {
  constructor(props:LabelProps<A,B>,context:any) {
    super()
    this.state = {}
  }
  render() {
    return <label className={this.props.className}>
                  <span>{this.props.text}</span>
                  {this.props.p(this.props.value).comp(callback => x =>
                             this.props.cont(callback)(x))}
           </label>
  }
}

export function label<A,B>(text:string, className?:string, key?:string, dbg?:() => string) : (p:(_:A)=>C<B>) => ((_:A) => C<B>) {
  return p => value => make_C<B>(cont =>
    (React.createElement<LabelProps<A,B>>(Label,
    { kind:"label", className:className, debug_info:dbg, text:text, value:value, p:p, cont:cont, key:key })))
}

type DivState<A,B> = {}
class Div<A,B> extends React.Component<DivProps<A,B>,DivState<A,B>> {
  constructor(props:DivProps<A,B>,context:any) {
    super()
    this.state = {}
  }
  render() {
    return <div className={this.props.className}>
                  {this.props.p(this.props.value).comp(callback => x =>
                             this.props.cont(callback)(x))}
           </div>
  }
}

export function div<A,B>(className?:string, key?:string, dbg?:() => string) : (p:(_:A)=>C<B>) => ((_:A) => C<B>) {
  return p => value => make_C<B>(cont =>
    (React.createElement<DivProps<A,B>>(Div,
    { kind:"div", className:className, debug_info:dbg, value:value, p:p, cont:cont, key:key })))
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
                  <input key={i_s} type="checkbox" checked={this.state.selected.has(i_index)}
                        className="monadic-input-choices monadic-input-choices--checkbox"
                        onChange={e => {
                          let selected = this.props.items.get(i_index)
                          let selection = e.currentTarget.checked ? this.state.selected.add(i_index) : this.state.selected.remove(i_index)
                          this.setState({...this.state, selected: selection}, () => this.props.cont(() => {})(selection.map(index => this.props.items.get(index)).toList()))
                        } } />
                  <span>{i_s}</span>
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
  return make_C<string>(cont =>
    React.createElement<ImageProps>(Image, { kind:"image", debug_info:dbg, mode:mode, src:src, cont:cont, key:key }))
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
    return <button className="button" disabled={this.props.disabled}
                   onClick={() => this.props.cont(() => {})(this.state.x)} >{this.props.label}</button>
  }
}

export let button = function<A>(label:string, disabled?:boolean, key?:string, dbg?:() => string) : ((x:A) => C<A>) {
  return x => make_C<A>(cont =>
    React.createElement<ButtonProps<A>>(Button,
      { kind:"button", debug_info:dbg, label:label, disabled:!!disabled, x:x, cont:cont, key:key }))
}
