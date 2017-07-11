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

export let toggles_sample : C<void> =
  repeat<boolean>(b =>
    any<boolean, boolean>([
      label<boolean, boolean>("my toggle.")(b =>
        bool("edit", "checkbox", `basic toggle`)(b)),
      label<boolean, boolean>("my fancy toggle.")(b =>
        bool("edit", "fancy toggle", `fancy toggle`)(b)),
      label<boolean, boolean>("The last toggle: ")(b =>
        bool("edit", "plus/minus", `a plus/minus toggle.`)(b)),
    ], `toggles`)(b))(true).bind(`fancy_toggle_bind`, c =>
  string("view")(`Your selection is ${c.toString()}`).ignore())
