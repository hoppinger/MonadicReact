import * as React from "react"
import * as ReactDOM from "react-dom"
import * as Immutable from 'immutable'
import * as Utils from '../generated_views/view_utils'
import * as Buttons from './button_utils'
import * as i18next from 'i18next'
import * as Api from '../generated_api'


export let render_relation =
  (relation_name:string,
   source_name:string,
   target_name:string,
   target_plural:string,
   show_title:boolean,
   inline:boolean,
   cards:boolean,
   side_selector:boolean) =>
  function <Source,Target>(
      items:"loading"|Immutable.Iterable<number, Target>,
      page_index:number,
      num_pages:number,
      page_selected:(new_page:number) => void,
      render_target:(t:Target,t_id:number) => JSX.Element,
      render_new_targets:() => JSX.Element) {
  return <div className={`${relation_name} ${inline ? "inline-relation" : ""} ${side_selector ? "column-view-menu" : ""}`}>
    {
      items == "loading" ?
      <div className="loading">
        {i18next.t(`Loading ${target_name}`)}.
      </div>
      :
      <div className={`${inline ? "" : "model-nested"} ${cards ? "cards" : ""}`}>
        {inline || !show_title ? null : <div className="model-nested__title">{i18next.t(target_plural)}</div>}
        <Utils.Paginator PageIndex={page_index} NumPages={num_pages}
              page_selected={new_page_index =>
                page_selected(new_page_index)
              } />
        {
          items.map((i,i_id) =>
              render_target(i,i_id)
          ).valueSeq()
        }
        <div className="button__actions-wrapper">
          { render_new_targets() }
        </div>
      </div>
    }
  </div>
}


export async function load_all<Target>(page_index:number, page_size:number, getPage:(page_index:number, page_size:number) => Promise<Api.RawPage<Target & { Id:number }>>) : Promise<Immutable.List<Target & { Id:number }>> {
  let page = await getPage(page_index, page_size)
  let items = Immutable.List<Target & { Id:number }>(page.Items.map(i => i.Item))
  if (page.PageIndex == page.NumPages - 1 || page.NumPages <= 1) return items
  let rest = await load_all(page_index + 1, page_size, getPage)
  return items.concat(rest).toList()
}

export let load_all_from = async<Source,Target>(source:Source & { Id:number }, page_index:number, page_size:number, getPage:(source:Source & { Id:number }, page_index:number, page_size:number) => Promise<Api.RawPage<Target & { Id:number }>>) : Promise<Immutable.List<Target & { Id:number }>> => {
  let page = await getPage(source, page_index, page_size)
  let items = Immutable.List<Target & { Id:number }>(page.Items.map(i => i.Item))
  if (page.PageIndex == page.NumPages - 1 || page.NumPages <= 1) return items
  let rest = await load_all_from(source, page_index + 1, page_size, getPage)
  return items.concat(rest).toList()
}

export function selector_first_step<Target>(
  show:(t:Target & { Id:number }) => string,
  selection_name:string,
  getTargets:(page_index:number, page_size:number) => Promise<Api.RawPage<Target & { Id:number }>>,
  continuation:(t:Target & { Id:number }, setContinuationElement:(ce:JSX.Element) => void) => void) {
    return () : JSX.Element => {
      return React.createElement(SelectorFirstStep, {
        selection_name:selection_name,
        show:show,
        getTargets:getTargets,
        continuation:continuation
      }, null)
    }
  }

export function selector_step<Source,Target>(
  relation_name:string,
  source_name:string,
  target_name:string,
  target_plural:string,
  show:(t:Target & { Id:number }) => string,
  render_element:(t:Target & { Id:number }, t_id:number) => JSX.Element,
  selection_name:string,
  is_last:boolean,
  getUnwantedTargets:(page_index:number, page_size:number) => Promise<Api.RawPage<Target & { Id:number }>>,
  getTargets:(source:Source & { Id:number }, page_index:number, page_size:number) => Promise<Api.RawPage<Target & { Id:number }>>,
  continuation:(t:Target & { Id:number }, setContinuationElement:(ce:JSX.Element) => void) => void) {
    return (source:Source & { Id:number }) : JSX.Element => {
      return React.createElement(SelectorStep, {
        relation_name:relation_name,
        source_name:source_name,
        target_name:target_name,
        target_plural:target_plural,
        source:source,
        selection_name:selection_name,
        is_last:is_last,
        show:show,
        render_element:render_element,
        getUnwantedTargets:getUnwantedTargets,
        getTargets:getTargets,
        continuation:continuation
      }, null)
    }
  }

