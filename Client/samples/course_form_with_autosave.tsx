import * as React from "react"
import * as ReactDOM from "react-dom"
import {List, Map, Set} from "immutable"
import * as Immutable from "immutable"
import * as Models from '../generated_models'
import * as Api from '../generated_api'
import * as ViewUtils from '../generated_views/view_utils'
import {C, unit, bind} from '../react_monad/core'
import {string, int, bool} from '../react_monad/primitives'
import {button, selector, multi_selector, label, image} from '../react_monad/html'
import {custom, repeat, any, lift_promise, retract, delay, menu} from '../react_monad/combinators'

let inner_form : (_:Models.Course) => C<Models.Course> = c =>
  repeat<Models.Course>(
    any<Models.Course>([
      retract<Models.Course, string>(
        c => c.Name || "", c => n => ({...c, Name:n}),
        string("edit", `course_name_${c.Id}`), `course_name_retract_${c.Id}`),
      retract<Models.Course, number>(
        c => c.Points || 0, c => p => ({...c, Points:p}),
        int("edit", `course_points_${c.Id}`), `course_points_retract_${c.Id}`),
      retract<Models.Course, void>(
        c => null, c => _ => c,
        _ => download_logo(c).bind(`logo_downloader${c.Id}`, src =>
        repeat<string>((src:string) =>
          image("edit", `course_logo_${c.Id}`)(src).bind(`logo_uploader${c.Id}`, new_src =>
          upload_logo(c)(new_src)))(src)).ignore(), `course_logo_retract_${c.Id}`),
    ], `inner_course_form_${c.Id}`), `course_repeater_${c.Id}`)(c)

let download_course : (_:number) => C<Models.Course> = c_id => lift_promise<void, Models.Course>(x => Api.get_Course(c_id).then(c => c.Item), ((p,q) => false), `course_downloader_lift_${c_id}`)(null)
let upload_course : (_:Models.Course) => C<Models.Course> = c =>
  lift_promise<Models.Course, Models.Course>(c => Api.update_Course(c).then(_ => c),
  (c1,c2) => c1.Id != c2.Id || c1.Name != c2.Name || c1.Points != c2.Points || c1.CreatedDate.toDate().getTime() != c2.CreatedDate.toDate().getTime(),
   `course_uploader_lift_${c.Id}`)(c)

let download_logo : (c:Models.Course) => C<string> = c => lift_promise<void, string>(x => Api.get_Course_Logo(c), ((p,q) => false), `course_logo_downloader_lift_${c.Id}`)(null)
let upload_logo : (c:Models.Course) => (logo:string) => C<string> = c => l =>
  lift_promise<[Models.Course, string], string>(([c,src]) => Api.update_Course_Logo(c, src).then(_ => src),
  (c1,c2) => c1[1] != c2[1], `course_logo_uploader_lift${c.Id}`)([c,l])


export let course_form_sample : C<void> =
  download_course(1).bind(`course_downloader_${1}`, c =>
  inner_form(c).bind(`course_form_${c.Id}`,
  delay<Models.Course>(200, `course_delayer_${c.Id}`)(upload_course)).ignore())
