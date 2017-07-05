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

type FictionalPage = { title:string, content:string }

export let menu_sample : C<void> =
  menu<FictionalPage, string>("side menu", p => p.title, `fictional pages menu`)(
    List<FictionalPage>([
      { title:"About", content:"This page talks about us"},
      { title:"Content", content:"This page is full of interesting content"}
    ]), p => string("view")(p.content)
  ).ignore()
