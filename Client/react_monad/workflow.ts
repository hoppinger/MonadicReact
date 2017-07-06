import * as React from "react"
import * as ReactDOM from "react-dom"
import {List, Map, Set} from "immutable"
import * as Immutable from "immutable"
import * as Moment from 'moment'
import * as Models from '../generated_models'
import * as Api from '../generated_api'
import * as ViewUtils from '../generated_views/view_utils'
import {C, unit, bind} from '../react_monad/core'
import {string, number, bool} from '../react_monad/primitives'
import {button, selector, multi_selector, label, image} from '../react_monad/html'
import {custom, repeat, any, lift_promise, retract, delay, menu} from '../react_monad/combinators'
import * as Form from '../react_monad/forms'

export type WorkflowData<S,M> = { model:M, step:S }
export let simple_workflow = function<S,M>(workflow_name:string, steps:Immutable.Map<S, (_:WorkflowData<S,M>) => C<WorkflowData<S,M>>>, initial_model:C<M>, initial_step:S) : C<M> {
  return initial_model.bind(`${workflow_name}_initial_binder`, m =>
  repeat<WorkflowData<S,M>>(cd =>
    steps.has(cd.step) ?
      steps.get(cd.step)(cd)
    :
      unit<WorkflowData<S,M>>(cd).filter(_ => false)
  , `${workflow_name}_repeater`, () => `${workflow_name}_repeater`)({ model: m, step:initial_step }).map<M>(c => c.model))
}
