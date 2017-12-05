import * as React from "react"
import * as ReactDOM from "react-dom"
import { List, Map, Set } from "immutable"
import * as Immutable from "immutable"
import {
    UrlTemplate, application, get_context, Route, Url, make_url, fallback_url, link_to_route,
    Option, C, Mode, unit, bind, string, number, bool, button, selector, multi_selector, label, h1, h2, div, form, image, link, file, overlay,
    custom, repeat, all, any, lift_promise, retract, delay,
    simple_menu, mk_menu_entry, mk_submenu_entry, MenuEntry, MenuEntryValue, MenuEntrySubMenu,
    rich_text, paginate, Page, list, editable_list, memoizer
} from '../../../src/monadic_react'

export let memoizer_sample: C<void> =
    repeat<string>(`input string`)(n =>
        label<string, string>("Insert an even number: ", true, "", "label1")(n =>
            string("edit", "text", "edit_key")(n))(n))("").then('input number bind', n =>
                button<string>(`Send ${n} further`, false, "button_key")(n)
                    .then("then_memoize_key",
                    n => any<string, string>("any_key3")([
                        n => memoizer<string, string>(n, test_element("k1"), 500, "key1", () => {console.log(this); return "mem1"}),
                        n => memoizer<string, string>(n, test_element("k2"), 500, "key2", () => {console.log(this); return "mem2"}),
                        n => memoizer<string, string>(n, test_element("k3"), 500, "key3", () => {console.log(this); return "mem3"}),
                        n => memoizer<string, string>(n, test_element("k4"), 500, "key4", () => {console.log(this); return "mem4"})
                    ])(n)
                    )
                    .map<string>(n =>
                        `Your selection is ${n}`).then(`button to string`, s =>
                            string("view")(s).ignore()))


export const test_element = function (key?: string, dbg?: () => string): (s: string) => C<string> {
    return (s: string) =>
        any<string, string>('selector')([
            x => string("view", "text", "text1")(x),
            x => string("view", "text", "text2")(x),
            x => string("view", "text", "text3")(x),
        ])(s)
}