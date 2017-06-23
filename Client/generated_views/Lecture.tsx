import * as React from "react"
import * as ReactDOM from "react-dom"
import * as Immutable from "immutable"
import * as Models from '../generated_models'
import * as Api from '../generated_api'
import * as List from '../containers/list'
import * as Components from '../components/components'
import * as Buttons from '../containers/button_utils'
import * as ToggleContainer from '../containers/toggle_container'
import * as Permissions from './permissions'
import * as Utils from './view_utils'
import * as Draft from 'draft-js'
import * as i18next from 'i18next'
import * as Moment from 'moment'
import * as HomePageViews from './HomePage'
import * as CourseViews from './Course'
import * as CustomViews from '../custom_views'

export function Lecture_Course_Lecture_can_create(self:LectureContext) {
  let state = self.state()
  return state.Course == "loading" ? false : state.Course.CanCreate
}
export function Lecture_Course_Lecture_can_delete(self:LectureContext) {
  let state = self.state()
  return state.Course == "loading" ? false : state.Course.CanDelete
}
export function Lecture_Course_Lecture_page_index(self:LectureContext) {
  let state = self.state()
  return state.Course == "loading" ? 0 : state.Course.PageIndex
}
export function Lecture_Course_Lecture_page_size(self:LectureContext) {
  let state = self.state()
  return state.Course == "loading" ? 25 : state.Course.PageSize
}
export function Lecture_Course_Lecture_search_query(self:LectureContext) {
  let state = self.state()
  return state.Course == "loading" ? null : state.Course.SearchQuery
}
export function Lecture_Course_Lecture_num_pages(self:LectureContext) {
  let state = self.state()
  return state.Course == "loading" ? 1 : state.Course.NumPages
}

export function load_relation_Lecture_Course_Lecture(self:LectureContext, force_first_page:boolean, callback?:()=>void) {
  let state = self.state()
  let prelude = force_first_page && state.Course != "loading" ?
    (c:() => void) => state.Course != "loading" && self.setState({
      ...state,
      Course: {...state.Course, PageIndex:0 }
    }, c)
    :
    (c:() => void) => c()
  Permissions.can_view_Course() ?
    prelude(() =>
      Api.get_Lecture_Course_Lectures(self.props.entity, Lecture_Course_Lecture_page_index(self), Lecture_Course_Lecture_page_size(self), Lecture_Course_Lecture_search_query(self)).then(Courses =>
        self.setState({...self.state(), update_count:self.state().update_count+1,
            Course:Utils.raw_page_to_paginated_items<Models.Course, Utils.EntityAndSize<Models.Course> & { shown_relation:string }>((i, i_just_created) => {
              let state = self.state()
              return {
                element:i,
                size: state.Course != "loading" ?
                  (state.Course.Items.has(i.Id) ?
                    state.Course.Items.get(i.Id).size
                  :
                    "preview" /* i_just_created ? "large" : "preview" */)
                  :
                    "preview" /* i_just_created ? "large" : "preview" */,
                shown_relation:"all"}}, Courses)
            }, callback)))
    :
      prelude(() => callback && callback())
}

export function load_relations_Lecture(self, callback?:()=>void) {
  load_relation_Lecture_Course_Lecture(self, false, 
        () => callback && callback())
}

export function set_size_Lecture(self:LectureContext, new_size:Utils.EntitySize) {
  self.props.set_size(new_size, () => {
    if (new_size == "fullscreen")
      self.props.push(Lecture_to_page(self.props.entity.Id))
  })
}

export function render_Lecture_Name_editable_minimised(self:LectureContext) : JSX.Element {
  if (!Permissions.can_edit_Lecture()) return render_Lecture_Name_minimised(self)
  else
    return !Permissions.can_view_Lecture_Name() ? <div /> :
          <div className="model__attribute name">
  <label className="attribute-label attribute-label-name">{i18next.t(`Lecture:Name`, {context: self.props.inline ? "inline" : ""})}</label>
  <div className="model__attribute-content">
    { Components.String(
        self.props.is_editable && Permissions.can_edit_Lecture() && Permissions.can_edit_Lecture_Name(),
        self.props.mode,
        () => self.props.entity.Name,
        v => self.props.set_entity({...self.props.entity, Name:v})) } 
  </div>
</div>
}

