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
import {button, selector, multi_selector, label, image, link, file}from '../react_monad/html'
import {custom, repeat, any, lift_promise, retract, delay, menu} from '../react_monad/combinators'

export let link_sample : C<void> =
  any<void, void>([
    _ => link(`Google`, "https://www.google.com"),
    _ => link(`Facebook`, "https://www.facebook.com"),
    _ => link(`Hoppinger`, "https://www.hoppinger.com")
  ], `link sample`)(null)
