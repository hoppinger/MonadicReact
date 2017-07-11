import * as React from "react"
import * as ReactDOM from "react-dom"
import {List, Map, Set, Range} from "immutable"
import * as Immutable from "immutable"
import * as Moment from 'moment'
import {C, unit, bind} from '../react_monad/core'
import {string, number, bool} from '../react_monad/primitives'
import {button, selector, multi_selector, label, h1, h2, div, image} from '../react_monad/html'
import {custom, repeat, all, any, lift_promise, retract, delay, menu, hide} from '../react_monad/combinators'
import {rich_text} from '../react_monad/rich_text'
import {paginate, Page} from '../react_monad/paginator'
import {list} from '../react_monad/list'

export let pagination_sample : C<void> =
  paginate<number, void>(10, (cp:number, ipp:number) =>
    unit<Page<number>>(({ num_pages:10, page_index:cp, items:cp })), `pagination sample`)(
    n => string("view")(`The current page is ${n+1}`).ignore()
  )
