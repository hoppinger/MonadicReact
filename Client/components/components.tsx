import * as React from "react"
import * as ReactDOM from "react-dom"
import * as Immutable from "immutable"
import * as ViewUtils from "../generated_views/view_utils"
import * as LazyImage from "./lazy_image"
import * as Draft from 'draft-js';
import * as RichTextEditor from "./rich_text"
import * as Moment from 'moment'

function format_int(num:number, length:number) : string {
    return (num / Math.pow(10, length)).toFixed(length).substr(2);
}

export function Input(
  can_edit:boolean,
  mode:ViewUtils.EntityMode,
  get_item:()=>string,
  set_item:(v:string)=>void,
  type:"text"|"tel"|"url"|"email",
  validation?:(_:string)=>"ok"|{ error:string }) : JSX.Element {
  return mode == "view" ?
      <div>{get_item()}</div>
    :
      <input disabled={!can_edit} type={type}
        value={get_item()}
        onChange={(e) => {
          let new_value = (e.target as HTMLInputElement).value
          if (!validation || validation(new_value))
            set_item(new_value)
        } }/>
}

export function String(
  can_edit:boolean,
  mode:ViewUtils.EntityMode,
  get_item:()=>string,
  set_item:(v:string)=>void,
  validation?:(_:string)=>"ok"|{ error:string }) : JSX.Element {
  return Input(can_edit, mode, get_item, set_item, "text", validation)
}

export function Tel(
  can_edit:boolean,
  mode:ViewUtils.EntityMode,
  get_item:()=>string,
  set_item:(v:string)=>void,
  validation?:(_:string)=>"ok"|{ error:string }) : JSX.Element {
  let item = get_item()
  return mode == "view" ?
      <a href={`tel:${item}`}>{item}</a>
    :
      Input(can_edit, mode, get_item, set_item, "tel", validation)
}

export function Email(
  can_edit:boolean,
  mode:ViewUtils.EntityMode,
  get_item:()=>string,
  set_item:(v:string)=>void,
  validation?:(_:string)=>"ok"|{ error:string }) : JSX.Element {
  let item = get_item()
  return mode == "view" ?
      <a href={`mailto:${item}`}>{item}</a>
    :
      Input(can_edit, mode, get_item, set_item, "email", validation)
}

export function Url(
  can_edit:boolean,
  mode:ViewUtils.EntityMode,
  get_item:()=>string,
  set_item:(v:string)=>void,
  validation?:(_:string)=>"ok"|{ error:string }) : JSX.Element {
  let item = get_item()
  return mode == "view" ?
      <a href={`${item}`}>{item}</a>
    :
       Input(can_edit, mode, get_item, set_item, "url", validation)
}

export function Title(
  can_edit:boolean,
  mode:ViewUtils.EntityMode,
  get_item:()=>string,
  set_item:(v:string)=>void,
  validation?:(_:string)=>"ok"|{ error:string }) : JSX.Element {
  return mode == "view" ?
      <div className="model-preview">{get_item()}</div>
    :
      <input disabled={!can_edit} type="text"
        value={get_item()}
        onChange={(e) => {
          let new_value = (e.target as HTMLInputElement).value
          if (!validation || validation(new_value))
            set_item(new_value)
        } }/>
}

export function Text(
  can_edit:boolean,
  mode:ViewUtils.EntityMode,
  get_item:()=>string,
  set_item:(v:string)=>void,
  validation?:(_:string)=>"ok"|{ error:string }) : JSX.Element {
  return <textarea disabled={!can_edit || mode == "view"} type="text"
        value={get_item()}
        onChange={(e) => {
          let new_value = (e.target as HTMLInputElement).value
          if (!validation || validation(new_value))
            set_item(new_value)
        } }/>
}

export function Number(
  can_edit:boolean,
  mode:ViewUtils.EntityMode,
  get_item:()=>number,
  set_item:(v:number)=>void,
  validation?:(_:number)=>"ok"|{ error:string }) : JSX.Element {
  return mode == "view" ?
      <div>{(get_item() == NaN || get_item() == undefined) ? '' : get_item()}</div>
    :
      <input disabled={!can_edit} type="number"
        value={`${get_item()}`}
        onChange={(e) => {
          let new_value = (e.target as HTMLInputElement).valueAsNumber
          if (!validation || validation(new_value))
            set_item(new_value)
        } }/>
}

export function Boolean(
  can_edit:boolean,
  mode:ViewUtils.EntityMode,
  get_item:()=>boolean,
  set_item:(v:boolean)=>void) : JSX.Element {
  return <input
    disabled={!can_edit || mode == "view"}
    type="checkbox"
    checked={get_item()}
    onChange={(e) => {
      set_item((e.target as HTMLInputElement).checked)
    } }
  />
}

