import * as React from "react"
import * as ReactDOM from "react-dom"
import {List, Map, Set} from "immutable"
import * as Immutable from "immutable"
import {C, unit, bind} from './core'
import {string, int, bool} from './primitives'
import {button, selector, multi_selector, label, image, div} from './html'
import {custom, repeat, any, lift_promise, retract, delay, menu} from './combinators'

export type FormErrors = { errors:Immutable.Map<string,Array<string>> }
export type FormData<M> = { model:M } & FormErrors

export type FormEntry<M> =
  | { kind:"string", field_name:string, in:(_:M)=>string, out:(_:M)=>(_:string)=>M, get_errors:(_:M)=>Array<string> }
  | { kind:"number", field_name:string, in:(_:M)=>number, out:(_:M)=>(_:number)=>M, get_errors:(_:M)=>Array<string> }
  | { kind:"image", field_name:string, in:(_:M)=>string, out:(_:M)=>(_:string)=>M, get_errors:(_:M)=>Array<string> }
  | { kind:"lazy image",  field_name:string, download:(c:M) => C<string>, upload:(c:M) => (src:string) => C<string> }

export let simple_inner_form = function<M>(model_name:(_:M)=>string, entries:FormEntry<M>[]) : (_:FormData<M>) => C<FormData<M>> {
  return c => repeat<FormData<M>>(c =>
    any<FormData<M>>(
      entries.map(e =>
        e.kind == "string" ?
          retract<FormData<M>, string>(
            c => e.in(c.model), c => s => {
              let new_c = e.out(c.model)(s)
              let errors = e.get_errors(new_c)
              return { model:new_c, errors: errors.length > 0 ? c.errors.set(e.field_name, errors) : c.errors.remove(e.field_name)} },
            label<string, string>(e.field_name, true)(div<string, string>(`monadic-field ${c.errors.has(e.field_name) ? "monadic-field-error" : ""}`)(
              // c.errors.has(e.field_name) ?
              //   c.errors.get(e.field_name).map(error =>
              //     _ => string("view", `${model_name(c.model)}_${e.field_name}_error`)(`Error: ${error}`).ignore())
              // :
                []
            )(string("edit", `${model_name(c.model)}_${e.field_name}`))), `${model_name(c.model)}_${e.field_name}_retract`)
        : e.kind == "number" ?
          retract<FormData<M>, number>(
            c => e.in(c.model), c => s => {
              let new_c = e.out(c.model)(s)
              let errors = e.get_errors(new_c)
              return { model:new_c, errors: errors.length > 0 ? c.errors.set(e.field_name, errors) : c.errors.remove(e.field_name)} },
            label<number, number>(e.field_name, true)(div<number, number>(`monadic-field ${c.errors.has(e.field_name) ? "monadic-field-error" : ""}`)(
              // c.errors.has(e.field_name) ?
              //   c.errors.get(e.field_name).map(error =>
              //     _ => string("view", `${model_name(c.model)}_${e.field_name}_error`)(`Error: ${error}`).ignore())
              // :
                []
            )(int("edit", `${model_name(c.model)}_${e.field_name}`))), `${model_name(c.model)}_${e.field_name}_retract`)
        : e.kind == "image" ?
          retract<FormData<M>, string>(
            c => e.in(c.model), c => s => {
              let new_c = e.out(c.model)(s)
              let errors = e.get_errors(new_c)
              return { model:new_c, errors: errors.length > 0 ? c.errors.set(e.field_name, errors) : c.errors.remove(e.field_name)} },
            label<string, string>(e.field_name, true)(div<string, string>(`monadic-field ${c.errors.has(e.field_name) ? "monadic-field-error" : ""}`)(
              // c.errors.has(e.field_name) ?
              //   c.errors.get(e.field_name).map(error =>
              //     _ => string("view", `${model_name(c.model)}_${e.field_name}_error`)(`Error: ${error}`).ignore())
              // :
                []
            )(image("edit", `${model_name(c.model)}_${e.field_name}`))), `${model_name(c.model)}_${e.field_name}_retract`)
        :
          retract<FormData<M>, void>(
            c => null, c => _ => c,
            _ => e.download(c.model).bind(`${model_name(c.model)}_${e.field_name}_downloader`, src =>
            repeat<string>((src:string) =>
              label<string, string>(e.field_name, true)(image("edit", `${model_name(c.model)}_${e.field_name}`))(src).bind(`${model_name(c.model)}_${e.field_name}_uploader`, new_src =>
              e.upload(c.model)(new_src)))(src)).ignore(), `${model_name(c.model)}_${e.field_name}_retract`)
      )
    , `${model_name(c.model)}_inner_form`)(c), `${model_name(c.model)}_repeater`)(c)
}

