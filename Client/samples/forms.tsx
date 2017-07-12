import * as React from "react"
import * as ReactDOM from "react-dom"
import {List, Map, Set} from "immutable"
import * as Immutable from "immutable"
import * as Models from '../generated_models'
import * as Api from '../generated_api'
import * as ViewUtils from '../generated_views/view_utils'
import {C, unit, bind} from '../react_monad/core'
import {string, number, bool} from '../react_monad/primitives'
import {button, selector, multi_selector, label, image, div} from '../react_monad/html'
import {custom, repeat, any, lift_promise, retract, delay, menu} from '../react_monad/combinators'
import * as Form from '../react_monad/forms'

// Utils: these will be scaffolded at a later time
let download_course_with_logo : (_:number) => C<Models.Course> = c_id => lift_promise<void, Models.Course>(x => Api.get_Course_with_pictures(c_id).then(c => c.Item), "semi exponential", `course_downloader_lift_${c_id}`)(null)
let upload_course_with_logo : (_:Models.Course) => C<Models.Course> = c =>
  lift_promise<Models.Course, Models.Course>(c => Api.update_Course_with_pictures(c).then(_ => c),
  "semi exponential", `course_uploader_lift_${c.Id}`)(c)

let download_course : (_:number) => C<Models.Course> = c_id => lift_promise<void, Models.Course>(x => Api.get_Course(c_id).then(c => c.Item), "semi exponential", `course_downloader_lift_${c_id}`)(null)
let upload_course : (_:Models.Course) => C<Models.Course> = c =>
  lift_promise<Models.Course, Models.Course>(c => Api.update_Course(c).then(_ => c),
  "semi exponential", `course_uploader_lift_${c.Id}`)(c)
let download_logo : (c:Models.Course) => C<string> = c => lift_promise<void, string>(x => Api.get_Course_Logo(c), "semi exponential", `course_logo_downloader_lift_${c.Id}`)(null)
let upload_logo : (c:Models.Course) => (logo:string) => C<string> = c => l =>
  lift_promise<[Models.Course, string], string>(([c,src]) => Api.update_Course_Logo(c, src).then(_ => src),
  "semi exponential", `course_logo_uploader_lift${c.Id}`)([c,l])

let filename : (c:Models.Course) => string = c => c.Attachment
let attachment_url : (c:Models.Course) => string = c => `/api/v1/Course/${c.Id}/AttachmentDownload`
let upload_attachment : (c:Models.Course) => (attachment:File) => C<void> = c => a =>
  lift_promise<[Models.Course, File], void>(([c,file]) => Api.upload_Course_Attachment(c,file).then(_ => null),
  "semi exponential", `course_attachment_uploader_lift${c.Id}`)([c,a])

export let course_form_with_autosave_sample : C<void> =
  Form.simple_form_with_autosave("edit", c => `course_${c.Id}`,
  [
    { kind:"string", field_name:"Name", in:c => c.Name || "", out:c => (n:string) => ({...c, Name:n}), get_errors:c=>c.Name.length < 3 ? ["The name cannot be shorter than three characters."] : [] },
    { kind:"number", field_name:"Points", in:c => c.Points || 0, out:c => (p:number) => ({...c, Points:p}), get_errors:c=>c.Points < 1 ? ["The course must be worth at least one point."] : [] },
    { kind:"lazy image", field_name:"Logo", download:download_logo, upload:upload_logo },
    { kind:"lazy file", field_name:"Attachment", filename:filename, out:c => (f:File) => ({...c, Attachment:f.name}), url:attachment_url, upload:upload_attachment }
  ],
  download_course(1), upload_course)

export let course_form_sample : C<void> =
  Form.simple_form_with_save_button("edit", c => `course_${c.Id}`,
  [
    { kind:"string", field_name:"Name", in:c => c.Name || "", out:c => (n:string) => ({...c, Name:n}), get_errors:c=>c.Name.length < 3 ? ["The name cannot be shorter than three characters."] : [] },
    { kind:"number", field_name:"Points", in:c => c.Points || 0, out:c => (p:number) => ({...c, Points:p}), get_errors:c=>c.Points < 1 ? ["The course must be worth at least one point."] : [] },
    { kind:"image", field_name:"Logo", in:c => c.Logo || "", out:c => (l:string) => ({...c, Logo:l}), get_errors:c=>[] }
  ],
  download_course_with_logo(1), upload_course_with_logo)