export function DateTime(
  can_edit:boolean,
  mode:ViewUtils.EntityMode,
  get_item:()=>Moment.Moment,
  set_item:(v:Moment.Moment)=>void) : JSX.Element {
  let item = get_item()
  let default_value = `${format_int(item.year(), 4)}-${format_int(item.month()+1, 2)}-${format_int(item.date(), 2)}T${format_int(item.hours(), 2)}:${format_int(item.minutes(), 2)}`
  return mode == "view" ?
    <div>{ `${format_int(item.date(), 2)}/${format_int(item.month()+1, 2)}/${format_int(item.year(), 4)}  ${format_int(item.hours(), 2)}:${format_int(item.minutes(), 2)}` }</div>
  : <input
    disabled={!can_edit}
    type="datetime-local"
    value={default_value}
    onChange={(e) => {
      set_item(Moment.utc(e.currentTarget.value))
    } }
  />
}

export function DateOnly(
  can_edit:boolean,
  mode:ViewUtils.EntityMode,
  get_item:()=>Moment.Moment,
  set_item:(v:Moment.Moment)=>void) : JSX.Element {
  let item = get_item()
  let default_value = `${format_int(item.year(), 4)}-${format_int(item.month()+1, 2)}-${format_int(item.date(), 2)}`
  return mode == "view" ?
    <div>{ `${format_int(item.date(), 2)}/${format_int(item.month()+1, 2)}/${format_int(item.year(), 4)}` }</div>
  : <input
    disabled={!can_edit}
    type="date"
    value={default_value}
    onChange={(e) => {
      set_item(Moment.utc(new Date(e.currentTarget.value)).startOf('d').add(12, 'h'))
      // set_item(e.currentTarget.valueAsDate)
    } }
  />
}

export function Time(
  can_edit:boolean,
  mode:ViewUtils.EntityMode,
  get_item:()=>Moment.Moment,
  set_item:(v:Moment.Moment)=>void) : JSX.Element {
  let item = get_item()
  let default_value = `${format_int(item.hours(), 2)}:${format_int(item.minutes(), 2)}`
  return mode == "view" ?
    <div>{ default_value }</div>
  : <input
    disabled={!can_edit}
    type="time"
    value={default_value}
    onChange={(e) => {
      set_item(Moment.utc(new Date(e.currentTarget.valueAsDate)))
      // set_item(e.currentTarget.valueAsDate)
    } }
  />
}

export type UnionCase = { value:string, label:string }

export function Union(
  can_edit:boolean,
  mode:ViewUtils.EntityMode,
  options:Immutable.List<UnionCase>,
  get_item:()=>string|null,
  set_item:(v:string)=>void) : JSX.Element {
  let item = get_item()
  let current = options.find(o => o.value == item)
  return mode == "view" ? <div>{current ? current.label : ""}</div> :
      <select value={item}
                 onChange={(s:React.FormEvent<HTMLSelectElement>) =>
                   set_item(s.currentTarget.value)}>
        {
          options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)
        }
      </select>
}

export function Image(
    can_edit:boolean,
    mode:ViewUtils.EntityMode,
    get_item:()=>Promise<string>,
    set_item:(src:string)=>Promise<void>) {
  return <LazyImage.LazyImage
      can_edit={can_edit && mode == "edit"}
      download={() => get_item()}
      upload={(new_src:string) => set_item(new_src)} />
}

export function RichText(
    can_edit:boolean,
    mode:ViewUtils.EntityMode,
    get_item:()=>string|null,
    set_item:(src:string)=>void) {
  let item = get_item()
  return <RichTextEditor.RichTextEditor
        initial_state={item ?
                  RichTextEditor.RichTextEditor.deserialize_state(item) :
                  RichTextEditor.RichTextEditor.empty_state() }
        set_state={(s:Draft.EditorState, on_success?: () => void) => {
          let new_value = RichTextEditor.RichTextEditor.serialize_state(s) as string
          set_item(new_value)
        }}
        editable={can_edit && mode == "edit"} />
}

export function File(
    can_edit:boolean,
    mode:ViewUtils.EntityMode,
    url:string,
    label:string,
    upload:(f:File) => Promise<void>) {
  return <div>
    <span>Filename:
        <a href={url} >{label}</a></span>
      {mode == "view" ? null :
          <input disabled={!can_edit}
              type="file"
              onChange={(e:any) => {
                  let files:FileList = (e.target as any).files
                  upload(files[0])
                }
              } />
      }
    </div>
}
