import * as React from "react"
import * as ReactDOM from "react-dom"
import {List, Map, Set} from "immutable"
import * as Immutable from "immutable"
import * as Moment from 'moment'
import * as Models from './generated_models'
import * as Api from './generated_api'
import * as ViewUtils from './generated_views/view_utils'
import {C, unit, bind} from './react_monad/core'
import {string, number, bool} from './react_monad/primitives'
import {button, selector, multi_selector, label, h1, h2, div, image} from './react_monad/html'
import {custom, repeat, all, any, lift_promise, retract, delay, menu, hide} from './react_monad/combinators'
import {rich_text} from './react_monad/rich_text'
import {button_sample} from './samples/button'
import {course_form_with_autosave_sample, course_form_sample} from './samples/forms'
import {workflow_sample} from './samples/workflow'
import {label_sample} from './samples/label'
import {selector_sample} from './samples/selector_and_custom_class'
import {multiselector_sample} from './samples/multiselector'
import {menu_sample} from './samples/menu'
import {tabbed_menu_sample} from './samples/tabbed menu'
import {toggles_sample} from './samples/toggles'
import {moments_sample} from './samples/moments'


type Sample = { sample:C<void>, description:string }
type MiniPage = { visible:boolean, page:C<void> }
export let sample_toggleable_minipage : (_:Sample) => C<void> = s =>
  repeat<boolean>(
    div<boolean, boolean>("monadic-title-preview")([])(
    label<boolean, boolean>(s.description, false)(bool("edit", "plus/minus"))))(false).bind(`${s.description} toggle`, visible =>
    !visible ?
      unit<void>(null)
    :
      s.sample.bind(`visible ${s.description}`, _ => unit<void>(null)))

export let sample_minipage : (_:Sample) => C<void> = s =>
  h2<void, void>(s.description, "", s.description)(_ =>
    s.sample)(null)


let rich_text_sample: C<void> =
  rich_text(null, "edit").bind(`rich text sample`, s =>
  label<string,string>(`Raw content:`, true)(string("view"))(s).ignore())

export function HomePage(props:ViewUtils.EntityComponentProps<Models.HomePage>) : JSX.Element {
  let all_samples : Array<Sample> =
    [
      { sample: label_sample, description:"label" },
      { sample: button_sample, description:"button" },
      { sample: rich_text_sample, description:"rich text" },
      { sample: selector_sample, description:"selector" },
      { sample: multiselector_sample, description:"multi-selector" },
      { sample: moments_sample, description:"dates and times" },
      { sample: course_form_sample, description:"form with save button" },
      { sample: course_form_with_autosave_sample, description:"form with autosave" },
      { sample: workflow_sample, description:"workflow" },
      { sample: toggles_sample, description:"coordinated toggles" },
      { sample: menu_sample, description:"nested menu" },
      { sample: tabbed_menu_sample, description:"tabbed menu" }
    ]

  return <div>
      {
        <div className="component">
          {
            menu<Sample, void>("side menu", s => s.description)(List(all_samples), sample_minipage).comp(
                { mode:"edit", set_mode:((nm, c) => {}), logic_frame:0, force_reload:(c) => {}
              })(continuation => value => console.log("done"))

          }
        </div>
      }
  </div>
}
