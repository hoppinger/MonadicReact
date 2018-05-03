import * as React from "react"
import * as ReactDOM from "react-dom"
import {List, Map, Set} from "immutable"
import * as Immutable from "immutable"
import * as Moment from 'moment'
import {UrlTemplate, application, get_context, Route, Url, make_url, fallback_url, link_to_route,
Option, C, Mode, unit, bind, string, number, bool, button, selector, multi_selector, label, h1, h2, div, form, image, link, file, overlay,
custom, repeat, all, any, lift_promise, retract, delay, waiting,
simple_menu, mk_menu_entry, mk_submenu_entry, MenuEntry, MenuEntryValue, MenuEntrySubMenu,
rich_text, paginate, Page, list, editable_list} from '../../../src/monadic_react'


let delay_example: C<void> = 
  repeat<string>('repeat_delay')(
    string('edit','text')
  )("")
  .then<string>('pass-delayed',delay<string>(5000)(
    label<string,string>("This is the last thing you have chosen: ",true,'final delay choice')(string('view','text','delayed-string'))
    //s => button<string>(s,false)(s)
    )
  ).never<void>('lose_delay')

let wait_example: C<void> =
  any<string,string>('any_waiting')(
    ["A","B","C","D"].map( (s) =>
      _ => button<string>(s,false,s)(s)
    )
  )("")
  .then<string>('pass-waited',waiting<string>(5000)(
    label<string,string>("This is the last thing you have chosen: ",true,'final delay choice')(string('view','text','waited-string'))
    //s => button<string>(s,false)(s)
    )
  ).never<void>('lose_wait')

export let delay_wait = any<void,void>()([
  label<void,void>('Delay:',true,'delay')(_ => delay_example),
  label<void,void>('Wait:',true,'wait')(_ => wait_example)
])(null)