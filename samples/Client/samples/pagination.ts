import * as React from "react"
import * as ReactDOM from "react-dom"
import {List, Map, Set, Range} from "immutable"
import * as Immutable from "immutable"
import * as Moment from 'moment'
import {UrlTemplate, application, get_context, Route, Url, make_url, fallback_url, link_to_route,
Option, C, Mode, unit, bind, string, number, bool, button, selector, multi_selector, label, h1, h2, div, form, image, link, file, overlay,
custom, repeat, all, any, lift_promise, retract, delay,
simple_menu, mk_menu_entry, mk_submenu_entry, MenuEntry, MenuEntryValue, MenuEntrySubMenu,
rich_text, paginate, Page, list, editable_list} from '../../../src/monadic_react'

export let pagination_sample : C<void> =
  div<void,void>(undefined, `pagination sample`)(_ =>
    paginate<number, void>(10, (cp:number, ipp:number) =>
      unit<Page<number>>(({ num_pages:10, page_index:cp, items:cp })), `pagination sample`)(
      n => string("view")(`The current page is ${n+1}`).ignore()
  ))(null)
