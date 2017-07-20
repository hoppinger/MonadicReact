import * as React from "react"
import * as ReactDOM from "react-dom"
import {List, Map, Set, Range} from "immutable"
import * as Immutable from "immutable"
import * as Moment from 'moment'
import * as i18next from 'i18next'

import {UrlTemplate, application, get_context, Route, Url, make_url, fallback_url, link_to_route,
Option, C, Mode, unit, bind, string, number, bool, button, selector, multi_selector, label, h1, h2, div, form, image, link, file, overlay,
custom, repeat, all, any, lift_promise, retract, delay,
simple_menu, mk_menu_entry, mk_submenu_entry, MenuEntry, MenuEntryValue, MenuEntrySubMenu,
rich_text, paginate, Page, list, editable_list} from '../../src/monadic_react'

import {button_sample} from './samples/button'
import {label_sample} from './samples/label'
import {selector_sample} from './samples/selector_and_custom_class'
import {multiselector_sample} from './samples/multiselector'
import {menu_sample} from './samples/menu'
import {tabbed_menu_sample} from './samples/tabbed menu'
import {toggles_sample} from './samples/toggles'
import {moments_sample} from './samples/moments'
import {rich_text_sample} from './samples/rich text'
import {pagination_sample} from './samples/pagination'
import {list_sample} from './samples/list'
import {editable_list_sample} from './samples/editable_list'
import {link_sample} from './samples/link'
import {overlay_sample} from './samples/overlay'
import {context_sample} from './samples/context'
import {course_form_with_autosave_sample} from './samples/form'

type Sample = { sample:C<void>, description:string }
type MiniPage = { visible:boolean, page:C<void> }
export let sample_toggleable_minipage : (_:Sample) => C<void> = s =>
  repeat<boolean>()(
    div<boolean, boolean>("monadic-title-preview")(
    label<boolean, boolean>(s.description, false)(bool("edit", "plus/minus"))))(false).then(`${s.description} toggle`, visible =>
    !visible ?
      unit<void>(null)
    :
      s.sample.then(`visible ${s.description}`, _ => unit<void>(null)))

let sample_minipage : (e:MenuEntrySubMenu<Sample>) => ((_:Sample) => C<void>) = e => s =>
  get_context().then(s.description, c =>
  c.set_url({}, make_url<{}, never>([e.label.replace(/\s/g, "_"), s.description.replace(/\s/g, "_")])).then(`${s.description}_set_url`, _ =>
  h2<void, void>(s.description, "", s.description)(_ => s.sample)(null)))

export function HomePage(slug:string) : JSX.Element {
  let all_samples : Array<MenuEntrySubMenu<Sample>> =
    [
      mk_submenu_entry("controls", [
        mk_menu_entry({ sample: link_sample, description:"links" }),
        mk_menu_entry({ sample: label_sample, description:"label" }),
        mk_menu_entry({ sample: button_sample, description:"button" }),
        mk_menu_entry({ sample: rich_text_sample, description:"rich text" }),
      ]),
      mk_submenu_entry("dataflows", [
        mk_menu_entry({ sample: selector_sample, description:"selector" }),
        mk_menu_entry({ sample: multiselector_sample, description:"multi-selector" }),
        mk_menu_entry({ sample: moments_sample, description:"dates and times" }),
        mk_menu_entry({ sample: toggles_sample, description:"coordinated toggles" }),
      ]),
      mk_submenu_entry("forms", [
        mk_menu_entry({ sample: course_form_with_autosave_sample, description:"simple form" })
      ]),
      mk_submenu_entry("lists", [
        mk_menu_entry({ sample: list_sample, description:"list" }),
        mk_menu_entry({ sample: pagination_sample, description:"pagination" }),
        mk_menu_entry({ sample: editable_list_sample, description:"editable list" }),
      ]),
      mk_submenu_entry("menus", [
        mk_menu_entry({ sample: menu_sample, description:"nested menu" }),
        mk_menu_entry({ sample: tabbed_menu_sample, description:"tabbed menu" })
      ]),
      mk_submenu_entry("other", [
        mk_menu_entry({ sample: context_sample, description:"context management" }),
        mk_menu_entry({ sample: overlay_sample, description:"overlay" }),
      ]),
      // mk_submenu_entry("controls", [
      //   mk_menu_entry({ sample: link_sample, description:"links" }),
      //   mk_menu_entry({ sample: label_sample, description:"label" }),
      //   mk_menu_entry({ sample: button_sample, description:"button" }),
      //   mk_menu_entry({ sample: rich_text_sample, description:"rich text" }),
      // ])
    ]

  let xxx = () : Route<{}> => ({
    url: make_url<{}, never>(["xxx"]),
    page:_ =>
      any<void, void>(`xxx`)([
      _ => string("view")("xxx").never<void>(),
      _ => link_to_route<{}>("YYY", {}, yyy())
    ])(null) })

  let yyy = () : Route<{}> => ({
    url: make_url<{}, never>(["yyy"]),
    page: _ => string("view")("yyy").ignore()
  })

  type X = { x:number, y:number }
  let zzz = () : Route<X> => ({
    url: make_url<X, "x" | "y">(["zzz", { kind:"int", name:"x" }, { kind:"int", name:"y" }]),
    page: (x:X) => string("view")(`zzz ${(x.x + x.y).toString()}`).ignore()
  })

  let zzz_xxx = () : Route<X> => ({
    url: make_url<X, "x">(["zzz", { kind:"int", name:"x" }, "xxx"]),
    page: (x:X) => string("view")(`zzz ${x.x} xxx`).ignore()
  })

  let menu_page = () : Route<{}> => ({
    url: fallback_url(),
    page:
        (_:{}) => simple_menu<Sample, void>("side menu", s => s.description)(all_samples,
          s => {
            let e = all_samples.find(e => e.children.findIndex(s1 => s1.value == s) != -1)
            return sample_minipage(e)(s)
          })
  })

  let sample_route : (e:MenuEntrySubMenu<Sample>, _:Sample) => Route<{}> = (e,s) => ({
    url: make_url<{}, never>([e.label.replace(/\s/g, "_"), s.description.replace(/\s/g, "_")]),
    page:(_:{}) => simple_menu<Sample, void>("side menu", s => s.description)(all_samples, sample_minipage(e), s, e.label)
  })

  let submenu_route : (e:MenuEntrySubMenu<Sample>) => Route<{}> = (e) => ({
    url: make_url<{}, never>([e.label.replace(/\s/g, "_")]),
    page:(_:{}) => simple_menu<Sample, void>("side menu", s => s.description)(all_samples, sample_minipage(e), undefined, e.label)
  })

  let all_menu_routes = Array<Route<{}>>()
    .concat(...all_samples.map(s => s.children.map(c => sample_route(s, c.value))))
    .concat(all_samples.map(s => submenu_route(s)))

  return <div>
      {
        <div className="component">
          {
            application("edit", window.location.href.replace(slug, ""), slug,
              all_menu_routes.concat(
              [
                xxx(),
                yyy(),
                zzz(),
                zzz_xxx(),
                menu_page()
              ]))
          }
        </div>
      }
  </div>
}

export let HomePage_to = (slug:string, target_element_id:string, ) => {
  (async() => {
    let res = await fetch(`/translations.json`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
    let resources = await res.json()
    i18next.init({
      lng:  "nl",
      fallbackLng: "en",
      ns: ["common","HomePage","Course","Lecture"],
      resources: resources
    }, (err, t) => {
      ReactDOM.render(
        HomePage(slug),
        document.getElementById(target_element_id)
      )
    })
  })()
}