export type SelectorFirstStepProps<Source,Target> = {
  selection_name:string,
  getTargets:(page_index:number, page_size:number) => Promise<Api.RawPage<Target & { Id:number }>>,
  show:(t:Target & { Id:number }) => string,
  continuation:(t:Target & { Id:number }, setContinuationElement:(ce:JSX.Element) => void) => void
}
export type SelectorFirstStepState<Source,Target> = {
  targets:"loading" | Immutable.List<Target & { Id:number }>,
  step:"selecting"|{ selected:Target },
  continuation_element:"none"|JSX.Element,
  update_count:number }
export class SelectorFirstStep<Source,Target> extends React.Component<SelectorFirstStepProps<Source,Target>, SelectorFirstStepState<Source,Target>> {
  constructor(props:SelectorFirstStepProps<Source,Target>, context:any) {
    super(props, context)

    this.state = { targets:"loading", step:"selecting", continuation_element:"none", update_count: 0 }
  }

  load() {
    load_all(0, 50, this.props.getTargets).then(targets => this.setState({...this.state, targets: targets}))
  }

  componentWillReceiveProps(new_props:SelectorFirstStepProps<Source,Target>) {
    this.load()
  }

  componentWillMount() {
    this.load()
  }

  render() {
    return this.state.targets == "loading" ?
        <div className="loading">{i18next.t("Loading...")}</div>
      :
      <div>
        <h3>{i18next.t(`Select ${this.props.selection_name}`)}</h3>
        <select defaultValue={""}
                onChange={t => {
                  if (this.state.targets == "loading" || t.currentTarget.value == "") return
                  let selected = this.state.targets.get(parseInt(t.currentTarget.value))
                  this.setState(
                    {...this.state,
                      step:{ selected: selected}
                    },
                    () =>
                      this.props.continuation(selected,
                        ce => this.setState({...this.state, continuation_element: ce, update_count: this.state.update_count+1}))
                  )
                }
                }>
          <option value={""}></option>
          {
            this.state.targets.map((t,t_id) =>
              <option key={t_id} value={t_id.toString()}>{this.props.show(t)}</option>
            )
          }
        </select>
        <div key={this.state.update_count}>
          {
            this.state.continuation_element != "none" ?
              this.state.continuation_element
            :
              null
          }
        </div>
      </div>
  }
}

export type SelectorStepProps<Source,Target> = {
  source:Source & { Id:number },
  relation_name:string,
  source_name:string,
  target_name:string,
  target_plural:string,
  selection_name:string, is_last:boolean,
  getUnwantedTargets:(page_index:number, page_size:number) => Promise<Api.RawPage<Target & { Id:number }>>,
  getTargets:(source:Source, page_index:number, page_size:number) => Promise<Api.RawPage<Target & { Id:number }>>,
  show:(t:Target & { Id:number }) => string,
  render_element:(t:Target & { Id:number }, t_id:number) => JSX.Element,
  continuation:(t:Target & { Id:number }, setContinuationElement:(ce:JSX.Element) => void) => void
}
export type SelectorStepState<Source,Target> = {
  unwanted_targets:"loading" | Immutable.List<Target & { Id:number }>,
  targets:"loading" | Immutable.List<Target & { Id:number }>,
  step:"selecting"|{ selected:Target & { Id:number } },
  continuation_element:"none"|JSX.Element,
  update_count:number }
export class SelectorStep<Source,Target> extends React.Component<SelectorStepProps<Source,Target>, SelectorStepState<Source,Target>> {
  constructor(props:SelectorStepProps<Source,Target>, context:any) {
    super(props, context)

    this.state = { unwanted_targets:"loading", targets:"loading", step:"selecting", continuation_element:"none", update_count:0 }
  }

  async load() {
    let unwanted_targets = await load_all(0, 50, this.props.getUnwantedTargets)
    if (this.props.is_last)
      this.setState({...this.state, unwanted_targets:unwanted_targets, targets: Immutable.List<Target & { Id:number }>()})
    else {
      let targets = await load_all_from(this.props.source, 0, 50, this.props.getTargets)
      this.setState({...this.state, unwanted_targets:unwanted_targets, targets: targets})
    }
  }

  componentWillReceiveProps(new_props:SelectorStepProps<Source,Target>) {
    this.load()
  }

  componentWillMount() {
    this.load()
  }

