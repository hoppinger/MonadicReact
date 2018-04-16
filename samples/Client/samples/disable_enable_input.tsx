import * as React from "react"
import * as ReactDOM from "react-dom"
import {List, Map, Set} from "immutable"
import * as Immutable from "immutable"
import {UrlTemplate, application, get_context, Route, Url, make_url, fallback_url, link_to_route,
Option, C, Mode, unit, bind, string, number, bool, button, selector, multi_selector, label, h1, h2, div, form, image, link, file, overlay,
custom, repeat, all, any, lift_promise, retract, delay,
simple_menu, mk_menu_entry, mk_submenu_entry, MenuEntry, MenuEntryValue, MenuEntrySubMenu,
rich_text, paginate, Page, list, editable_list} from '../../../src/monadic_react'

type EnableDisable = {
  disabled: boolean,
  value: string
}

export let disablable_sample : C<void> =
  repeat<EnableDisable>()(any<EnableDisable,EnableDisable>()([
    s => string('edit','text','inputstring',undefined,{ disabled: s.disabled })(s.value).then<EnableDisable>('pass_string' ,us => unit<EnableDisable>({...s, value: us }) ),
    s => button<EnableDisable>(s.disabled ? "Enable" : "Disable",false,'enabling_button')({...s,disabled: !s.disabled})
  ]))({disabled: false, value: ""}).never()