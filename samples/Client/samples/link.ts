import * as React from "react"
import * as ReactDOM from "react-dom"
import {List, Map, Set} from "immutable"
import * as Immutable from "immutable"
import * as Moment from 'moment'
import {UrlTemplate, application, get_context, Route, Url, make_url, fallback_url, link_to_route,
Option, C, Mode, unit, bind, string, number, bool, button, selector, multi_selector, label, h1, h2, div, form, image, link, file, overlay,
custom, repeat, all, any, lift_promise, retract, delay,
simple_menu, mk_menu_entry, mk_submenu_entry, MenuEntry, MenuEntryValue, MenuEntrySubMenu,
rich_text, paginate, Page, list, editable_list} from '../../../src/monadic_react'

export let link_sample : C<void> =
  any<void, void>(`link sample`)([
    _ => link(`Google`, "https://www.google.com", false, "google"),
    _ => link(`Facebook`, "https://www.facebook.com", false, "facebook"),
    _ => link(`Hoppinger`, "https://www.hoppinger.com", false, "hoppinger")
  ])(null)
