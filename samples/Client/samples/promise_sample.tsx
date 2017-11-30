import * as React from "react"
import * as ReactDOM from "react-dom"
import {List, Map, Set} from "immutable"
import * as Immutable from "immutable"
import {UrlTemplate, application, get_context, Route, Url, make_url, fallback_url, link_to_route,
Option, C, Mode, unit, bind, string, number, bool, button, selector, multi_selector, label, h1, h2, div, form, image, link, file, overlay,
custom, repeat, all, any, lift_promise, retract, delay,
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
    (n:number) => lift_promise<Request, Response> (getResponse, "never")({nReq:n}).then("response_offer", (r: Response) => {
        console.log("then in response")
        return unit (n);
    })
  )
    .map<string>(n => `Your selection is ${n.toString()}`)
    .then(`button to string`, s => string("view")(s).ignore())
);

const getResponse = (request: Request): Promise<Response> =>{
  console.log("getResponse")
  return new Promise<Response>((resolve, reject) => {
    
    /*request({})
      .then(response => {
        return resolve({ response: "OK" });
      })
      .catch(_ => {
        resolve({ response: "ERROR" });
      });*/

      setTimeout(function() {
        console.log('EanSearchRequest');
        //resolve();    
        reject();
      }, 2500);
  });}
  