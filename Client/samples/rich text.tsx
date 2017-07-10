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
import {custom, repeat, any, lift_promise, retract, delay, menu, hide} from '../react_monad/combinators'
import {rich_text} from '../react_monad/rich_text'

export let rich_text_sample: C<void> =
  rich_text(null, "edit").bind(`rich text sample`, s =>
  label<string,string>(`Raw content:`, true)(string("view"))(s).ignore())
