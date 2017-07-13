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
import {button, selector, multi_selector, label, image, link, file, overlay}from '../react_monad/html'
import {custom, repeat, any, lift_promise, retract, delay, menu} from '../react_monad/combinators'

export let overlay_sample =
  repeat<boolean>(
    visible =>
      any<void, boolean>(
        [
          any<void, boolean>([
            _ => string("view")("The overlay is hidden").never<boolean>(),
            _ => button("Show overlay")(true)
          ]),
          !visible ?
            _ => unit<void>(null).never<boolean>()
          :
            overlay<void, boolean>()([])(
              any<void, boolean>([
                _ => string("view")("This is the overlay").never<boolean>(),
                _ => button("X")(false)
              ])
            )
        ]
      )(null)
  , `overlay sample`)(false).ignore()
