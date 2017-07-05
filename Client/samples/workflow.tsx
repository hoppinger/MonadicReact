import * as React from "react"
import * as ReactDOM from "react-dom"
import {List, Map, Set} from "immutable"
import * as Immutable from "immutable"
import * as Moment from 'moment'
import * as Models from '../generated_models'
import * as Api from '../generated_api'
import * as ViewUtils from '../generated_views/view_utils'
import {C, unit, bind} from '../react_monad/core'
import {string, number, bool} from '../react_monad/primitives'
import {button, selector, multi_selector, label, image} from '../react_monad/html'
import {custom, repeat, any, lift_promise, retract, delay, menu} from '../react_monad/combinators'
import * as Form from '../react_monad/forms'
import {simple_workflow, WorkflowData} from '../react_monad/workflow'


type CreateCourseStep = "name" | "points" | "recap" | "sent" | "closed"

let create_course_step1 : ((_:WorkflowData<CreateCourseStep, Models.Course>) => C<WorkflowData<CreateCourseStep, Models.Course>>) = c =>
  Form.simple_form_with_prev_and_next_buttons<WorkflowData<CreateCourseStep, Models.Course>>("edit", c => `course_${c.model.Id}_${c.step}`,
    [
      { kind:"string", field_name:"Name", in:c => c.model.Name || "", out:c => n => ({...c, model:{...c.model, Name:n}}), get_errors:c=>c.model.Name.length < 3 ? ["The name cannot be shorter than three characters."] : [] }
    ], c => true, c => c.errors.has("Name"), c => true, c => true, c => c, c => ({...c, step:"points"}))({model: c, errors: Immutable.Map<string,Array<string>>()}).map(c => c.model)

let create_course_step2 : ((_:WorkflowData<CreateCourseStep, Models.Course>) => C<WorkflowData<CreateCourseStep, Models.Course>>) = c =>
  Form.simple_form_with_prev_and_next_buttons<WorkflowData<CreateCourseStep, Models.Course>>("edit", c => `course_${c.model.Id}_${c.step}`,
    [
      { kind:"number", field_name:"Points", in:c => c.model.Points || 0, out:c => p => ({...c, model:{...c.model, Points:p}}), get_errors:c=>c.model.Points < 1 ? ["The course must be worth at least one point."] : [] },
    ], c => false, c => c.errors.has("Points"), c => true, c => true, c => ({...c, step:"name"}), c => ({...c, step:"recap"}))({model: c, errors: Immutable.Map<string,Array<string>>()}).map(c => c.model)

let create_course_recap : ((_:WorkflowData<CreateCourseStep, Models.Course>) => C<WorkflowData<CreateCourseStep, Models.Course>>) = c =>
  Form.simple_form_with_prev_and_next_buttons<WorkflowData<CreateCourseStep, Models.Course>>("view", c => `course_${c.model.Id}_${c.step}`,
    [
      { kind:"string", field_name:"Name", in:c => c.model.Name || "", out:c => n => ({...c, model:{...c.model, Name:n}}), get_errors:c=>c.model.Name.length < 3 ? ["The name cannot be shorter than three characters."] : [] },
      { kind:"number", field_name:"Points", in:c => c.model.Points || 0, out:c => p => ({...c, model:{...c.model, Points:p}}), get_errors:c=>c.model.Points < 1 ? ["The course must be worth at least one point."] : [] },
    ], c => false, c => c.errors.has("Points"), c => true, c => true, c => ({...c, step:"points"}), c => ({...c, step:"sent"}))({model: c, errors: Immutable.Map<string,Array<string>>()}).map(c => c.model)

let sent_page : ((_:WorkflowData<CreateCourseStep, Models.Course>) => C<WorkflowData<CreateCourseStep, Models.Course>>) = cd =>
  any<WorkflowData<CreateCourseStep, Models.Course>>([
    cd => string("view")(`Sent ${cd.model.Name}, ${cd.model.Points}`).bind(`sent`, _ => unit<WorkflowData<CreateCourseStep, Models.Course>>(cd).filter(_ => false)),
    cd => button<WorkflowData<CreateCourseStep, Models.Course>>("close")(cd).map(cd => ({...cd, step:"closed"}))
  ])(cd)

export let workflow_sample : C<void> =
  simple_workflow<CreateCourseStep, Models.Course>(`course_workflow`,
    Immutable.Map<CreateCourseStep, (_:WorkflowData<CreateCourseStep, Models.Course>)=>C<WorkflowData<CreateCourseStep, Models.Course>>>([
      ["name", create_course_step1],
      ["points", create_course_step2],
      ["recap", create_course_recap],
      ["sent", sent_page]
    ]),
    { Id:-1, Name:"Name of the course", Points:1,  Logo:"", CreatedDate:Moment(Moment.now()) }, "name").ignore()
