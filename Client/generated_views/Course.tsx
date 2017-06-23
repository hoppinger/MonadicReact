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
import * as LectureViews from './Lecture'
import * as CustomViews from '../custom_views'

export function Course_HomePage_Course_can_create(self:CourseContext) {
  let state = self.state()
  return state.HomePage == "loading" ? false : state.HomePage.CanCreate
}
export function Course_Course_Lecture_can_create(self:CourseContext) {
  let state = self.state()
  return state.Lecture == "loading" ? false : state.Lecture.CanCreate
}
export function Course_HomePage_Course_can_delete(self:CourseContext) {
  let state = self.state()
  return state.HomePage == "loading" ? false : state.HomePage.CanDelete
}
export function Course_Course_Lecture_can_delete(self:CourseContext) {
  let state = self.state()
  return state.Lecture == "loading" ? false : state.Lecture.CanDelete
}
export function Course_HomePage_Course_page_index(self:CourseContext) {
  let state = self.state()
  return state.HomePage == "loading" ? 0 : state.HomePage.PageIndex
}
export function Course_Course_Lecture_page_index(self:CourseContext) {
  let state = self.state()
  return state.Lecture == "loading" ? 0 : state.Lecture.PageIndex
}
export function Course_HomePage_Course_page_size(self:CourseContext) {
  let state = self.state()
  return state.HomePage == "loading" ? 25 : state.HomePage.PageSize
}
export function Course_Course_Lecture_page_size(self:CourseContext) {
  let state = self.state()
  return state.Lecture == "loading" ? 25 : state.Lecture.PageSize
}
export function Course_HomePage_Course_search_query(self:CourseContext) {
  let state = self.state()
  return state.HomePage == "loading" ? null : state.HomePage.SearchQuery
}
export function Course_Course_Lecture_search_query(self:CourseContext) {
  let state = self.state()
  return state.Lecture == "loading" ? null : state.Lecture.SearchQuery
}
export function Course_HomePage_Course_num_pages(self:CourseContext) {
  let state = self.state()
  return state.HomePage == "loading" ? 1 : state.HomePage.NumPages
}
export function Course_Course_Lecture_num_pages(self:CourseContext) {
  let state = self.state()
  return state.Lecture == "loading" ? 1 : state.Lecture.NumPages
}

export function load_relation_Course_HomePage_Course(self:CourseContext, force_first_page:boolean, callback?:()=>void) {
  let state = self.state()
  let prelude = force_first_page && state.HomePage != "loading" ?
    (c:() => void) => state.HomePage != "loading" && self.setState({
      ...state,
      HomePage: {...state.HomePage, PageIndex:0 }
    }, c)
    :
    (c:() => void) => c()
  Permissions.can_view_HomePage() ?
    prelude(() =>
      Api.get_Course_HomePage_Courses(self.props.entity, Course_HomePage_Course_page_index(self), Course_HomePage_Course_page_size(self), Course_HomePage_Course_search_query(self)).then(HomePages =>
        self.setState({...self.state(), update_count:self.state().update_count+1,
            HomePage:Utils.raw_page_to_paginated_items<Models.HomePage, Utils.EntityAndSize<Models.HomePage> & { shown_relation:string }>((i, i_just_created) => {
              let state = self.state()
              return {
                element:i,
                size: state.HomePage != "loading" ?
                  (state.HomePage.Items.has(i.Id) ?
                    state.HomePage.Items.get(i.Id).size
                  :
                    "preview" /* i_just_created ? "large" : "preview" */)
                  :
                    "preview" /* i_just_created ? "large" : "preview" */,
                shown_relation:"all"}}, HomePages)
            }, callback)))
    :
      prelude(() => callback && callback())
}