export function render_Lecture_Description_editable_minimised(self:LectureContext) : JSX.Element {
  if (!Permissions.can_edit_Lecture()) return render_Lecture_Description_minimised(self)
  else
    return !Permissions.can_view_Lecture_Description() ? <div /> :
          null
}


export function render_Lecture_Name_editable_maximised(self:LectureContext) : JSX.Element {
  if (!Permissions.can_edit_Lecture()) return render_Lecture_Name_maximised(self)
  else
    return !Permissions.can_view_Lecture_Name() ? <div /> :
          <div className="model__attribute name">
  <label className="attribute-label attribute-label-name">{i18next.t(`Lecture:Name`, {context: self.props.inline ? "inline" : ""})}</label>
  <div className="model__attribute-content">
    { Components.String(
        self.props.is_editable && Permissions.can_edit_Lecture() && Permissions.can_edit_Lecture_Name(),
        self.props.mode,
        () => self.props.entity.Name,
        v => self.props.set_entity({...self.props.entity, Name:v})) } 
  </div>
</div>
}

export function render_Lecture_Description_editable_maximised(self:LectureContext) : JSX.Element {
  if (!Permissions.can_edit_Lecture()) return render_Lecture_Description_maximised(self)
  else
    return !Permissions.can_view_Lecture_Description() ? <div /> :
          <div className="model__attribute description">
  <label className="attribute-label attribute-label-description">{i18next.t(`Lecture:Description`, {context: self.props.inline ? "inline" : ""})}</label>
  <div className="model__attribute-content">
    { Components.RichText(
        self.props.is_editable && Permissions.can_edit_Lecture() && Permissions.can_edit_Lecture_Description(),
        self.props.mode,
        () => self.props.entity.Description,
        v => self.props.set_entity({...self.props.entity, Description:v})) } 
  </div>
</div>
}


export function render_editable_attributes_minimised_Lecture(self:LectureContext) {
  let attributes = (<div>
      {render_Lecture_Name_editable_minimised(self)}
    </div>)
  return attributes
}

export function render_editable_attributes_maximised_Lecture(self:LectureContext) {
    let state = self.state()
    let attributes = (<div>
        {render_Lecture_Name_editable_maximised(self)}
        {render_Lecture_Description_editable_maximised(self)}
        
        
        
      </div>)
    return attributes
  }

export function render_breadcrumb_Lecture(self:LectureContext) {
  return <div className="breadcrumb-lecture">Lecture</div>
}

export function render_menu_Lecture(self:LectureContext) {
  let state = self.state()
  return <div className="menu">
        <img className="logo" src={"/images/logo.png"} alt="Logo"/>
        <div className="pages">
          {!Permissions.can_view_HomePage() ? null :
              <div className={`menu_entry page_link`}>
                <a onClick={() => 
                  Api.get_HomePages(0, 1).then(e =>
                    e.Items.length > 0 && self.props.set_page(HomePageViews.HomePage_to_page(e.Items[0].Item.Id))
                  )
                }>
                  {i18next.t('HomePage')}
                </a>
              </div>
            }
          <div className="menu_entries">
          
            {!Permissions.can_view_Course() ? null :
                  <div className={`menu_entry${self.props.shown_relation == "HomePage_Course" ? " active" : ""}`}>
                    <a onClick={() =>
                        {
                            Api.get_HomePages(0, 1).then(e =>
                              e.Items.length > 0 && self.props.set_page(HomePageViews.HomePage_to_page(e.Items[0].Item.Id),
                                () => self.props.set_shown_relation("HomePage_Course"))
                            )
                        }
                      }>
                      {i18next.t('HomePage_Courses')}
                    </a>
                  </div>
                }
                <div className="menu_entry menu_entry--with-sub">
                
                </div>  
          </div>
        </div>
      </div>
}

export function render_local_menu_Lecture(self:LectureContext) {
  let state = self.state()
  return <div className="local-menu">
          <div className="local_menu_entries">
            <div className={`local_menu_entry${self.props.shown_relation == "none" ? " local_menu_entry--active" : ""}`}>
              <a onClick={() =>
                  self.props.set_shown_relation("none")
              }>
                {i18next.t('About this Lecture')}
              </a>
            </div>
          
              
          </div>
        </div>
}

