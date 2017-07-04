import * as React from "react"
import * as ReactDOM from "react-dom"
import {List, Map, Set} from "immutable"
import * as Immutable from "immutable"
import * as Moment from 'moment'
import * as Models from '../generated_models'
import * as Api from '../generated_api'
import * as ViewUtils from '../generated_views/view_utils'
import {C, unit, bind} from '../react_monad/core'
import {string, int, bool} from '../react_monad/primitives'
import {button, selector, multi_selector, label, image} from '../react_monad/html'
import {custom, repeat, any, lift_promise, retract, delay, menu} from '../react_monad/combinators'
import * as Form from '../react_monad/forms'

type CreateCourseFormData = Models.Course & { step:"name" | "points" | "recap" | "sent" }

let create_course_step1 : ((_:CreateCourseFormData) => C<CreateCourseFormData>) = c =>
  Form.simple_form_with_prev_and_next_buttons<CreateCourseFormData>(c => `course_${c.Id}`,
    [
      { kind:"string", field_name:"Name", in:c => c.Name || "", out:c => n => ({...c, Name:n}), get_errors:c=>c.Name.length < 3 ? ["The name cannot be shorter than three characters."] : [] }
    ], c => true, c => c.errors.has("Name"), c => c, c => ({...c, step:"points"}))({model: c, errors: Immutable.Map<string,Array<string>>()}).map(c => c.model)

let create_course_step2 : ((_:CreateCourseFormData) => C<CreateCourseFormData>) = c =>
  Form.simple_form_with_prev_and_next_buttons<CreateCourseFormData>(c => `course_${c.Id}`,
    [
      { kind:"number", field_name:"Points", in:c => c.Points || 0, out:c => p => ({...c, Points:p}), get_errors:c=>c.Points < 1 ? ["The course must be worth at least one point."] : [] },
    ], c => false, c => c.errors.has("Points"), c => ({...c, step:"name"}), c => ({...c, step:"recap"}))({model: c, errors: Immutable.Map<string,Array<string>>()}).map(c => c.model)

let create_course_recap : ((_:CreateCourseFormData) => C<CreateCourseFormData>) = cd =>
  any<CreateCourseFormData>([
    label<CreateCourseFormData, CreateCourseFormData>("Name: ", true)(_ => string("view")(cd.Name).bind(`name recap`, _ => unit<CreateCourseFormData>(cd))),
    label<CreateCourseFormData, CreateCourseFormData>("Points: ", true)(_ => int("view")(cd.Points).bind(`points recap`, _ => unit<CreateCourseFormData>(cd))),
    cd => button<CreateCourseFormData>(`prev`)({...cd, step:"points"}),
    cd => button<CreateCourseFormData>(`next`)({...cd, step:"sent"})
  ])(cd)

export let workflow_sample : C<void> =
  repeat<CreateCourseFormData>(cd =>
    cd.step == "name" ?
      create_course_step1(cd)
    : cd.step == "points" ?
      create_course_step2(cd)
    : cd.step == "recap" ?
      create_course_recap(cd)
    : string("view")(`Sent ${cd.Name}, ${cd.Points}`).bind(`sent`, _ => unit<CreateCourseFormData>(cd))
    )({ Id:-1, Name:"Name of the course", Points:1,  step:"name", Logo:"", CreatedDate:Moment(Moment.now()) }).ignore()