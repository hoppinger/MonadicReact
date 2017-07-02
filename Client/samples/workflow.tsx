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

type CreateCourseFormData = Models.Course & { step:"name" | "points" | "recap" | "sent" }

let create_course_step1 : ((_:CreateCourseFormData) => C<CreateCourseFormData>) = cd =>
  repeat<CreateCourseFormData>(cd =>
    retract<CreateCourseFormData, string>(cd => cd.Name, cd => n => ({...cd, Name:n}),
      label<string, string>("Name: ")(string("edit")))(cd))(cd).bind(`step1 next`,
  cd => button<CreateCourseFormData>(`next`)({...cd, step:"points"}))

let create_course_step2 : ((_:CreateCourseFormData) => C<CreateCourseFormData>) = cd =>
  repeat<CreateCourseFormData>(cd =>
    retract<CreateCourseFormData, number>(cd => cd.Points, cd => n => ({...cd, Points:n}),
      label<number, number>("Points: ")(int("edit")))(cd))(cd).bind(`step2 next`, cd =>
    any<CreateCourseFormData>([
      cd => button<CreateCourseFormData>(`prev`)({...cd, step:"name"}),
      cd => button<CreateCourseFormData>(`next`)({...cd, step:"recap"})
    ])(cd))

let create_course_recap : ((_:CreateCourseFormData) => C<CreateCourseFormData>) = cd =>
  any<CreateCourseFormData>([
    label<CreateCourseFormData, CreateCourseFormData>("Name: ")(_ => string("view")(cd.Name).bind(`name recap`, _ => unit<CreateCourseFormData>(cd))),
    label<CreateCourseFormData, CreateCourseFormData>("Points: ")(_ => int("view")(cd.Points).bind(`points recap`, _ => unit<CreateCourseFormData>(cd))),
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
    )({ Id:-1, Name:"", Points:0,  step:"name", Logo:"", CreatedDate:Moment(Moment.now()) }).ignore()