  render() {
    return this.state.targets == "loading" || this.state.unwanted_targets == "loading" ?
        <div className="loading">{i18next.t("Loading...")}</div>
      :
      <div>
        <h3>{i18next.t(`Select ${this.props.selection_name}`)}</h3>
        {
          this.props.is_last ?
          React.createElement(AddToRelation,
            {
              relation_name:this.props.relation_name,
              source_name:this.props.source_name,
              target_name:this.props.target_name,
              target_plural:this.props.target_plural,
              suppress_overlay:true,
              unwanted_items:this.state.unwanted_targets,
              page_size:25,
              render_target:(t:Target & { Id:number },t_id:number) =>
                this.props.render_element(t,t_id),
              cancel:() => {},
              get_items:[{ name: "", get: (page_index:number, page_size:number) => this.props.getTargets(this.props.source, page_index, page_size) }]
            }
          )
          :
          <select defaultValue={""}
                  onChange={t => {
                    if (this.state.targets == "loading" || t.currentTarget.value == "") return
                    let selected = this.state.targets.get(parseInt(t.currentTarget.value))
                    this.setState(
                      {...this.state,
                        step:{ selected: selected}
                      },
                      () =>
                        this.props.continuation(selected,
                          ce => this.setState({...this.state, continuation_element: ce, update_count:this.state.update_count+1}))
                    )
                  }
                  }>
            <option value={""}></option>
            {
              this.state.targets.map((t,t_id) =>
                this.state.unwanted_targets == "loading" || this.state.unwanted_targets.some(t1 => t.Id == t1.Id) ?
                  null
                :
                  <option key={t_id} value={t_id.toString()}>{this.props.show(t)}</option>
              )
            }
          </select>
        }
        <div key={this.state.update_count}>
          {
            this.state.continuation_element != "none" ?
              this.state.continuation_element
            :
              null
          }
        </div>
      </div>
  }
}

export let render_add_to_relation_block =
  (relation_name:string,
   source_name:string,
   target_name:string,
   target_plural:string) =>
  function <Source,Target>(
    block:() => JSX.Element,
    add_buttons:() => JSX.Element,
    cancel:() => void) {
  return <div className={`overlay new-${target_name.toLowerCase()}-background`}
              onClick={e => e.target == e.currentTarget && cancel()}>
          <div className={`overlay__item overlay__item--new add-existing-${target_name.toLowerCase()}`}>
            <div className="group">
              {
                block()
              }
            </div>

            <button onClick={() => cancel()}>
              {i18next.t('Cancel')}
            </button>
          </div>
          { add_buttons() }
        </div>
}

export type AddToRelationProps<Target> =
  {
    relation_name:string,
    source_name:string,
    target_name:string,
    target_plural:string,
    page_size:number,
    suppress_overlay?:boolean,
    unwanted_items?:Immutable.List<Target & { Id:number }>,
    render_target:(t:Target & { Id:number },t_id:number) => JSX.Element,
    cancel:() => void,
    get_items:{name:string, get:(page_index:number, page_size:number) => Promise<Api.RawPage<Target & { Id:number }>>}[]
  }
export type AddToRelationState<Target> =
  {
    step:"selecting"|{ selected:number },
    items:"loading"|Immutable.List<Target & { Id:number }>,
    page_index:number,
    num_pages:number
  }
export class AddToRelation<Target> extends React.Component<AddToRelationProps<Target>, AddToRelationState<Target>> {
  constructor(props:AddToRelationProps<Target>, context:any) {
    super(props, context)

    this.state = { items:"loading", page_index: 0, num_pages: 0, step:this.props.get_items.length > 1 ? "selecting" : {selected:0} }
  }

  async load_page(page_index:number) {
    if (this.state.step == "selecting") return
    let items_page = await this.props.get_items[this.state.step.selected].get(page_index, this.props.page_size)
    this.setState({
      ...this.state,
      items:Immutable.List<Target & { Id:number }>(items_page.Items.map(i => i.Item)),
      page_index: items_page.PageIndex,
      num_pages: items_page.NumPages
    })
  }

  componentWillMount() {
    this.load_page(this.state.page_index)
  }

