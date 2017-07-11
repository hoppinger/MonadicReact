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
import {editable_list} from '../react_monad/editable_list'

export let editable_list_sample : C<void> =
  editable_list<number>(`editable-number-list`, unit(Range(1,5).toList()),
    s => button<number>(`+`)(s.items.max() + 1)).bind(`editable number list container`, s =>
    string("view")(`The selected item is ${s.items.get(s.selected_index)}`).ignore())


