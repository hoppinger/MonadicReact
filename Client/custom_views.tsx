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
import {course_form_sample} from './samples/course_form_with_autosave'
import {workflow_sample} from './samples/workflow'
import {label_sample} from './samples/label'
import {selector_sample} from './samples/selector_and_custom_class'
import {multiselector_sample} from './samples/multiselector'
import {menu_sample} from './samples/menu'
import {toggles_sample} from './samples/toggles'

export function HomePage(props:ViewUtils.EntityComponentProps<Models.HomePage>) : JSX.Element {
  let all_samples : Array<{ sample:C<void>, description:string }> =
    [
      { sample: button_sample, description:"A button." },
      { sample: course_form_sample, description:"A form with upload and download." },
      { sample: workflow_sample, description:"A workflow." },
      { sample: selector_sample, description:"A selector." },
      { sample: multiselector_sample, description:"A multi-selector." },
      { sample: toggles_sample, description:"A series of (coordinated) toggles." },
      { sample: label_sample, description:"A labelled item." },
      { sample: menu_sample, description:"A menu with content." }
    ]

  return <div>
      {
        all_samples.map((s,i) =>
          <div className="component">
            Sample {i+1} - {s.description}
            {
              hide(s.description, s.sample).comp(continuation => value => console.log("done"))
            }
          </div>
        )
      }
  </div>
}

// TODO:
  // various operators
    // samples
      // sample with all
    // form validation
      // use filter?
    // workflow via forms (and one retract per form)
    // abstract form
    // abstract workflow
      // also with validation (implicitly via form?)
    // date, time, datetime
    // list
      // pagination
      // mapM
      // select
      // add new
      // add existing
    // page manager (with url's)
      // routing
    // sample with multiple independent elements repeat(any [repeat(el_i)])
    // files
    // fold
  // show to designers for feedback
  // documentation
  // linkedin post linked on reddit
  // npm package
  // Api.download/upload operators should already be lifted out the box (from the scaffolder)
  // default scaffolder views should use the monadic library