export function render_controls_Lecture(self:LectureContext) {
  return <div className="control">
    {self.props.allow_maximisation && self.props.set_size ? <a className={`"lecture button button--toggle ${self.props.size != 'preview' ? 'button--toggle--open' : ''}`}
          onClick={() => {
            set_size_Lecture(self, self.props.size == "preview" ? "large" : "preview")}
          }>
      </a> : null}
    {Permissions.can_delete_Lecture() && self.props.size == "fullscreen" ? <a className="button button--delete"
      onClick={() => confirm(i18next.t('Are you sure?')) &&
        Api.delete_Lecture(self.props.entity).then(() => self.props.force_reload(() => self.props.pop()))
      }>
    </a> : null}
    {self.props.size == "fullscreen" && self.props.pages_count > 0 ? <a className="lecture button button--close"
        onClick={() => self.props.pop()}>
    </a> : null}
    {self.props.unlink && self.props.mode != "view" ?
      <a className="button button--unlink"
          onClick={() => self.props.unlink()}>
      </a>
      :
      null
    }
    {self.props.delete && self.props.mode != "view" ?
      <a className="button button--delete"
          onClick={() => self.props.delete()}>
      </a>
      :
      null
    }
  </div>
}

export function render_content_Lecture(self:LectureContext) {
  let actions:Array<()=>void> =
    [
      self.props.allow_maximisation && self.props.set_size && self.props.size == "preview" ?
        () => set_size_Lecture(self, self.props.size == "preview" ? "large" : "preview")
      :
        null,
    ].filter(a => a != null)
  let content =
    Permissions.can_view_Lecture() ?
      self.props.size == "preview" ?
        render_preview_Lecture(self)
      : self.props.size == "large" ?
        render_large_Lecture(self)
      : self.props.size == "fullscreen" ?
        render_large_Lecture(self)
      : "Error: unauthorised access to entity."
    : "Error: unauthorised access to entity."
  if (self.props.mode == "view" && actions.length == 1 && !false)
    return <a onClick={() => actions[0]()}>
      <div className={`${self.props.inline != undefined && self.props.inline ? "" : "model-content"} ${self.props.size == 'preview' ? 'model-content--preview' : ''}`}>
        {content}
      </div>
    </a>
  else
    return <div className={`${self.props.inline != undefined && self.props.inline ? "" : "model-content"} ${self.props.size == 'preview' ? 'model-content--preview' : ''}`}>
      {content}
    </div>
}

export function render_Lecture_Name_minimised(self:LectureContext) : JSX.Element {
      return !Permissions.can_view_Lecture_Name() ? null : <div className="model__attribute name">
  <label className="attribute-label attribute-label-name">{i18next.t(`Lecture:Name`, {context: self.props.inline ? "inline" : ""})}</label>
  <div className="model__attribute-content">
    { Components.String(
        self.props.is_editable && Permissions.can_edit_Lecture() && Permissions.can_edit_Lecture_Name(),
        self.props.mode,
        () => self.props.entity.Name,
        v => self.props.set_entity({...self.props.entity, Name:v})) } 
  </div>
</div>
      
}
        export function render_Lecture_Description_minimised(self:LectureContext) : JSX.Element {
      return null
}

export function render_Lecture_Name_maximised(self:LectureContext) : JSX.Element {
        return !Permissions.can_view_Lecture_Name() ? null : <div className="model__attribute name">
  <label className="attribute-label attribute-label-name">{i18next.t(`Lecture:Name`, {context: self.props.inline ? "inline" : ""})}</label>
  <div className="model__attribute-content">
    { Components.String(
        self.props.is_editable && Permissions.can_edit_Lecture() && Permissions.can_edit_Lecture_Name(),
        self.props.mode,
        () => self.props.entity.Name,
        v => self.props.set_entity({...self.props.entity, Name:v})) } 
  </div>
</div>
}
        export function render_Lecture_Description_maximised(self:LectureContext) : JSX.Element {
        return !Permissions.can_view_Lecture_Description() ? null : <div className="model__attribute description">
  <label className="attribute-label attribute-label-description">{i18next.t(`Lecture:Description`, {context: self.props.inline ? "inline" : ""})}</label>
  <div className="model__attribute-content">
    { Components.RichText(
        self.props.is_editable && Permissions.can_edit_Lecture() && Permissions.can_edit_Lecture_Description(),
        self.props.mode,
        () => self.props.entity.Description,
        v => self.props.set_entity({...self.props.entity, Description:v})) } 
  </div>
</div>
}

