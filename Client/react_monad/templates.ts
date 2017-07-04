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
  | { kind:"image",  field_name:string, download:(c:M) => C<string>, upload:(c:M) => (src:string) => C<string> }

export let inner_form = function<M>(model_name:(_:M)=>string, entries:FormEntry<M>[]) : (_:FormData<M>) => C<FormData<M>> {
  return c => repeat<FormData<M>>(c =>
    any<FormData<M>>(
      entries.map(e =>
        e.kind == "string" ?
          retract<FormData<M>, string>(
            c => e.in(c.model), c => s => {
              let new_c = e.out(c.model)(s)
              let errors = e.get_errors(new_c)
              return { model:new_c, errors: errors.length > 0 ? c.errors.set(e.field_name, errors) : c.errors.remove(e.field_name)} },
            div<string, string>(`monadic-field ${c.errors.has(e.field_name) ? "monadic-field-error" : ""}`)(
              // c.errors.has(e.field_name) ?
              //   c.errors.get(e.field_name).map(error =>
              //     _ => string("view", `${model_name(c.model)}_${e.field_name}_error`)(`Error: ${error}`).ignore())
              // :
                []
            )(string("edit", `${model_name(c.model)}_${e.field_name}`)), `${model_name(c.model)}_${e.field_name}_retract`)
        : e.kind == "number" ?
          retract<FormData<M>, number>(
            c => e.in(c.model), c => s => {
              let new_c = e.out(c.model)(s)
              let errors = e.get_errors(new_c)
              return { model:new_c, errors: errors.length > 0 ? c.errors.set(e.field_name, errors) : c.errors.remove(e.field_name)} },
            div<number, number>(`monadic-field ${c.errors.has(e.field_name) ? "monadic-field-error" : ""}`)(
              // c.errors.has(e.field_name) ?
              //   c.errors.get(e.field_name).map(error =>
              //     _ => string("view", `${model_name(c.model)}_${e.field_name}_error`)(`Error: ${error}`).ignore())
              // :
                []
            )(int("edit", `${model_name(c.model)}_${e.field_name}`)), `${model_name(c.model)}_${e.field_name}_retract`)
        :
          retract<FormData<M>, void>(
            c => null, c => _ => c,
            _ => e.download(c.model).bind(`${model_name(c.model)}_${e.field_name}_downloader`, src =>
            repeat<string>((src:string) =>
              image("edit", `${model_name(c.model)}_${e.field_name}`)(src).bind(`${model_name(c.model)}_${e.field_name}_uploader`, new_src =>
              e.upload(c.model)(new_src)))(src)).ignore(), `${model_name(c.model)}_${e.field_name}_retract`)
      )
    , `${model_name(c.model)}_inner_form`)(c), `${model_name(c.model)}_repeater`)(c)
}


export let form_errors = function<M>(model_name:(_:M)=>string, entries:FormEntry<M>[]) {
  return fd => div<FormData<M>, FormData<M>>(`form-errors`)(
        entries.map(e =>
          e.kind != "image" ?
            c => (c.errors.has(e.field_name) ?
              string("view", `${model_name(c.model)}_${e.field_name}`)(`${c.errors.get(e.field_name)}`).ignore(`${model_name(c.model)}_${e.field_name}_error_ignore`)
            : unit<void>(null)).filter(_ => false)
          :
            c => unit<void>(null).filter(_ => false)
          )
      )(c => unit<FormData<M>>(c).filter(_ => false))(fd).filter(_ => false)
}