export function load_relation_Course_Course_Lecture(self:CourseContext, force_first_page:boolean, callback?:()=>void) {
  let state = self.state()
  let prelude = force_first_page && state.Lecture != "loading" ?
    (c:() => void) => state.Lecture != "loading" && self.setState({
      ...state,
      Lecture: {...state.Lecture, PageIndex:0 }
    }, c)
    :
    (c:() => void) => c()
  Permissions.can_view_Lecture() ?
    prelude(() =>
      Api.get_Course_Course_Lectures(self.props.entity, Course_Course_Lecture_page_index(self), Course_Course_Lecture_page_size(self), Course_Course_Lecture_search_query(self)).then(Lectures =>
        self.setState({...self.state(), update_count:self.state().update_count+1,
            Lecture:Utils.raw_page_to_paginated_items<Models.Lecture, Utils.EntityAndSize<Models.Lecture> & { shown_relation:string }>((i, i_just_created) => {
              let state = self.state()
              return {
                element:i,
                size: state.Lecture != "loading" ?
                  (state.Lecture.Items.has(i.Id) ?
                    state.Lecture.Items.get(i.Id).size
                  :
                    "preview" /* i_just_created ? "large" : "preview" */)
                  :
                    "preview" /* i_just_created ? "large" : "preview" */,
                shown_relation:"all"}}, Lectures)
            }, callback)))
    :
      prelude(() => callback && callback())
}

export function load_relations_Course(self, callback?:()=>void) {
  load_relation_Course_Course_Lecture(self, false, 
        () => load_relation_Course_HomePage_Course(self, false, 
        () => callback && callback()))
}

export function set_size_Course(self:CourseContext, new_size:Utils.EntitySize) {
  self.props.set_size(new_size, () => {
    if (new_size == "fullscreen")
      self.props.push(Course_to_page(self.props.entity.Id))
  })
}

export function render_Course_Name_editable_minimised(self:CourseContext) : JSX.Element {
  if (!Permissions.can_edit_Course()) return render_Course_Name_minimised(self)
  else
    return !Permissions.can_view_Course_Name() ? <div /> :
          <div className="model__attribute name">
  <label className="attribute-label attribute-label-name">{i18next.t(`Course:Name`, {context: self.props.inline ? "inline" : ""})}</label>
  <div className="model__attribute-content">
    { Components.Title(
        self.props.is_editable && Permissions.can_edit_Course() && Permissions.can_edit_Course_Name(),
        self.props.mode,
        () => self.props.entity.Name,
        v => self.props.set_entity({...self.props.entity, Name:v})) } 
  </div>
</div>
}

export function render_Course_Points_editable_minimised(self:CourseContext) : JSX.Element {
  if (!Permissions.can_edit_Course()) return render_Course_Points_minimised(self)
  else
    return !Permissions.can_view_Course_Points() ? <div /> :
          <div className="model__attribute points">
  <label className="attribute-label attribute-label-points">{i18next.t(`Course:Points`, {context: self.props.inline ? "inline" : ""})}</label>
  <div className="model__attribute-content">
    { Components.Number(
        self.props.is_editable && Permissions.can_edit_Course() && Permissions.can_edit_Course_Points(),
        self.props.mode,
        () => self.props.entity.Points,
        v => self.props.set_entity({...self.props.entity, Points:v})) } 
  </div>
</div>
}


export function render_Course_Name_editable_maximised(self:CourseContext) : JSX.Element {
  if (!Permissions.can_edit_Course()) return render_Course_Name_maximised(self)
  else
    return !Permissions.can_view_Course_Name() ? <div /> :
          <div className="model__attribute name">
  <label className="attribute-label attribute-label-name">{i18next.t(`Course:Name`, {context: self.props.inline ? "inline" : ""})}</label>
  <div className="model__attribute-content">
    { Components.Title(
        self.props.is_editable && Permissions.can_edit_Course() && Permissions.can_edit_Course_Name(),
        self.props.mode,
        () => self.props.entity.Name,
        v => self.props.set_entity({...self.props.entity, Name:v})) } 
  </div>
</div>
}