export function render_preview_Lecture(self:LectureContext) {
  let attributes:JSX.Element = null
  if (self.props.mode == "view" || !Permissions.can_edit_Lecture())
    attributes = (<div className="model__attributes">
      { render_Lecture_Name_minimised(self) }
        { render_Lecture_Description_minimised(self) }
    </div>)
  else
    attributes = render_editable_attributes_minimised_Lecture(self)
  return (<div className="block">
      {attributes}
    </div>)
}

export function render_large_Lecture(self:LectureContext) {
  let state = self.state()
  let attributes:JSX.Element = null
  if (self.props.mode == "view" || !Permissions.can_edit_Lecture())
    attributes = (<div className="model__attributes">
      { render_Lecture_Name_maximised(self) }
        { render_Lecture_Description_maximised(self) }
        
    </div>)
  else
    attributes = render_editable_attributes_maximised_Lecture(self)
  return (<div className="block">
      {self.props.nesting_depth == 0 && self.props.shown_relation != "all" && self.props.shown_relation != "none" ? null : attributes}
      {render_relations_Lecture(self)}
    </div>)
}


export function render_Lecture_Course_Lecture(self:LectureContext, context:"presentation_structure"|"default") {
  if ((context == "default" && self.props.shown_relation != "all" && self.props.shown_relation != "Course_Lecture") || !Permissions.can_view_Course())
    return null
  let state = self.state()
  return <div>
    
    { List.render_relation("lecture_course_lecture",
   "Lecture",
   "Course",
   "Courses",
   self.props.nesting_depth > 0,
   false,
   false,
   false)
  (
      state.Course != "loading" ?
        state.Course.IdsInServerOrder.map(id => state.Course != "loading" && state.Course.Items.get(id)):
        state.Course,
      Lecture_Course_Lecture_page_index(self),
      Lecture_Course_Lecture_num_pages(self),
      new_page_index => {
          let state = self.state()
          state.Course != "loading" &&
          self.setState({...self.state(),
            update_count:self.state().update_count+1,
            Course: {
              ...state.Course,
              PageIndex:new_page_index
            }
          }, () =>  load_relation_Lecture_Course_Lecture(self, false, ))
        },
      (i,_) => {
          let i_id = i.element.Id
          let state = self.state()
          return <div key={i_id}
            className={`model-nested__item ${i.size != "preview" ? "model-nested__item--open" : ""}
                        ${state.Course != "loading" && state.Course.JustCreated.has(i_id) && state.Course.JustCreated.get(i_id) ? "newly-created" : ""}` }
          
            >
            <div key={i_id}>
              {
                CourseViews.Course({
                  ...self.props,
                  entity:i.element,
                  inline:false,
                  nesting_depth:self.props.nesting_depth+1,
                  size: i.size,
                  allow_maximisation:true,
                  allow_fullscreen:true,
                  mode:self.props.mode == "edit" && (Permissions.can_edit_Course_Lecture()
                        || Permissions.can_create_Course_Lecture()
                        || Permissions.can_delete_Course_Lecture()) ?
                    self.props.mode : "view",
                  is_editable:state.Course != "loading" && state.Course.Editable.get(i_id),
                  shown_relation:i.shown_relation,
                  set_shown_relation:(new_shown_relation:string, callback) => {
                    let state = self.state()
                    state.Course != "loading" &&
                    self.setState({...self.state(),
                      Course:
                        {
                          ...state.Course,
                          Items:state.Course.Items.set(i_id,{...state.Course.Items.get(i_id), shown_relation:new_shown_relation})
                        }
                    }, callback)
                  },
                  nested_entity_names: self.props.nested_entity_names.push("Course"),
                  
                  set_size:(new_size:Utils.EntitySize, callback) => {
                    let new_shown_relation = new_size == "large" ? "all" : i.shown_relation
                    let state = self.state()
                    state.Course != "loading" &&
                    self.setState({...self.state(),
                      Course:
                        {
                          ...state.Course,
                          Items:state.Course.Items.set(i_id,
                            {...state.Course.Items.get(i_id),
                              size:new_size, shown_relation:new_shown_relation})
                        }
                    }, callback)
                  },
                    
                  toggle_button:undefined,
                  set_mode:undefined,
                  set_entity:(new_entity:Models.Course, callback?:()=>void, force_update_count_increment?:boolean) => {
                    let state = self.state()
                    state.Course != "loading" &&
                    self.setState({...self.state(),
                      dirty_Course:state.dirty_Course.set(i_id, new_entity),
                      update_count:force_update_count_increment ? self.state().update_count+1 : state.update_count,
                      Course:
                        {
                          ...state.Course,
                          Items:state.Course.Items.set(i_id,{...state.Course.Items.get(i_id), element:new_entity})
                        }
                    }, callback)
                  },
                  delete: undefined,
                  unlink: !Permissions.can_delete_Course_Lecture() ?
                    null
                    :
                    () => confirm(i18next.t('Are you sure?')) && Api.unlink_Course_Course_Lectures(i.element, self.props.entity).then(() =>
                      load_relation_Lecture_Course_Lecture(self, false, ))
                })
              }
            </div>
          </div>
        },
      () =>
        <div>
          {Permissions.can_create_Course() && Permissions.can_create_Course_Lecture() && Lecture_Course_Lecture_can_create(self) ? render_new_Lecture_Course_Lecture(self) : null}
          {Permissions.can_create_Course_Lecture() ? render_add_existing_Lecture_Course_Lecture(self) : null}
        </div>)
    }
    
    </div>
}



