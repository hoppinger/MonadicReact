import * as React from "react"
import * as ReactDOM from "react-dom"
import {List, Map, Set, Range} from "immutable"
import * as Immutable from "immutable"
import * as Moment from 'moment'
import {C, unit, bind} from '../react_monad/core'
import {string, number, bool} from '../react_monad/primitives'
import {button, selector, multi_selector, label, h1, h2, div, form, image} from '../react_monad/html'
import {custom, repeat, all, any, lift_promise, retract, delay, menu, hide} from '../react_monad/combinators'
import {rich_text} from '../react_monad/rich_text'
import {paginate, Page} from '../react_monad/paginator'
import {list} from '../react_monad/list'

export type EditableListState<A> = { items:List<A>, selected_index:undefined|number }
export type ListOperation<A> = { kind:"add", value:A } | { kind:"remove", value:A, index:number } | { kind:"toggle", value:A, index:number, selected:boolean }
let perform = function<A>(s:EditableListState<A>, op:ListOperation<A>) : EditableListState<A> {
  return op.kind == "add" ?
          {...s, items:s.items.push(op.value)  }
        : op.kind == "remove" ?
          {...s, items:s.items.remove(op.index), selected_index:s.selected_index == op.index ? undefined : op.index > s.selected_index ? s.selected_index : s.selected_index - 1 }
        : {...s, selected_index:op.selected ? op.index : s.selected_index == op.index ? undefined : s.selected_index  }
}

export let editable_list = function<A>(list_name:string, initial_items:C<List<A>>, create_new_form:(_:EditableListState<A>) => C<A>) : C<EditableListState<A>> {
  return initial_items.bind(list_name, items =>
  repeat<EditableListState<A>>(
    form<EditableListState<A>, EditableListState<A>>(`monadic-list-form`)(
      any<EditableListState<A>, EditableListState<A>>([
        s => list<A, ListOperation<A>>(s.items, undefined, `monadic-list-items`)(i => n =>
          any<ListOperation<A>, ListOperation<A>>([
            div<ListOperation<A>,ListOperation<A>>(`monadic-list-cell`)([])(_ =>
              label<boolean, boolean>("")(bool("edit", "radio"))(s.selected_index == i).bind(undefined, selected =>
                unit<ListOperation<A>>({ kind:"toggle", value:n, index:i, selected:selected }).filter(_ =>
                  selected != (s.selected_index == i)))),
            div<ListOperation<A>,ListOperation<A>>(`monadic-list-cell`)([])(op =>
              string("view")(`This is item ${n}, with index ${i}`).filter(_ => false).ignore_with(op)),
            div<ListOperation<A>,ListOperation<A>>(`monadic-list-cell monadic-list-lastcell`)([])(_ =>
              button<ListOperation<A>>(`X`)({ kind:"remove", value:n, index:i }))
          ], `item_${n}`, `monadic-list-item`)(undefined)
          ).bind(`inner list`, op => unit(perform(s,op))),
          s => create_new_form(s).bind(`monadic-new-list-item`, new_value => unit(perform(s, { kind:"add", value:new_value })))
        ]
    )))({ items:items, selected_index:undefined }), `monadic-list ${list_name}`)
}
