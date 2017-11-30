import * as React from "react"
import * as ReactDOM from "react-dom"
import {List, Map, Set} from "immutable"
import * as Immutable from "immutable"
import {UrlTemplate, application, get_context, Route, Url, make_url, fallback_url, link_to_route,
Option, C, Mode, unit, bind, string, number, bool, button, selector, multi_selector, label, h1, h2, div, form, image, link, file, overlay,
custom, repeat, all, any, lift_promise_new, retract, delay,
simple_menu, mk_menu_entry, mk_submenu_entry, MenuEntry, MenuEntryValue, MenuEntrySubMenu,
rich_text, paginate, Page, list, editable_list} from '../../../src/monadic_react'

type Request = { nReq:number }
type Response = { response: string }

export let promise_sample: C<void> = repeat<number>(`input number`)(n =>
  label<number, number>("Insert an even number: ", true)(n =>
    number("edit", "number")(n)
  )(n)
)(0).then(`input number bind`, n =>
  button<number>(`Send ${n.toString()} further`, false, "button_key")(n).then("key",
    (n:number) => lift_promise_new<number, number> (getResponse, "retry then show failure",3,unit(99999999),"new promise", () => {return this})(n)
    .then("response_offer", (r: number) => {
        console.log("then in response")
        return unit ((n+5)*5);
    })
  )
    .map<string>(n => `Your selection is ${n.toString()}`)
    .then(`button to string`, s => string("view")(s).ignore())
);

const getResponse = (request: number): Promise<number> =>{
  console.log("getResponse")
  return new Promise<number>((resolve, reject) => {
       setTimeout(function() {
        console.log('Request');
        //resolve();    
        reject();
      }, 1000);
  });}
  