export let form_errors = function<M>(model_name:(_:M)=>string, entries:FormEntry<M>[]) {
  return fd => div<FormData<M>, FormData<M>>(`form-errors`)(
        entries.map(e =>
          e.kind != "lazy image" && e.kind != "image" ?
            c => (c.errors.has(e.field_name) ?
              string("view", `${model_name(c.model)}_${e.field_name}`)(`${c.errors.get(e.field_name)}`).ignore(`${model_name(c.model)}_${e.field_name}_error_ignore`)
            : unit<void>(null)).filter(_ => false)
          :
            c => unit<void>(null).filter(_ => false)
          )
      )(c => unit<FormData<M>>(c).filter(_ => false))(fd).filter(_ => false)
}

export let simple_form_with_autosave = function<M>(model_name:(_:M)=>string, entries:FormEntry<M>[],
    download_M:C<M>, upload_M:(_:M)=>C<M>) : C<void> {
  return download_M.bind(undefined, c =>
  simple_inner_form<M>(model_name, entries)({ model:c, errors:Immutable.Map<string,Array<string>>() })
  .bind(`${model_name(c)}_error_recap`,
  any<FormData<M>>([
    c => form_errors<M>(model_name, entries)(c).ignore_with(c).filter(_ => false),
    c => unit<FormData<M>>(c)
  ]))
  .filter(c => c.errors.isEmpty(), `${model_name(c)}_error_filter`)
  .map<M>(c => c.model).bind(`${model_name(c)}_uploader`,
  delay<M>(200, `${model_name(c)}_delay`)(upload_M)).ignore())
}


export let simple_form_with_save_button = function<M>(model_name:(_:M)=>string, entries:FormEntry<M>[],
    download_M:C<M>, upload_M:(_:M)=>C<M>) : C<void> {
  return download_M.bind(undefined, c =>
    simple_inner_form<M>(model_name, entries)({ model:c, errors:Immutable.Map<string,Array<string>>() }).bind(`${model_name(c)}_form`, c =>
      any<FormData<M>>([
        form_errors<M>(model_name, entries),
        c => button<FormData<M>>(`Save`, !c.errors.isEmpty())(c)
      ])(c)
    ).map<M>(c => c.model).bind(`${model_name(c)}_uploader`,
    delay<M>(200, `${model_name(c)}_delayer`)(upload_M)).ignore())
}

export let simple_form_with_prev_and_next_buttons = function<M>(model_name:(_:M)=>string, entries:FormEntry<M>[],
    prev_enabled:(_:FormData<M>)=>boolean, next_enabled:(_:FormData<M>)=>boolean,
    on_prev:(_:M)=>M, on_next:(_:M)=>M) : (_:FormData<M>) => C<FormData<M>> {
  return c =>
    simple_inner_form<M>(model_name, entries)(c).bind(`${model_name(c.model)}_form`, c =>
      any<FormData<M>>([
        form_errors<M>(model_name, entries),
        c => button<FormData<M>>(`prev`, prev_enabled(c))(c).map<FormData<M>>(c => ({...c, model:on_prev(c.model)})),
        c => button<FormData<M>>(`next`, next_enabled(c))(c).map<FormData<M>>(c => ({...c, model:on_next(c.model)}))
      ])(c)
    )
}