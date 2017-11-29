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

type Strings = {
  string_array: string[]
}

const default_state: Strings = { string_array :["a","b"] }

let set_value_in_array = function <A>(a: A[], i: number, v: A): A[] {
  let b = a.slice(0);
  b[i] = v;
  return b;
}

let dynamic_array = function (key?: string, dbg?: () => string): (_: Strings) => C<Strings> {
    return (s) =>
        any<Strings, Strings>(key, undefined, dbg)(s.string_array.map(
            (c: string, index: number) =>
                retract<Strings, string>(index.toString())(
                    s => s[index],
                    s => nv => ({...s, string_array:set_value_in_array(s.string_array, index, nv) }),
                    nv => string("edit")(nv)
                )
        ))(s)
}

export let dynamic_array_sample : C<void> =
repeat<Strings>()(dynamic_array("edit"))(default_state).map(s => s.string_array.toString() ).then(`rich text sample`,
    label<string,string>(`Raw content:`, true)(
      string("view", "text", "view"))).ignore()