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
import {button, selector, multi_selector, label, image, link, file}from '../react_monad/html'
import {custom, repeat, any, lift_promise, retract, delay, menu} from '../react_monad/combinators'

let upload_attachment : (attachment:File) => C<void> = a =>
  lift_promise<File, void>(file => Api.get_Course(1).then(c => Api.upload_Course_Attachment(c.Item, file).then(_ => null)),
  "semi exponential", `course_attachment_uploader_lift_${1}`)(a)

export let file_sample : C<void> =
  file("edit", "Download course attachment", "/api/v1/Course/1/AttachmentDownload").bind(`file uploader sample`, f =>
  upload_attachment(f))
