import * as React from "react"
import * as ReactDOM from "react-dom"
import {List, Map, Set} from "immutable"
import * as Immutable from "immutable"
import {UrlTemplate, application, get_context, Route, Url, make_url, fallback_url, link_to_route,
Option, C, Mode, unit, bind, string, number, bool, button, selector, multi_selector, label, h1, h2, div, form, image, link, file, overlay,
custom, repeat, all, any, lift_promise, retract, delay,
simple_menu, mk_menu_entry, mk_submenu_entry, MenuEntry, MenuEntryValue, MenuEntrySubMenu,
rich_text, paginate, Page, list, editable_list} from '../../../dist/monadic_react'

type FictionalPage = { title:string, content:string }

export let menu_sample : C<void> =
  simple_menu<FictionalPage, string>("side menu", p => p.title, `fictional pages menu`)(
    List<MenuEntry<FictionalPage>>([
      { title:"About", content:"This page talks about us"},
      { title:"Content", content:"This page is full of interesting content"}
    ].map<MenuEntry<FictionalPage>>(s => ({ kind:"item", value:s}))),
    p => string("view")(p.content)
  ).ignore()
