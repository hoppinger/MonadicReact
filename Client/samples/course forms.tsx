import * as React from "react"
import * as ReactDOM from "react-dom"
import {List, Map, Set} from "immutable"
import * as Immutable from "immutable"
import * as Models from '../generated_models'
import * as Api from '../generated_api'
import * as ViewUtils from '../generated_views/view_utils'
import {C, unit, bind} from '../react_monad/core'
import {string, int, bool} from '../react_monad/primitives'
import {button, selector, multi_selector, label, image, div} from '../react_monad/html'
import {custom, repeat, any, lift_promise, retract, delay, menu} from '../react_monad/combinators'
import * as Form from '../react_monad/templates'

let download_course : (_:number) => C<Models.Course> = c_id => lift_promise<void, Models.Course>(x => Api.get_Course(c_id).then(c => c.Item), ((p,q) => false), `course_downloader_lift_${c_id}`)(null)
let upload_course : (_:Models.Course) => C<Models.Course> = c =>
  lift_promise<Models.Course, Models.Course>(c => Api.update_Course(c).then(_ => c),
  (c1,c2) => c1.Id != c2.Id || c1.Name != c2.Name || c1.Points != c2.Points || c1.CreatedDate.toDate().getTime() != c2.CreatedDate.toDate().getTime(),
   `course_uploader_lift_${c.Id}`)(c)

let download_logo : (c:Models.Course) => C<string> = c => lift_promise<void, string>(x => Api.get_Course_Logo(c), ((p,q) => false), `course_logo_downloader_lift_${c.Id}`)(null)
let upload_logo : (c:Models.Course) => (logo:string) => C<string> = c => l =>
  lift_promise<[Models.Course, string], string>(([c,src]) => Api.update_Course_Logo(c, src).then(_ => src),
  (c1,c2) => c1[1] != c2[1], `course_logo_uploader_lift${c.Id}`)([c,l])

let course_form_name = c => `course_${c.Id}`
let course_form_entries_with_autosave : Array<Form.FormEntry<Models.Course>> = [
    { kind:"string", field_name:"Name", in:c => c.Name || "", out:c => n => ({...c, Name:n}), get_errors:c=>c.Name.length < 3 ? ["The name cannot be shorter than three characters."] : [] },
    { kind:"number", field_name:"Points", in:c => c.Points || 0, out:c => p => ({...c, Points:p}), get_errors:c=>c.Points < 1 ? ["The course must be worth at least one point."] : [] },
    { kind:"image", field_name:"Logo", download:download_logo, upload:upload_logo }
  ]

let inner_form_with_autosave =
  Form.inner_form<Models.Course>(course_form_name, course_form_entries_with_autosave)

export let course_form_with_autosave_sample : C<void> =
  download_course(1).bind(`course_downloader_${1}`, c =>
  inner_form({ model:c, errors:Immutable.Map<string,Array<string>>() }).bind(`course_error_recap_${c.Id}`,
  any<Form.FormData<Models.Course>>([
    c => Form.form_errors<Models.Course>(course_form_name, course_form_entries_with_autosave)(c).ignore_with(c).filter(_ => false),
    c => unit<Form.FormData<Models.Course>>(c)
  ]))
  .filter(c => c.errors.isEmpty(), `course_error_filter_${c.Id}`)
  .map<Models.Course>(c => c.model).bind(`course_uploader_${c.Id}`,
  delay<Models.Course>(200, `course_delayer_${c.Id}`)(upload_course)).ignore())


let course_form_entries : Array<Form.FormEntry<Models.Course>> = [
    { kind:"string", field_name:"Name", in:c => c.Name || "", out:c => n => ({...c, Name:n}), get_errors:c=>c.Name.length < 3 ? ["The name cannot be shorter than three characters."] : [] },
    { kind:"number", field_name:"Points", in:c => c.Points || 0, out:c => p => ({...c, Points:p}), get_errors:c=>c.Points < 1 ? ["The course must be worth at least one point."] : [] }
  ]

let inner_form =
  Form.inner_form<Models.Course>(course_form_name, course_form_entries)

export let course_form_sample : C<void> =
  download_course(1).bind(`course_downloader_${1}`, c =>
  inner_form({ model:c, errors:Immutable.Map<string,Array<string>>() }).bind(`course_form_${c.Id}`, c =>
    any<Form.FormData<Models.Course>>([
      Form.form_errors<Models.Course>(course_form_name, course_form_entries),
      c => button<Form.FormData<Models.Course>>(`Save`, !c.errors.isEmpty())(c)
    ])(c)
  ).map<Models.Course>(c => c.model).bind(`course_uploader`,
  delay<Models.Course>(200, `course_delayer_${c.Id}`)(upload_course)).ignore())