export function render_relations_Lecture(self:LectureContext) {
  return <div className="relations">
      
      
    </div>
}

export function render_add_existing_Lecture_Course_Lecture(self:LectureContext) {
    
    let state = self.state()
    return self.props.mode == "edit" ?
      <div className="button__actions">
        {
          state.add_step_Course != "open" ?
            <Buttons.Add disabled={state.Course == "loading" ? true : state.Course.TotalCount >= 1} 
              onClick={() =>
                self.setState({...self.state(), add_step_Course:"open"}) }
                  target_name={"Course"} />
          :
          React.createElement(List.AddToRelation,
            {
              relation_name:"lecture_course_lecture",
              source_name:"Lecture",
              target_name:"Course",
              target_plural:"Courses",
              page_size:25,
              render_target:(i,i_id) =>
                <div key={i_id} className="group__item">
                  <a className="group__button button button--existing"
                    onClick={() =>
                        self.setState({...self.state(), add_step_Course:"saving"}, () =>
                          Api.link_Lecture_Course_Lectures(self.props.entity, i).then(() =>
                            self.setState({...self.state(), add_step_Course:"closed"}, () =>
                              load_relation_Lecture_Course_Lecture(self, false, ))))
                      }>
                      Add existing
                  </a>
                  <div className="group__title" disabled={true}>
                    {
                      CourseViews.Course({
                        ...self.props,
                        entity:i,
                        nesting_depth:self.props.nesting_depth+1,
                        size:"preview",
                        mode:"view",
                        is_editable:false,
                        nested_entity_names: self.props.nested_entity_names.push("Course"),
                        set_size:undefined,
                        toggle_button:undefined,
                        set_mode:undefined,
                        set_entity:(new_entity:Models.Course, callback?:()=>void) => {},
                        unlink: undefined,
                        delete: undefined
                      })
                    }
                  </div>
                </div>,
              cancel:() => self.setState({...self.state(), add_step_Course:"closed"}),
              get_items:[
                { name: "Course", get: async(i,s) => Api.get_unlinked_Lecture_Course_Lectures(self.props.entity, i, s) },
              ]
            })
        }
      </div>
    :
      null
    }
  

export function render_new_Lecture_Course_Lecture(self:LectureContext) {
    let state = self.state()
    return  self.props.mode == "edit" ?
      <div className="button__actions">
        <div className="new-course">
              <button disabled={state.Course == "loading" ? true : state.Course.TotalCount >= 1} 
                      className="new-course button button--new"
                      onClick={() =>
                          Api.create_linked_Lecture_Course_Lectures_Course(self.props.entity).then(e => {
                              e.length > 0 &&
                              Api.update_Course(
                                ({ ...e[0], Name:"", Points:0 } as Models.Course)).then(() =>
                                load_relation_Lecture_Course_Lecture(self, true, () =>
                                    self.setState({...self.state(), add_step_Course:"closed"})
                                  )
                                )
                          })
                      }>
                  {i18next.t('Create new Course')}
              </button>
            </div>
        </div>
      :
      null
    }
  