export function render_Course_Points_editable_maximised(self:CourseContext) : JSX.Element {
  if (!Permissions.can_edit_Course()) return render_Course_Points_maximised(self)
  else
    return !Permissions.can_view_Course_Points() ? <div /> :
          <div className="model__attribute points">
  <label className="attribute-label attribute-label-points">{i18next.t(`Course:Points`, {context: self.props.inline ? "inline" : ""})}</label>
  <div className="model__attribute-content">
    { Components.Number(
        self.props.is_editable && Permissions.can_edit_Course() && Permissions.can_edit_Course_Points(),
        self.props.mode,
        () => self.props.entity.Points,
        v => self.props.set_entity({...self.props.entity, Points:v})) } 
  </div>
</div>
}


export function render_editable_attributes_minimised_Course(self:CourseContext) {
  let attributes = (<div>
      {render_Course_Name_editable_minimised(self)}
        {render_Course_Points_editable_minimised(self)}
    </div>)
  return attributes
}

export function render_editable_attributes_maximised_Course(self:CourseContext) {
    let state = self.state()
    let attributes = (<div>
        {render_Course_Name_editable_maximised(self)}
        {render_Course_Points_editable_maximised(self)}
        
        
        
      </div>)
    return attributes
  }

export function render_breadcrumb_Course(self:CourseContext) {
  return <div className="breadcrumb-course">Course</div>
}

