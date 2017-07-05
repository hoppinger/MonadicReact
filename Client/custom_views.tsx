import * as React from "react"
import * as ReactDOM from "react-dom"
import {List, Map, Set} from "immutable"
import * as Immutable from "immutable"
import * as Moment from 'moment'
import * as Models from './generated_models'
import * as Api from './generated_api'
import * as ViewUtils from './generated_views/view_utils'
import {C} from './react_monad/core'
import {hide} from './react_monad/combinators'
import {button_sample} from './samples/button'
import {course_form_with_autosave_sample, course_form_sample} from './samples/course forms'
import {workflow_sample} from './samples/workflow'
import {label_sample} from './samples/label'
import {selector_sample} from './samples/selector_and_custom_class'
import {multiselector_sample} from './samples/multiselector'
import {menu_sample} from './samples/menu'
import {tabbed_menu_sample} from './samples/tabbed menu'
import {toggles_sample} from './samples/toggles'
import {moments_sample} from './samples/moments'

export function HomePage(props:ViewUtils.EntityComponentProps<Models.HomePage>) : JSX.Element {
  let all_samples : Array<{ sample:C<void>, description:string }> =
    [
      { sample: moments_sample, description:"Moment input." },
      { sample: course_form_sample, description:"A form with save button." },
      { sample: course_form_with_autosave_sample, description:"A form with autosave." },
      { sample: workflow_sample, description:"A workflow." },
      { sample: selector_sample, description:"A selector." },
      { sample: multiselector_sample, description:"A multi-selector." },
      { sample: toggles_sample, description:"A series of (coordinated) toggles." },
      { sample: label_sample, description:"A labelled item." },
      { sample: menu_sample, description:"A menu with content." },
      { sample: tabbed_menu_sample, description:"A tabbed menu with content." },
      { sample: button_sample, description:"A button." }
    ]

  return <div>
      {
        all_samples.map((s,i) =>
          <div className="component">
            Sample {i+1} - {s.description}
            {
              hide(s.description, s.sample).comp(
                { mode:"edit", set_mode:((nm, c) => {}), logic_frame:0, force_reload:(c) => {}
              })(continuation => value => console.log("done"))
            }
          </div>
        )
      }
  </div>
}