export function render_saving_animations_Lecture(self:LectureContext) {
  return self.state().dirty_Course.count() > 0 ?
    <div style={{position:"fixed", zIndex:10000, top:0, left:0, width:"20px", height:"20px", backgroundColor:"red"}} className="saving"/>
    : <div style={{position:"fixed", zIndex:10000, top:0, left:0, width:"20px", height:"20px", backgroundColor:"cornflowerblue"}} className="saved"/>
}

export type LectureContext = {state:()=>LectureState, props:Utils.EntityComponentProps<Models.Lecture>, setState:(new_state:LectureState, callback?:()=>void) => void}

export type LectureState = {
    update_count:number
    add_step_Course:"closed"|"open"|"saving",
      dirty_Course:Immutable.Map<number,Models.Course>,
      Course:Utils.PaginatedItems<{ shown_relation: string } & Utils.EntityAndSize<Models.Course>>|"loading"
  }
export class LectureComponent extends React.Component<Utils.EntityComponentProps<Models.Lecture>, LectureState> {
  constructor(props:Utils.EntityComponentProps<Models.Lecture>, context:any) {
    super(props, context)
    this.state = { update_count:0,add_step_Course:"closed", dirty_Course:Immutable.Map<number,Models.Course>(), Course:"loading" }
  }

  get_self() {
    return {state:() => this.state, props:this.props, setState:(ns,c)=>this.setState(ns,c)}
  }

  componentWillReceiveProps(new_props:Utils.EntityComponentProps<Models.Lecture>) {
    if (new_props.size == "breadcrumb") return
    let current_logged_in_entity =  null
    let new_logged_in_entity =  null
    if (new_props.mode != this.props.mode || (new_props.size != this.props.size && (new_props.size == "large" || new_props.size == "fullscreen")) ||
        new_props.logic_frame != this.props.logic_frame ||
        (current_logged_in_entity && !new_logged_in_entity) ||
        (!current_logged_in_entity && new_logged_in_entity) ||
        (current_logged_in_entity && new_logged_in_entity && current_logged_in_entity.Id != new_logged_in_entity.Id)) {
      load_relations_Lecture(this.get_self(),  )
    }
  }

  thread:number = null
  componentWillMount() {
    if (this.props.size == "breadcrumb") return
    if (this.props.size != "preview") {
      
      load_relations_Lecture(this.get_self(), )
    }

    this.thread = setInterval(() => {
      if (this.state.dirty_Course.count() > 0) {
         let first = this.state.dirty_Course.first()
         this.setState({...this.state, dirty_Course: this.state.dirty_Course.remove(first.Id)}, () =>
           Api.update_Course(first)
         )
       }

    }, 500)
  }

  componentWillUnmount() {
    clearInterval(this.thread)
  }

  render() {
    if (this.props.size == "breadcrumb") {
      return Permissions.can_view_Lecture() ?
              render_breadcrumb_Lecture(this.get_self())
              : null
    }

    return <div id={`Lecture_${this.props.entity.Id.toString()}_${this.state.update_count}`} className={`model lecture`}>
      { render_saving_animations_Lecture(this.get_self()) }
      { this.props.nesting_depth == 0 ? render_menu_Lecture(this.get_self()) : null }
      <div className="content" >
        {
          this.props.nesting_depth == 0 && !!this.props.toggle_button ?
          <div className="topbar">
            { this.props.breadcrumbs() }
            <div className="topbar__buttons">
              
                {this.props.toggle_button ? this.props.toggle_button() : null}
              { this.props.authentication_menu() }
            </div>
          </div>
          :
          null
        }
        { this.props.nesting_depth == 0 ? render_local_menu_Lecture(this.get_self()) : null }
        { render_controls_Lecture(this.get_self()) }
        { render_content_Lecture(this.get_self()) }
      </div>
    </div>
  }
}

export let Lecture = (props:Utils.EntityComponentProps<Models.Lecture>) : JSX.Element =>
  <LectureComponent {...props} />

export let Lecture_to_page = (id:number) => {
  let can_edit = Utils.any_of([Permissions.can_edit_Lecture, Permissions.can_edit_Course_Lecture, Permissions.can_edit_Course])
  return Utils.scene_to_page<Models.Lecture>(can_edit, Lecture, Api.get_Lecture(id), Api.update_Lecture, "Lecture", "Lecture", `/Lectures/${id}`)
}

export let Lecture_to = (id:number, target_element_id:string, ) => {
  Utils.render_page_manager(target_element_id,
    Lecture_to_page(id),
    
  )
}
