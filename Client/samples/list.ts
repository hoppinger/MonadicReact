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

export let list_sample : C<void> =
  list<number, void>(Range(1,10).toList(), `list sample`)(
    i => n => string("view")(`This is item ${n}`).ignore()
  )
