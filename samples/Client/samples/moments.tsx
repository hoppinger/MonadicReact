import * as React from "react"
import * as ReactDOM from "react-dom"
import {List, Map, Set} from "immutable"
import * as Immutable from "immutable"
import * as Moment from "moment"
import {UrlTemplate, application, get_context, Route, Url, make_url, fallback_url, link_to_route,
Option, C, Mode, unit, bind, string, number, bool, button, time, date, date_time, selector, multi_selector, label, h1, h2, div, form, image, link, file, overlay,
custom, repeat, all, any, lift_promise, retract, delay,
simple_menu, mk_menu_entry, mk_submenu_entry, MenuEntry, MenuEntryValue, MenuEntrySubMenu,
rich_text, paginate, Page, list, editable_list} from '../../../src/monadic_react'

export let moments_sample : C<void> =
  repeat<Moment.Moment>()(
    any<Moment.Moment, Moment.Moment>(`input number`)([
      c => repeat<Moment.Moment>()(
        label<Moment.Moment, Moment.Moment>("Insert a time: ", true)(time("edit", "time"))
      )(c).bind(`time bind`, c =>
      string("view")(`Your selection is ${c.toString()}`)).map(_ => c).filter(_ => false),

      c => repeat<Moment.Moment>()(
        label<Moment.Moment, Moment.Moment>("Insert a date: ", true)(date("edit", "date"))
      )(c).bind(`date bind`, c =>
      string("view")(`Your selection is ${c.toString()}`)).map(_ => c).filter(_ => false),

      c => repeat<Moment.Moment>()(
        label<Moment.Moment, Moment.Moment>("Insert a date with time: ", true)(date_time("edit", "date-time"))
      )(c).bind(`date-time bind`, c =>
      string("view")(`Your selection is ${c.toString()}`)).map(_ => c).filter(_ => false)
    ]))(Moment(Moment.now())).ignore()
