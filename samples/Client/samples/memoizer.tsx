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
                        n => memoizer<string, string>("key1", 50000, () => {console.log(this); return "mem1"})(test_element1("k1"))(n),
                        n => memoizer<string, string>("key2", 50000, () => {console.log(this); return "mem2"})(test_element2("k2"))(n),
                        n => memoizer<string, string>("key3", 50000, () => {console.log(this); return "mem3"})(test_element3("k3"))(n),
                        n => memoizer<string, string>("key4", 50000, () => {console.log(this); return "mem4"})(test_element1("k4"))(n),
                        n => memoizer<string, string>("key5", 50000, () => {console.log(this); return "mem5"})(test_element2("k5"))(n),
                        n => memoizer<string, string>("key6", 50000, () => {console.log(this); return "mem6"})(test_element3("k6"))(n),
                        n => memoizer<string, string>("key7", 50000, () => {console.log(this); return "mem7"})(test_element1("k7"))(n),
                        n => memoizer<string, string>("key8", 50000, () => {console.log(this); return "mem8"})(test_element1("k8"))(n),
                        n => memoizer<string, string>("key9", 50000, () => {console.log(this); return "mem9"})(test_element2("k9"))(n),
                        n => memoizer<string, string>("key10", 50000, () => {console.log(this); return "mem10"})(test_element2("k10"))(n),
                        n => memoizer<string, string>("key11", 50000, () => {console.log(this); return "mem11"})(test_element3("k11"))(n),
                        n => memoizer<string, string>("key12", 50000, () => {console.log(this); return "mem12"})(test_element3("k12"))(n)                     
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