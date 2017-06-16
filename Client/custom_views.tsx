import * as React from "react"
import * as ReactDOM from "react-dom"
import * as Immutable from "immutable"
import * as Models from './generated_models'
import * as Api from './generated_api'
import * as ViewUtils from './generated_views/view_utils'
import {C, unit, bind, bind_once, lift_promise, retract, delay, repeat, string} from './react_monad/monad'
import {Interpreter} from './react_monad/interpreter'


let course_form : (_:Models.Course) => C<Models.Course> = c =>
  repeat<Models.Course>(`course_repeater_${c.Id}`, c =>
    retract<Models.Course, string>(`course_retract_${c.Id}`,
      c => c.Name || "", c => n => ({...c, Name:n}),
      string(`course_name_${c.Id}`))(c))(c)

let course_form_uploader : (_:Models.Course) => C<Models.Course> = c =>
  bind<Models.Course, Models.Course>(`course_form_${c.Id}`, course_form(c), c =>
  delay<Models.Course>(`course_delayer_${c.Id}`, 0.2)(c => upload_course(c))(c))

let download_course : (_:number) => C<Models.Course> = c_id => lift_promise<void, Models.Course>(`course_downloader_lift_${c_id}`, x => Api.get_Course(c_id).then(c => c.Item))(null)
let upload_course : (_:Models.Course) => C<Models.Course> = c =>
  bind<void,Models.Course>(`course_uploader_${c.Id}`, lift_promise<Models.Course, void>(`course_uploader_lift_${c.Id}`, Api.update_Course)(c), _ =>
  unit<Models.Course>(c))


let course_view = (c_id:number) =>
  bind_once<Models.Course, Models.Course>(`course_downloader_${c_id}`, download_course(c_id), c =>
  course_form_uploader(c)
  )



export let HomePage = (props:ViewUtils.EntityComponentProps<Models.HomePage>) : JSX.Element => {
  return <div>
      This is the homepage
      <Interpreter cmd={
        course_view(1)(continuation => value => console.log("something has happened"))
      } />
  </div>
}

// TODO:
  // componentWillReceiveProps
  // "any" operator
  // "number" operator
  // github repository (private)
  // npm package

// any<A> : (A => C<A>)[] => (A => C<A>)
// any folds all the elements, and cont's the first to register the event
// all
// menu
// tabs
// boolean
// union
// radio
// dropdown
// open/close
// toggle
// list
// add new
// add existing
// page manager (with url's)
