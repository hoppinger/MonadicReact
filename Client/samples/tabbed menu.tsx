import * as React from "react"
import * as ReactDOM from "react-dom"
import {List, Map, Set, Range} from "immutable"
import * as Immutable from "immutable"
import * as Models from '../generated_models'
import * as Api from '../generated_api'
import * as ViewUtils from '../generated_views/view_utils'
import {C, unit, bind} from '../react_monad/core'
import {string, number, bool} from '../react_monad/primitives'
import {button, selector, multi_selector, label, image} from '../react_monad/html'
import {custom, repeat, any, lift_promise, retract, delay, menu} from '../react_monad/combinators'

type FictionalPage = { title:string, content:string }

export let tabbed_menu_sample : C<void> =
  menu<FictionalPage, string>({kind:"tabs",max_tabs:5}, p => p.title, `tabbed menu`)(
    List<FictionalPage>(Range(1, 10).map(i =>
      ({ title:`Tab ${i}`, content:`This is the content of the tab ${i}.`})
    ).toArray()), p => string("view")(p.content)
  ).ignore()
