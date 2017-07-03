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

export let multiselector_sample : C<void> =
  multi_selector<number>("checkbox",
    x => x.toString())(List<number>([1, 3, 5]), List<number>([1, 5])).bind(`multi_selector`, n =>
  string("view")(JSON.stringify(n.toArray())).ignore())