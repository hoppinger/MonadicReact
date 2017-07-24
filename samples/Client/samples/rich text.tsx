import * as React from "react"
import * as ReactDOM from "react-dom"
import {List, Map, Set} from "immutable"
import * as Immutable from "immutable"
import {UrlTemplate, application, get_context, Route, Url, make_url, fallback_url, link_to_route,
Option, C, Mode, unit, bind, string, number, bool, button, selector, multi_selector, label, h1, h2, div, form, image, link, file, overlay,
custom, repeat, all, any, lift_promise, retract, delay,
simple_menu, mk_menu_entry, mk_submenu_entry, MenuEntry, MenuEntryValue, MenuEntrySubMenu,
rich_text, paginate, Page, list, editable_list} from '../../../src/monadic_react'

export let rich_text_sample: C<void> =
  repeat<string>()(rich_text("edit"))(null).map(s => s.substr(0, 200)).then(`rich text sample`,
  delay<string>(2000, `rich text delayer`)(
    label<string,string>(`Raw content:`, true)(
      string("view")))).ignore()
