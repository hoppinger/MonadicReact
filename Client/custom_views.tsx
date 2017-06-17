import * as React from "react"
import * as ReactDOM from "react-dom"
import * as Immutable from "immutable"
import * as Models from './generated_models'
import * as Api from './generated_api'
import * as ViewUtils from './generated_views/view_utils'
import {C, unit, bind, bind_once, lift_promise, retract, delay, repeat, string, int, any} from './react_monad/monad'
import {Interpreter} from './react_monad/interpreter'


let inner_course_form : (_:Models.Course) => C<Models.Course> = c =>
  any<Models.Course>(`inner_course_form_${c.Id}`, [
    c => retract<Models.Course, string>(`course_retract_${c.Id}`,
      c => c.Name || "", c => n => ({...c, Name:n}),
      string(`course_name_${c.Id}`))(c),
    c => retract<Models.Course, number>(`course_retract_${c.Id}`,
      c => c.Points || 0, c => p => ({...c, Points:p}),
      int(`course_points_${c.Id}`))(c)
  ])(c)

let course_form : (_:Models.Course) => C<Models.Course> = c =>
  repeat<Models.Course>(`course_repeater_${c.Id}`, c =>
    inner_course_form(c))(c)

let course_form_uploader : (_:Models.Course) => C<Models.Course> = c =>
  course_form(c).then(`course_form_${c.Id}`, false, c =>
  delay<Models.Course>(`course_delayer_${c.Id}`, 2000)(c => upload_course(c))(c))

let download_course : (_:number) => C<Models.Course> = c_id => lift_promise<void, Models.Course>(`course_downloader_lift_${c_id}`, x => Api.get_Course(c_id).then(c => c.Item))(null)
let upload_course : (_:Models.Course) => C<Models.Course> = c =>
  lift_promise<Models.Course, void>(`course_uploader_lift_${c.Id}`, Api.update_Course)(c).then(`course_uploader_${c.Id}`, false, _ =>
  unit<Models.Course>(c))


let course_view = (c_id:number) =>
  download_course(c_id).then(`course_downloader_${c_id}`, true, c =>
  course_form_uploader(c)
  )



export let HomePage = (props:ViewUtils.EntityComponentProps<Models.HomePage>) : JSX.Element => {
  return <div>
      This is the homepage
      <Interpreter cmd={
        course_view(1).comp(continuation => value => console.log("something has happened"))
      } />
  </div>
}

// TODO:
  // "delay" operator does not send the last update (after the first)
  // npm package
  // various operators
