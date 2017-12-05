import * as React from "react"
import * as ReactDOM from "react-dom"
import {List, Map, Set} from "immutable"
import * as Immutable from "immutable"
import {UrlTemplate, application, get_context, Route, Url, make_url, fallback_url, link_to_route,
Option, C, Mode, unit, bind, string, number, bool, button, selector, multi_selector, label, h1, h2, div, form, image, link, file, overlay,
custom, repeat, all, any, lift_promise, retract, delay,
simple_menu, mk_menu_entry, mk_submenu_entry, MenuEntry, MenuEntryValue, MenuEntrySubMenu,
rich_text, paginate, Page, list, editable_list, memoizer} from '../../../src/monadic_react'


// const func = function(): C<number> 
// {
//   return unit<number>(10)
// }


export let memoizer_sample : C<void> =
  repeat<string>(`input number`)(n =>
      label<string, string>("Insert an even number: ", true)(n =>
        string("edit", )(n))(n))("0").then(`input number bind`, n =>
  button<string>(`Send ${n.toString()} further`, false)(n)
  .then("",
  n => any<string,string>()([
  n => memoizer<string, string>(n, test_element(""), 500, "key"),
  n => memoizer<string, string>(n, test_element(""), 500, "key"),
  n => memoizer<string, string>(n, test_element(""), 500, "key"),
  n => memoizer<string, string>(n, test_element(""), 500, "key")
])(n)
)
  .map<string>(n =>
  `Your selection is ${n.toString()}`).then(`button to string`, s =>
  string("view")(s).ignore()))    


export const test_element = function (key?: string, dbg?: () => string): (s:string) => C<string> {
    return (s: string) =>        
            any<string, string>('selector')([
                x => string("view","text","text1")(x),
                x => string("view","text","text2")(x),
                x => string("view","text","text3")(x),
            ])(s)         
}