export function render_menu_Course(self:CourseContext) {
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
                  <div className={`menu_entry active`}>
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

export function render_local_menu_Course(self:CourseContext) {
  let state = self.state()
  return <div className="local-menu">
          <div className="local_menu_entries">
            <div className={`local_menu_entry${self.props.shown_relation == "none" ? " local_menu_entry--active" : ""}`}>
              <a onClick={() =>
                  self.props.set_shown_relation("none")
              }>
                {i18next.t('About this Course')}
              </a>
            </div>
          
            {!Permissions.can_view_Lecture() ? null :
                  <div key={"Course_Lecture"} className={`local_menu_entry${self.props.shown_relation == "Course_Lecture" ? " local_menu_entry--active" : ""}`}>
                    <a onClick={() =>
                      load_relation_Course_Course_Lecture(self,
                        false,
                        
                        () => self.props.set_shown_relation("Course_Lecture"))
                    }>
                      {i18next.t('Course_Lectures')}
                    </a>
                  </div>
                }  
          </div>
        </div>
}

export function render_controls_Course(self:CourseContext) {
  return <div className="control">
    {self.props.allow_maximisation && self.props.set_size ? <a className={`"course button button--toggle ${self.props.size != 'preview' ? 'button--toggle--open' : ''}`}
          onClick={() => {
            set_size_Course(self, self.props.size == "preview" ? "large" : "preview")}
          }>
      </a> : null}
    {Permissions.can_delete_Course() && self.props.size == "fullscreen" ? <a className="button button--delete"
      onClick={() => confirm(i18next.t('Are you sure?')) &&
        Api.delete_Course(self.props.entity).then(() => self.props.force_reload(() => self.props.pop()))
      }>
    </a> : null}
    {self.props.size == "fullscreen" && self.props.pages_count > 0 ? <a className="course button button--close"
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

export function render_content_Course(self:CourseContext) {
  let actions:Array<()=>void> =
    [
      self.props.allow_maximisation && self.props.set_size && self.props.size == "preview" ?
        () => set_size_Course(self, self.props.size == "preview" ? "large" : "preview")
      :
        null,
    ].filter(a => a != null)
  let content =
    Permissions.can_view_Course() ?
      self.props.size == "preview" ?
        render_preview_Course(self)
      : self.props.size == "large" ?
        render_large_Course(self)
      : self.props.size == "fullscreen" ?
        render_large_Course(self)
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

export function render_Course_Name_minimised(self:CourseContext) : JSX.Element {
      return !Permissions.can_view_Course_Name() ? null : <div className="model__attribute name">
  <label className="attribute-label attribute-label-name">{i18next.t(`Course:Name`, {context: self.props.inline ? "inline" : ""})}</label>
  <div className="model__attribute-content">
    { Components.Title(
        self.props.is_editable && Permissions.can_edit_Course() && Permissions.can_edit_Course_Name(),
        self.props.mode,
        () => self.props.entity.Name,
        v => self.props.set_entity({...self.props.entity, Name:v})) } 
  </div>
</div>
      
}
        export function render_Course_Points_minimised(self:CourseContext) : JSX.Element {
      return !Permissions.can_view_Course_Points() ? null : <div className="model__attribute points">
  <label className="attribute-label attribute-label-points">{i18next.t(`Course:Points`, {context: self.props.inline ? "inline" : ""})}</label>
  <div className="model__attribute-content">
    { Components.Number(
        self.props.is_editable && Permissions.can_edit_Course() && Permissions.can_edit_Course_Points(),
        self.props.mode,
        () => self.props.entity.Points,
        v => self.props.set_entity({...self.props.entity, Points:v})) } 
  </div>
</div>
      
}

export function render_Course_Name_maximised(self:CourseContext) : JSX.Element {
        return !Permissions.can_view_Course_Name() ? null : <div className="model__attribute name">
  <label className="attribute-label attribute-label-name">{i18next.t(`Course:Name`, {context: self.props.inline ? "inline" : ""})}</label>
  <div className="model__attribute-content">
    { Components.Title(
        self.props.is_editable && Permissions.can_edit_Course() && Permissions.can_edit_Course_Name(),
        self.props.mode,
        () => self.props.entity.Name,
        v => self.props.set_entity({...self.props.entity, Name:v})) } 
  </div>
</div>
}
        export function render_Course_Points_maximised(self:CourseContext) : JSX.Element {
        return !Permissions.can_view_Course_Points() ? null : <div className="model__attribute points">
  <label className="attribute-label attribute-label-points">{i18next.t(`Course:Points`, {context: self.props.inline ? "inline" : ""})}</label>
  <div className="model__attribute-content">
    { Components.Number(
        self.props.is_editable && Permissions.can_edit_Course() && Permissions.can_edit_Course_Points(),
        self.props.mode,
        () => self.props.entity.Points,
        v => self.props.set_entity({...self.props.entity, Points:v})) } 
  </div>
</div>
}

export function render_preview_Course(self:CourseContext) {
  let attributes:JSX.Element = null
  if (self.props.mode == "view" || !Permissions.can_edit_Course())
    attributes = (<div className="model__attributes">
      { render_Course_Name_minimised(self) }
        { render_Course_Points_minimised(self) }
    </div>)
  else
    attributes = render_editable_attributes_minimised_Course(self)
  return (<div className="block">
      {attributes}
    </div>)
}

export function render_large_Course(self:CourseContext) {
  let state = self.state()
  let attributes:JSX.Element = null
  if (self.props.mode == "view" || !Permissions.can_edit_Course())
    attributes = (<div className="model__attributes">
      { render_Course_Name_maximised(self) }
        { render_Course_Points_maximised(self) }
        
    </div>)
  else
    attributes = render_editable_attributes_maximised_Course(self)
  return (<div className="block">
      {self.props.nesting_depth == 0 && self.props.shown_relation != "all" && self.props.shown_relation != "none" ? null : attributes}
      {render_relations_Course(self)}
    </div>)
}


export function render_Course_HomePage_Course(self:CourseContext, context:"presentation_structure"|"default") {
  if ((context == "default" && self.props.shown_relation != "all" && self.props.shown_relation != "HomePage_Course") || !Permissions.can_view_HomePage())
    return null
  let state = self.state()
  return <div>
    
    { List.render_relation("course_homepage_course",
   "Course",
   "HomePage",
   "HomePages",
   self.props.nesting_depth > 0,
   false,
   false,
   false)
  (
      state.HomePage != "loading" ?
        state.HomePage.IdsInServerOrder.map(id => state.HomePage != "loading" && state.HomePage.Items.get(id)):
        state.HomePage,
      Course_HomePage_Course_page_index(self),
      Course_HomePage_Course_num_pages(self),
      new_page_index => {
          let state = self.state()
          state.HomePage != "loading" &&
          self.setState({...self.state(),
            update_count:self.state().update_count+1,
            HomePage: {
              ...state.HomePage,
              PageIndex:new_page_index
            }
          }, () =>  load_relation_Course_HomePage_Course(self, false, ))
        },
      (i,_) => {
          let i_id = i.element.Id
          let state = self.state()
          return <div key={i_id}
            className={`model-nested__item ${i.size != "preview" ? "model-nested__item--open" : ""}
                        ${state.HomePage != "loading" && state.HomePage.JustCreated.has(i_id) && state.HomePage.JustCreated.get(i_id) ? "newly-created" : ""}` }
          
            >
            <div key={i_id}>
              {
                HomePageViews.HomePage({
                  ...self.props,
                  entity:i.element,
                  inline:false,
                  nesting_depth:self.props.nesting_depth+1,
                  size: i.size,
                  allow_maximisation:true,
                  allow_fullscreen:true,
                  mode:self.props.mode == "edit" && (Permissions.can_edit_HomePage_Course()
                        || Permissions.can_create_HomePage_Course()
                        || Permissions.can_delete_HomePage_Course()) ?
                    self.props.mode : "view",
                  is_editable:state.HomePage != "loading" && state.HomePage.Editable.get(i_id),
                  shown_relation:i.shown_relation,
                  set_shown_relation:(new_shown_relation:string, callback) => {
                    let state = self.state()
                    state.HomePage != "loading" &&
                    self.setState({...self.state(),
                      HomePage:
                        {
                          ...state.HomePage,
                          Items:state.HomePage.Items.set(i_id,{...state.HomePage.Items.get(i_id), shown_relation:new_shown_relation})
                        }
                    }, callback)
                  },
                  nested_entity_names: self.props.nested_entity_names.push("HomePage"),
                  
                  set_size:(new_size:Utils.EntitySize, callback) => {
                    let new_shown_relation = new_size == "large" ? "all" : i.shown_relation
                    let state = self.state()
                    state.HomePage != "loading" &&
                    self.setState({...self.state(),
                      HomePage:
                        {
                          ...state.HomePage,
                          Items:state.HomePage.Items.set(i_id,
                            {...state.HomePage.Items.get(i_id),
                              size:new_size, shown_relation:new_shown_relation})
                        }
                    }, callback)
                  },
                    
                  toggle_button:undefined,
                  set_mode:undefined,
                  set_entity:(new_entity:Models.HomePage, callback?:()=>void, force_update_count_increment?:boolean) => {
                    let state = self.state()
                    state.HomePage != "loading" &&
                    self.setState({...self.state(),
                      dirty_HomePage:state.dirty_HomePage.set(i_id, new_entity),
                      update_count:force_update_count_increment ? self.state().update_count+1 : state.update_count,
                      HomePage:
                        {
                          ...state.HomePage,
                          Items:state.HomePage.Items.set(i_id,{...state.HomePage.Items.get(i_id), element:new_entity})
                        }
                    }, callback)
                  },
                  unlink: undefined,
                    delete: !Permissions.can_delete_HomePage() || !Course_HomePage_Course_can_delete(self) ?
                    null
                    :
                    () => confirm(i18next.t('Are you sure?')) && Api.delete_HomePage(i.element).then(() =>
                      load_relation_Course_HomePage_Course(self, false, ))
                })
              }
            </div>
          </div>
        },
      () =>
        <div>
          
          
        </div>)
    }
    
    </div>
}


export function render_Course_Course_Lecture(self:CourseContext, context:"presentation_structure"|"default") {
  if ((context == "default" && self.props.shown_relation != "all" && self.props.shown_relation != "Course_Lecture") || !Permissions.can_view_Lecture())
    return null
  let state = self.state()
  return <div>
    
    { List.render_relation("course_course_lecture",
   "Course",
   "Lecture",
   "Lectures",
   self.props.nesting_depth > 0,
   false,
   false,
   false)
  (
      state.Lecture != "loading" ?
        state.Lecture.IdsInServerOrder.map(id => state.Lecture != "loading" && state.Lecture.Items.get(id)):
        state.Lecture,
      Course_Course_Lecture_page_index(self),
      Course_Course_Lecture_num_pages(self),
      new_page_index => {
          let state = self.state()
          state.Lecture != "loading" &&
          self.setState({...self.state(),
            update_count:self.state().update_count+1,
            Lecture: {
              ...state.Lecture,
              PageIndex:new_page_index
            }
          }, () =>  load_relation_Course_Course_Lecture(self, false, ))
        },
      (i,_) => {
          let i_id = i.element.Id
          let state = self.state()
          return <div key={i_id}
            className={`model-nested__item ${i.size != "preview" ? "model-nested__item--open" : ""}
                        ${state.Lecture != "loading" && state.Lecture.JustCreated.has(i_id) && state.Lecture.JustCreated.get(i_id) ? "newly-created" : ""}` }
          
            >
            <div key={i_id}>
              {
                LectureViews.Lecture({
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
                  is_editable:state.Lecture != "loading" && state.Lecture.Editable.get(i_id),
                  shown_relation:i.shown_relation,
                  set_shown_relation:(new_shown_relation:string, callback) => {
                    let state = self.state()
                    state.Lecture != "loading" &&
                    self.setState({...self.state(),
                      Lecture:
                        {
                          ...state.Lecture,
                          Items:state.Lecture.Items.set(i_id,{...state.Lecture.Items.get(i_id), shown_relation:new_shown_relation})
                        }
                    }, callback)
                  },
                  nested_entity_names: self.props.nested_entity_names.push("Lecture"),
                  
                  set_size:(new_size:Utils.EntitySize, callback) => {
                    let new_shown_relation = new_size == "large" ? "all" : i.shown_relation
                    let state = self.state()
                    state.Lecture != "loading" &&
                    self.setState({...self.state(),
                      Lecture:
                        {
                          ...state.Lecture,
                          Items:state.Lecture.Items.set(i_id,
                            {...state.Lecture.Items.get(i_id),
                              size:new_size, shown_relation:new_shown_relation})
                        }
                    }, callback)
                  },
                    
                  toggle_button:undefined,
                  set_mode:undefined,
                  set_entity:(new_entity:Models.Lecture, callback?:()=>void, force_update_count_increment?:boolean) => {
                    let state = self.state()
                    state.Lecture != "loading" &&
                    self.setState({...self.state(),
                      dirty_Lecture:state.dirty_Lecture.set(i_id, new_entity),
                      update_count:force_update_count_increment ? self.state().update_count+1 : state.update_count,
                      Lecture:
                        {
                          ...state.Lecture,
                          Items:state.Lecture.Items.set(i_id,{...state.Lecture.Items.get(i_id), element:new_entity})
                        }
                    }, callback)
                  },
                  unlink: undefined,
                  delete: !Permissions.can_delete_Course_Lecture() ?
                    null
                    :
                    () => confirm(i18next.t('Are you sure?')) && Api.unlink_Course_Course_Lectures(self.props.entity, i.element).then(() =>
                      load_relation_Course_Course_Lecture(self, false, ))
                })
              }
            </div>
          </div>
        },
      () =>
        <div>
          {Permissions.can_create_Lecture() && Permissions.can_create_Course_Lecture() && Course_Course_Lecture_can_create(self) ? render_new_Course_Course_Lecture(self) : null}
          {Permissions.can_create_Course_Lecture() ? render_add_existing_Course_Course_Lecture(self) : null}
        </div>)
    }
    
    </div>
}



export function render_relations_Course(self:CourseContext) {
  return <div className="relations">
      { render_Course_Course_Lecture(self, "default") }
      
    </div>
}

export function render_add_existing_Course_Course_Lecture(self:CourseContext) {
    
    let state = self.state()
    return self.props.mode == "edit" ?
      <div className="button__actions">
        {
          state.add_step_Lecture != "open" ?
            <Buttons.Add 
              onClick={() =>
                self.setState({...self.state(), add_step_Lecture:"open"}) }
                  target_name={"Lecture"} />
          :
          React.createElement(List.AddToRelation,
            {
              relation_name:"course_course_lecture",
              source_name:"Course",
              target_name:"Lecture",
              target_plural:"Lectures",
              page_size:25,
              render_target:(i,i_id) =>
                <div key={i_id} className="group__item">
                  <a className="group__button button button--existing"
                    onClick={() =>
                        self.setState({...self.state(), add_step_Lecture:"saving"}, () =>
                          Api.link_Course_Course_Lectures(self.props.entity, i).then(() =>
                            self.setState({...self.state(), add_step_Lecture:"closed"}, () =>
                              load_relation_Course_Course_Lecture(self, false, ))))
                      }>
                      Add existing
                  </a>
                  <div className="group__title" disabled={true}>
                    {
                      LectureViews.Lecture({
                        ...self.props,
                        entity:i,
                        nesting_depth:self.props.nesting_depth+1,
                        size:"preview",
                        mode:"view",
                        is_editable:false,
                        nested_entity_names: self.props.nested_entity_names.push("Lecture"),
                        set_size:undefined,
                        toggle_button:undefined,
                        set_mode:undefined,
                        set_entity:(new_entity:Models.Lecture, callback?:()=>void) => {},
                        unlink: undefined,
                        delete: undefined
                      })
                    }
                  </div>
                </div>,
              cancel:() => self.setState({...self.state(), add_step_Lecture:"closed"}),
              get_items:[
                { name: "Lecture", get: async(i,s) => Api.get_unlinked_Course_Course_Lectures(self.props.entity, i, s) },
              ]
            })
        }
      </div>
    :
      null
    }
  

export function render_new_Course_Course_Lecture(self:CourseContext) {
    let state = self.state()
    return  self.props.mode == "edit" ?
      <div className="button__actions">
        <div className="new-lecture">
              <button 
                      className="new-lecture button button--new"
                      onClick={() =>
                          Api.create_linked_Course_Course_Lectures_Lecture(self.props.entity).then(e => {
                              e.length > 0 &&
                              Api.update_Lecture(
                                ({ ...e[0], Name:"", Description:null } as Models.Lecture)).then(() =>
                                load_relation_Course_Course_Lecture(self, true, () =>
                                    self.setState({...self.state(), add_step_Lecture:"closed"})
                                  )
                                )
                          })
                      }>
                  {i18next.t('Create new Lecture')}
              </button>
            </div>
        </div>
      :
      null
    }
  

export function render_saving_animations_Course(self:CourseContext) {
  return self.state().dirty_HomePage.count() > 0 ?
    <div style={{position:"fixed", zIndex:10000, top:0, left:0, width:"20px", height:"20px", backgroundColor:"red"}} className="saving"/> : 
    self.state().dirty_Lecture.count() > 0 ?
    <div style={{position:"fixed", zIndex:10000, top:0, left:0, width:"20px", height:"20px", backgroundColor:"red"}} className="saving"/>
    : <div style={{position:"fixed", zIndex:10000, top:0, left:0, width:"20px", height:"20px", backgroundColor:"cornflowerblue"}} className="saved"/>
}

export type CourseContext = {state:()=>CourseState, props:Utils.EntityComponentProps<Models.Course>, setState:(new_state:CourseState, callback?:()=>void) => void}

export type CourseState = {
    update_count:number
    add_step_HomePage:"closed"|"open"|"saving",
      dirty_HomePage:Immutable.Map<number,Models.HomePage>,
      HomePage:Utils.PaginatedItems<{ shown_relation: string } & Utils.EntityAndSize<Models.HomePage>>|"loading"
  add_step_Lecture:"closed"|"open"|"saving",
      dirty_Lecture:Immutable.Map<number,Models.Lecture>,
      Lecture:Utils.PaginatedItems<{ shown_relation: string } & Utils.EntityAndSize<Models.Lecture>>|"loading"
  }
export class CourseComponent extends React.Component<Utils.EntityComponentProps<Models.Course>, CourseState> {
  constructor(props:Utils.EntityComponentProps<Models.Course>, context:any) {
    super(props, context)
    this.state = { update_count:0,add_step_HomePage:"closed", dirty_HomePage:Immutable.Map<number,Models.HomePage>(), HomePage:"loading", add_step_Lecture:"closed", dirty_Lecture:Immutable.Map<number,Models.Lecture>(), Lecture:"loading" }
  }

  get_self() {
    return {state:() => this.state, props:this.props, setState:(ns,c)=>this.setState(ns,c)}
  }

  componentWillReceiveProps(new_props:Utils.EntityComponentProps<Models.Course>) {
    if (new_props.size == "breadcrumb") return
    let current_logged_in_entity =  null
    let new_logged_in_entity =  null
    if (new_props.mode != this.props.mode || (new_props.size != this.props.size && (new_props.size == "large" || new_props.size == "fullscreen")) ||
        new_props.logic_frame != this.props.logic_frame ||
        (current_logged_in_entity && !new_logged_in_entity) ||
        (!current_logged_in_entity && new_logged_in_entity) ||
        (current_logged_in_entity && new_logged_in_entity && current_logged_in_entity.Id != new_logged_in_entity.Id)) {
      load_relations_Course(this.get_self(),  )
    }
  }

  thread:number = null
  componentWillMount() {
    if (this.props.size == "breadcrumb") return
    if (this.props.size != "preview") {
      
      load_relations_Course(this.get_self(), )
    }

    this.thread = setInterval(() => {
      if (this.state.dirty_HomePage.count() > 0) {
         let first = this.state.dirty_HomePage.first()
         this.setState({...this.state, dirty_HomePage: this.state.dirty_HomePage.remove(first.Id)}, () =>
           Api.update_HomePage(first)
         )
       } else if (this.state.dirty_Lecture.count() > 0) {
         let first = this.state.dirty_Lecture.first()
         this.setState({...this.state, dirty_Lecture: this.state.dirty_Lecture.remove(first.Id)}, () =>
           Api.update_Lecture(first)
         )
       }

    }, 500)
  }

  componentWillUnmount() {
    clearInterval(this.thread)
  }

  render() {
    if (this.props.size == "breadcrumb") {
      return Permissions.can_view_Course() ?
              render_breadcrumb_Course(this.get_self())
              : null
    }

    return <div id={`Course_${this.props.entity.Id.toString()}_${this.state.update_count}`} className={`model course`}>
      { render_saving_animations_Course(this.get_self()) }
      { this.props.nesting_depth == 0 ? render_menu_Course(this.get_self()) : null }
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
        { this.props.nesting_depth == 0 ? render_local_menu_Course(this.get_self()) : null }
        { render_controls_Course(this.get_self()) }
        { render_content_Course(this.get_self()) }
      </div>
    </div>
  }
}

export let Course = (props:Utils.EntityComponentProps<Models.Course>) : JSX.Element =>
  <CourseComponent {...props} />

export let Course_to_page = (id:number) => {
  let can_edit = Utils.any_of([Permissions.can_edit_Course, Permissions.can_edit_HomePage_Course, Permissions.can_edit_Course_Lecture, Permissions.can_edit_HomePage, Permissions.can_edit_Lecture])
  return Utils.scene_to_page<Models.Course>(can_edit, Course, Api.get_Course(id), Api.update_Course, "Course", "Course", `/Courses/${id}`)
}

export let Course_to = (id:number, target_element_id:string, ) => {
  Utils.render_page_manager(target_element_id,
    Course_to_page(id),
    
  )
}
