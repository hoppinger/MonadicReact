import * as React from "react"
import * as ReactDOM from "react-dom"
import {List, Map, Set, Range} from "immutable"
import * as Immutable from "immutable"
import * as Moment from 'moment'
import * as i18next from 'i18next'

import * as Models from './generated_models'
import * as Api from './generated_api'
import * as ViewUtils from './generated_views/view_utils'

import {C, Mode, Context, unit, bind} from './react_monad/core'
import {string, number, bool} from './react_monad/primitives'
import {button, selector, multi_selector, label, h1, h2, div, form, image, link, file, overlay} from './react_monad/html'
import {custom, repeat, all, any, lift_promise, retract, delay, menu} from './react_monad/combinators'
import {rich_text} from './react_monad/rich_text'
import {paginate, Page} from './react_monad/paginator'
import {list} from './react_monad/list'
import {editable_list} from './react_monad/editable_list'

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
import {rich_text_sample} from './samples/rich text'
import {pagination_sample} from './samples/pagination'
import {list_sample} from './samples/list'
import {editable_list_sample} from './samples/editable_list'
import {link_sample} from './samples/link'
import {file_sample} from './samples/file'
import {overlay_sample} from './samples/overlay'

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
  h2<void, void>(s.description, "", s.description)(_ => s.sample)(null)


export type ApplicationProps = { mode:Mode, p:C<void> }
export type ApplicationState = { context:Context }
export class Application extends React.Component<ApplicationProps, ApplicationState> {
  constructor(props:ApplicationProps, context:any) {
    super(props, context)

    this.state = { context:this.context_from_props(this.props) }
  }

  context_from_props = (props:ApplicationProps) : Context => ({
    mode:props.mode,
    current_page:props.p,
    set_mode:(new_mode, callback) => this.setState({...this.state, context:{...this.state.context, mode:new_mode}}, callback),
    logic_frame:0,
    force_reload:(callback) => this.setState({...this.state, context:{...this.state.context, logic_frame:this.state.context.logic_frame}}, callback),
    pages:Immutable.Stack<C<void>>(),
    set_page:(new_page:C<void>, callback?:()=>void) => this.setState({...this.state, context:{...this.state.context, current_page:new_page}}, callback),
    push_page:(new_page:C<void>, callback?:()=>void) =>
      this.setState({...this.state, context:{...this.state.context, current_page:new_page, pages:this.state.context.pages.push(this.state.context.current_page)}}, callback),
    pop_page:(callback?:()=>void) =>
      this.state.context.pages.isEmpty() ? null
      :
      this.setState({...this.state, context:{...this.state.context, current_page:this.state.context.pages.peek(), pages:this.state.context.pages.pop()}}, callback),
  })

  componentWillReceiveProps(new_props:ApplicationProps) {
    this.setState({...this.state, context:this.context_from_props(new_props)})
  }

  render() {
    return <div className="monadic-application" key={`application@${this.state.context.logic_frame}`}>
      {
        this.state.context.current_page.comp(this.state.context)(callback => _ => callback && callback())
      }
    </div>
  }
}

export let application = (mode:Mode, p:C<void>) : JSX.Element =>
  React.createElement<ApplicationProps>(Application, { mode:mode, p:p })


export function HomePage(props:ViewUtils.EntityComponentProps<Models.HomePage>) : JSX.Element {
  let all_samples : Array<Sample> =
    [
      { sample: overlay_sample, description:"overlay" },
      { sample: link_sample, description:"links" },
      { sample: file_sample, description:"file" },
      { sample: editable_list_sample, description:"editable list" },
      { sample: pagination_sample, description:"pagination" },
      { sample: list_sample, description:"list" },
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

  let show:"menu"|"toggles" = "menu"
  return <div>
      {
        <div className="component">
          {
            application("edit",
              show == "menu" ?
                menu<Sample, void>("side menu", s => s.description)(List(all_samples), sample_minipage)
              :
                div<void, void>()(all_samples.map((s,i) => _ => sample_toggleable_minipage(s)))(_ => unit<void>(null).never<void>())(null))
          }
        </div>
      }
  </div>
}
