import * as React from "react"
import * as ReactDOM from "react-dom"
import {List, Map, Set} from "immutable"
import * as Immutable from "immutable"
import {UrlTemplate, application, get_context, Route, Url, make_url, fallback_url, link_to_route,
Option, C, Mode, unit, bind, string, number, bool, button, selector, multi_selector, label, h1, h2, div, form, image, link, file, overlay,
custom, repeat, all, any, lift_promise, retract, delay,
simple_menu, mk_menu_entry, mk_submenu_entry, MenuEntry, MenuEntryValue, MenuEntrySubMenu,
rich_text, paginate, Page, list, editable_list, memoizer} from '../../../src/monadic_react'


const func = function(a: any): C<number> 
{
  return unit<number>(a*a)
}


export let memoizer_sample : C<void> =
  repeat<number>(`input number`)(n =>
      label<number, number>("Insert an even number: ", true)(n =>
        number("edit", "number")(n))(n))(0).then(`input number bind`, n =>
  button<number>(`Send ${n.toString()} further`, false)(n)
  .then("",memoizer<number, number>(func))
  .map<string>(n =>
  `Your selection is ${n.toString()}`).then(`button to string`, s =>
  string("view")(s).ignore()))