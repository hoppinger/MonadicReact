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
                        n => memoizer<string, string>(n, test_element1("k1"), 500, "key1", () => {console.log(this); return "mem1"}),
                        n => memoizer<string, string>(n, test_element1("k2"), 500, "key2", () => {console.log(this); return "mem2"}),
                        n => memoizer<string, string>(n, test_element2("k3"), 500, "key3", () => {console.log(this); return "mem3"}),
                        n => memoizer<string, string>(n, test_element2("k4"), 500, "key4", () => {console.log(this); return "mem4"}),
                        n => memoizer<string, string>(n, test_element3("k5"), 500, "key5", () => {console.log(this); return "mem5"}),
                        n => memoizer<string, string>(n, test_element1("k6"), 500, "key6", () => {console.log(this); return "mem6"}),
                        n => memoizer<string, string>(n, test_element3("k7"), 500, "key7", () => {console.log(this); return "mem7"}),
                        n => memoizer<string, string>(n, test_element2("k8"), 500, "key8", () => {console.log(this); return "mem8"}),
                        n => memoizer<string, string>(n, test_element1("k9"), 500, "key9", () => {console.log(this); return "mem9"}),
                        n => memoizer<string, string>(n, test_element3("k10"), 500, "key10", () => {console.log(this); return "mem10"}),
                        n => memoizer<string, string>(n, test_element2("k11"), 500, "key11", () => {console.log(this); return "mem11"}),
                        n => memoizer<string, string>(n, test_element2("k12"), 500, "key12", () => {console.log(this); return "mem12"})
                    ])(n)
                    )
                    .map<string>(n =>
                        `Your selection is ${n}`).then(`button to string`, s =>
                            string("view")(s).ignore()))


export const test_element1 = function (key?: string, dbg?: () => string): (s: string) => C<string> {
    return (s: string) =>
        any<string, string>('selector_test1')([
            x => string("view", "text", "text1_1")(x),
            x => string("view", "text", "text1_2")(x),
            x => string("view", "text", "text1_3")(x),
        ])(s)
}

export const test_element2 = function (key?: string, dbg?: () => string): (s: string) => C<string> {
    return (s: string) =>
        any<string, string>('selector_test2')([
            x => string("view", "text", "text2_1")(x),
            x => string("view", "text", "text2_2")(x),
            x => string("view", "text", "text2_3")(x),
            x => string("view", "text", "text2_4")(x),
        ])(s)
}

export const test_element3 = function (key?: string, dbg?: () => string): (s: string) => C<string> {
    return (s: string) =>
        any<string, string>('selector_test3')([
            x => string("view", "text", "text3_1")(x),
            x => string("view", "text", "text3_2")(x),
            x => string("view", "text", "text3_3")(x),
            x => string("view", "text", "text3_4")(x),
            x => string("view", "text", "text3_5")(x),
        ])(s)
}