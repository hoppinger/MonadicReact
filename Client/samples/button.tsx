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

type FictionalPage = { title:string, content:string }

export let button_sample : C<void> =
  repeat<number>(n =>
      label<number, number>("number: ")(n =>
        int("edit", "int")(n))(n),
      `input number`)(0).bind(`input number bind`, n =>
  button<number,string>(`Send ${n.toString()} further`)(n => `Your selection is ${n.toString()}`)(n).bind(`button to string`, s =>
  string("view")(s).ignore()))