  render() {
    return <div>
      {
        this.state.step == "selecting" ?
          <div className={this.props.suppress_overlay ? `overlay--inline new-${this.props.target_name.toLowerCase()}-background` : `overlay new-${this.props.target_name.toLowerCase()}-background`}
              onClick={e => e.target == e.currentTarget && this.props.cancel()}>
            <div className={this.props.suppress_overlay ? "" : `overlay__item`}>
              <div>
                {
                  this.props.get_items.map((g,g_id) =>
                    <Buttons.Add
                      onClick={() => this.setState({
                        ...this.state,
                        step: { selected: g_id }
                      }, () => this.load_page(this.state.page_index))}
                      target_name={g.name}
                    />)
                }
              </div>
            </div>
            { this.props.suppress_overlay ? null : <button onClick={() => this.props.cancel()}>{i18next.t('Cancel')}</button> }
          </div>
        :
        this.state.items == "loading" ?
          <div className="loading">Loading</div>
        :
          <div className={this.props.suppress_overlay ? `overlay--inline new-${this.props.target_name.toLowerCase()}-background` : `overlay new-${this.props.target_name.toLowerCase()}-background`}
              onClick={e => e.target == e.currentTarget && this.props.cancel()}>
            <div className={this.props.suppress_overlay ? "" : `overlay__item`}>
            <Utils.Paginator PageIndex={this.state.page_index} NumPages={this.state.num_pages}
                  page_selected={new_page_index =>
                    this.load_page(new_page_index)
                  } />
              <div className="group">
                {
                  this.state.items.filter((i,i_id) => !this.props.unwanted_items || !this.props.unwanted_items.some(u => u.Id == i.Id)).map((i,i_id) =>
                    this.props.render_target(i,i_id)
                  ).valueSeq()
                }
              </div>
              { this.props.suppress_overlay ? null : <button onClick={() => this.props.cancel()}>{i18next.t('Cancel')}</button> }
            </div>
          </div>
      }
    </div>
  }
}

export function merge<T>(new_items:Utils.PaginatedItems<{ shown_relation: string } & Utils.EntityAndSize<T & {Id:number}>>, old_items:Utils.PaginatedItems<{ shown_relation: string } & Utils.EntityAndSize<T & {Id:number}>>|"loading") : Utils.PaginatedItems<{ shown_relation: string } & Utils.EntityAndSize<T & {Id:number}>> {
  let items:Immutable.Map<number,{ shown_relation: string } & Utils.EntityAndSize<T & {Id:number}>> = new_items.Items.map((i,i_id) =>
      old_items == "loading" || !old_items.Items.has(i.element.Id) ?
        i
      :
        {...i, size: old_items.Items.get(i.element.Id).size, shown_relation: old_items.Items.get(i.element.Id).shown_relation}
      ).toMap()
  return {
    ...new_items,
    Items: items
  }
}




export type AddToRelationDropdownProps<Target> =
  {
    relation_name:string,
    source_name:string,
    target_name:string,
    target_plural:string,
    page_size:number,
    unwanted_items?:Immutable.List<Target & { Id:number }>,
    render_target:(t:Target & { Id:number },t_id:number) => string,
    ok:(t:Target & { Id:number }) => void,
    cancel:() => void,
    get_items:(page_index:number, page_size:number) => Promise<Api.RawPage<Target & { Id:number }>>
  }
export type AddToRelationDropdownState<Target> =
  {
    items:"loading"|Immutable.List<Target & { Id:number }>,
    selection:"waiting"|(Target & { Id:number })
  }
export class AddToRelationDropdown<Target> extends React.Component<AddToRelationDropdownProps<Target>, AddToRelationDropdownState<Target>> {
  constructor(props:AddToRelationDropdownProps<Target>, context:any) {
    super(props, context)

    this.state = { items:"loading", selection:"waiting" }
  }

  async load_page() {
    let items = await load_all(0, this.props.page_size, this.props.get_items)
    this.setState({
      ...this.state,
      items:Immutable.List<Target & { Id:number }>(items),
    })
  }

  componentWillMount() {
    this.load_page()
  }

  render() {
    return <div>
      {
        this.state.items == "loading" ?
          <div className="loading">Loading</div>
        :
          <div className={``}>
            <select defaultValue={""}
                    onChange={t => {
                      if (this.state.items == "loading" || t.currentTarget.value == "") return
                      let selected = this.state.items.get(parseInt(t.currentTarget.value))
                      this.setState(
                        {...this.state,
                          selection: selected
                        }
                      )
                    }
                    }>
              <option value={""}></option>
              {
                this.state.items.map((t,t_i) =>
                  <option key={t.Id} value={t_i.toString()}>{this.props.render_target(t,t.Id)}</option>
                )
              }
            </select>
            <button onClick={() => this.props.cancel()}>{i18next.t('Cancel')}</button>
            <button disabled={this.state.selection == "waiting"}
              onClick={() => this.state.selection != "waiting" &&
                this.props.ok(this.state.selection)}>{i18next.t('Ok')}</button>
          </div>
      }
    </div>
  }
}