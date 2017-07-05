import * as React from "react"
import * as ReactDOM from "react-dom"
import {List, Map, Set} from "immutable"
import * as Immutable from "immutable"
import * as Models from '../generated_models'
import * as Api from '../generated_api'
import * as ViewUtils from '../generated_views/view_utils'
import {C, unit, bind} from '../react_monad/core'
import {string, number, bool} from '../react_monad/primitives'
import {button, selector, multi_selector, label, image} from '../react_monad/html'
import {custom, repeat, any, lift_promise, retract, delay, menu} from '../react_monad/combinators'

export let label_sample : C<void> =
  repeat<number>(n =>
      label<number, number>("Insert a number: ", true)(n =>
        number("edit", "number")(n))(n),
      `input number`)(0).bind(`input number bind`, c =>
  string("view")(`Your selection is ${c.toString()}`).ignore())
