import * as React from "react"
import * as ReactDOM from "react-dom"
import {List, Map, Set} from "immutable"
import * as Immutable from "immutable"
import * as Moment from "moment"
import * as Models from '../generated_models'
import * as Api from '../generated_api'
import * as ViewUtils from '../generated_views/view_utils'
import {C, unit, bind} from '../react_monad/core'
import {string, number, bool, date, date_time, time} from '../react_monad/primitives'
import {button, selector, multi_selector, label, image} from '../react_monad/html'
import {custom, repeat, any, lift_promise, retract, delay, menu} from '../react_monad/combinators'

export let moments_sample : C<void> =
  repeat<Moment.Moment>(
    any<Moment.Moment>([
      c => repeat<Moment.Moment>(
        label<Moment.Moment, Moment.Moment>("Insert a time: ", true)(time("edit", "time"))
      )(c).bind(`time bind`, c =>
      string("view")(`Your selection is ${c.toString()}`)).map(_ => c).filter(_ => false),

      c => repeat<Moment.Moment>(
        label<Moment.Moment, Moment.Moment>("Insert a date: ", true)(date("edit", "date"))
      )(c).bind(`date bind`, c =>
      string("view")(`Your selection is ${c.toString()}`)).map(_ => c).filter(_ => false),

      c => repeat<Moment.Moment>(
        label<Moment.Moment, Moment.Moment>("Insert a date with time: ", true)(date_time("edit", "date-time"))
      )(c).bind(`date-time bind`, c =>
      string("view")(`Your selection is ${c.toString()}`)).map(_ => c).filter(_ => false)
    ]), `input number`)(Moment(Moment.now())).ignore()
