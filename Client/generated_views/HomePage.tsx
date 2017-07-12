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
import * as CourseViews from './Course'
import * as CustomViews from '../custom_views'

export function HomePage_HomePage_Course_can_create(self:HomePageContext) {
  let state = self.state()
  return state.Course == "loading" ? false : state.Course.CanCreate
}
export function HomePage_HomePage_Course_can_delete(self:HomePageContext) {
  let state = self.state()
  return state.Course == "loading" ? false : state.Course.CanDelete
}
export function HomePage_HomePage_Course_page_index(self:HomePageContext) {
  let state = self.state()
  return state.Course == "loading" ? 0 : state.Course.PageIndex
}
export function HomePage_HomePage_Course_page_size(self:HomePageContext) {
  let state = self.state()
  return state.Course == "loading" ? 25 : state.Course.PageSize
}
export function HomePage_HomePage_Course_search_query(self:HomePageContext) {
  let state = self.state()
  return state.Course == "loading" ? null : state.Course.SearchQuery
}
export function HomePage_HomePage_Course_num_pages(self:HomePageContext) {
  let state = self.state()
  return state.Course == "loading" ? 1 : state.Course.NumPages
}

export function load_relation_HomePage_HomePage_Course(self:HomePageContext, force_first_page:boolean, callback?:()=>void) {
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
      Api.get_HomePage_HomePage_Courses(self.props.entity, HomePage_HomePage_Course_page_index(self), HomePage_HomePage_Course_page_size(self), HomePage_HomePage_Course_search_query(self)).then(Courses =>
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

export function load_relations_HomePage(self, callback?:()=>void) {
  load_relation_HomePage_HomePage_Course(self, false, 
        () => callback && callback())
}

export function set_size_HomePage(self:HomePageContext, new_size:Utils.EntitySize) {
  self.props.set_size(new_size, () => {
    if (new_size == "fullscreen")
      self.props.push(HomePage_to_page(self.props.entity.Id))
  })
}





export function render_editable_attributes_minimised_HomePage(self:HomePageContext) {
  let attributes = (<div>
      
    </div>)
  return attributes
}

export function render_editable_attributes_maximised_HomePage(self:HomePageContext) {
    let state = self.state()
    let attributes = (<div>
        
        
        
        
      </div>)
    return attributes
  }

export function render_breadcrumb_HomePage(self:HomePageContext) {
  return <div className="breadcrumb-homepage">HomePage</div>
}

export function render_menu_HomePage(self:HomePageContext) {
  let state = self.state()
  return <div className="menu">
        <img className="logo" src={"/images/logo.png"} alt="Logo"/>
        <div className="pages">
          {!Permissions.can_view_HomePage() ? null :
              <div className={`menu_entry page_link active-page`}>
                <a onClick={() => 
                  self.props.set_shown_relation("none")
                  
                }>
                  {i18next.t('HomePage')}
                </a>
              </div>
            }
          <div className="menu_entries">
          
            {!Permissions.can_view_Course() ? null :
                  <div className={`menu_entry${self.props.shown_relation == "HomePage_Course" ? " active" : ""}`}>
                    <a onClick={() =>
                        {self.props.set_shown_relation("HomePage_Course")
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

export function render_local_menu_HomePage(self:HomePageContext) {
  let state = self.state()
  return <div className="local-menu">
          <div className="local_menu_entries">
            <div className={`local_menu_entry${self.props.shown_relation == "none" ? " local_menu_entry--active" : ""}`}>
              <a onClick={() =>
                  self.props.set_shown_relation("none")
              }>
                {i18next.t('About this HomePage')}
              </a>
            </div>
          
          </div>
        </div>
}

export function render_controls_HomePage(self:HomePageContext) {
  return <div className="control">
    {self.props.allow_maximisation && self.props.set_size ? <a className={`"homepage button button--toggle ${self.props.size != 'preview' ? 'button--toggle--open' : ''}`}
          onClick={() => {
            set_size_HomePage(self, self.props.size == "preview" ? "large" : "preview")}
          }>
      </a> : null}
    {Permissions.can_delete_HomePage() && self.props.size == "fullscreen" ? <a className="button button--delete"
      onClick={() => confirm(i18next.t('Are you sure?')) &&
        Api.delete_HomePage(self.props.entity).then(() => self.props.force_reload(() => self.props.pop()))
      }>
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

export function render_content_HomePage(self:HomePageContext) {
  let actions:Array<()=>void> =
    [
      self.props.allow_maximisation && self.props.set_size && self.props.size == "preview" ?
        () => set_size_HomePage(self, self.props.size == "preview" ? "large" : "preview")
      :
        null,
    ].filter(a => a != null)
  let content =
    Permissions.can_view_HomePage() ?
      self.props.size == "preview" ?
        CustomViews.HomePage(self.props)
      : self.props.size == "large" ?
        CustomViews.HomePage(self.props)
      : self.props.size == "fullscreen" ?
        CustomViews.HomePage(self.props)
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





export function render_preview_HomePage(self:HomePageContext) {
  let attributes:JSX.Element = null
  if (self.props.mode == "view" || !Permissions.can_edit_HomePage())
    attributes = (<div className="model__attributes">
      
    </div>)
  else
    attributes = render_editable_attributes_minimised_HomePage(self)
  return (<div className="block">
      {attributes}
    </div>)
}

export function render_large_HomePage(self:HomePageContext) {
  let state = self.state()
  let attributes:JSX.Element = null
  if (self.props.mode == "view" || !Permissions.can_edit_HomePage())
    attributes = (<div className="model__attributes">
      
        
    </div>)
  else
    attributes = render_editable_attributes_maximised_HomePage(self)
  return (<div className="block">
      {self.props.nesting_depth == 0 && self.props.shown_relation != "all" && self.props.shown_relation != "none" ? null : attributes}
      {render_relations_HomePage(self)}
    </div>)
}


export function render_HomePage_HomePage_Course(self:HomePageContext, context:"presentation_structure"|"default") {
  if ((context == "default" && self.props.shown_relation != "all" && self.props.shown_relation != "HomePage_Course") || !Permissions.can_view_Course())
    return null
  let state = self.state()
  return <div>
    
    { List.render_relation("homepage_homepage_course",
   "HomePage",
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
      HomePage_HomePage_Course_page_index(self),
      HomePage_HomePage_Course_num_pages(self),
      new_page_index => {
          let state = self.state()
          state.Course != "loading" &&
          self.setState({...self.state(),
            update_count:self.state().update_count+1,
            Course: {
              ...state.Course,
              PageIndex:new_page_index
            }
          }, () =>  load_relation_HomePage_HomePage_Course(self, false, ))
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
                  mode:self.props.mode == "edit" && (Permissions.can_edit_HomePage_Course()
                        || Permissions.can_create_HomePage_Course()
                        || Permissions.can_delete_HomePage_Course()) ?
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
                  unlink: undefined,
                    delete: !Permissions.can_delete_Course() || !HomePage_HomePage_Course_can_delete(self) ?
                    null
                    :
                    () => confirm(i18next.t('Are you sure?')) && Api.delete_Course(i.element).then(() =>
                      load_relation_HomePage_HomePage_Course(self, false, ))
                })
              }
            </div>
          </div>
        },
      () =>
        <div>
          {Permissions.can_create_Course() && Permissions.can_create_HomePage_Course() && HomePage_HomePage_Course_can_create(self) ? render_new_HomePage_HomePage_Course(self) : null}
          
        </div>)
    }
    
    </div>
}



export function render_relations_HomePage(self:HomePageContext) {
  return <div className="relations">
      { render_HomePage_HomePage_Course(self, "default") }
      
    </div>
}



export function render_new_HomePage_HomePage_Course(self:HomePageContext) {
    let state = self.state()
    return  self.props.mode == "edit" ?
      <div className="button__actions">
        <div className="new-course">
              <button 
                      className="new-course button button--new"
                      onClick={() =>
                          Api.create_Course().then(e => {
                              Api.update_Course(
                                ({ ...e, Name:"", Points:0, Logo:"", Attachment:"" } as Models.Course)).then(() =>
                                load_relation_HomePage_HomePage_Course(self, true, () =>
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
  

export function render_saving_animations_HomePage(self:HomePageContext) {
  return self.state().dirty_Course.count() > 0 ?
    <div style={{position:"fixed", zIndex:10000, top:0, left:0, width:"20px", height:"20px", backgroundColor:"red"}} className="saving"/>
    : <div style={{position:"fixed", zIndex:10000, top:0, left:0, width:"20px", height:"20px", backgroundColor:"cornflowerblue"}} className="saved"/>
}

export type HomePageContext = {state:()=>HomePageState, props:Utils.EntityComponentProps<Models.HomePage>, setState:(new_state:HomePageState, callback?:()=>void) => void}

export type HomePageState = {
    update_count:number
    add_step_Course:"closed"|"open"|"saving",
      dirty_Course:Immutable.Map<number,Models.Course>,
      Course:Utils.PaginatedItems<{ shown_relation: string } & Utils.EntityAndSize<Models.Course>>|"loading"
  }
export class HomePageComponent extends React.Component<Utils.EntityComponentProps<Models.HomePage>, HomePageState> {
  constructor(props:Utils.EntityComponentProps<Models.HomePage>, context:any) {
    super(props, context)
    this.state = { update_count:0,add_step_Course:"closed", dirty_Course:Immutable.Map<number,Models.Course>(), Course:"loading" }
  }

  get_self() {
    return {state:() => this.state, props:this.props, setState:(ns,c)=>this.setState(ns,c)}
  }

  componentWillReceiveProps(new_props:Utils.EntityComponentProps<Models.HomePage>) {
    if (new_props.size == "breadcrumb") return
    let current_logged_in_entity =  null
    let new_logged_in_entity =  null
    if (new_props.mode != this.props.mode || (new_props.size != this.props.size && (new_props.size == "large" || new_props.size == "fullscreen")) ||
        new_props.logic_frame != this.props.logic_frame ||
        (current_logged_in_entity && !new_logged_in_entity) ||
        (!current_logged_in_entity && new_logged_in_entity) ||
        (current_logged_in_entity && new_logged_in_entity && current_logged_in_entity.Id != new_logged_in_entity.Id)) {
      load_relations_HomePage(this.get_self(),  )
    }
  }

  thread:number = null
  componentWillMount() {
    if (this.props.size == "breadcrumb") return
    if (this.props.size != "preview") {
      
      load_relations_HomePage(this.get_self(), )
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
      return Permissions.can_view_HomePage() ?
              CustomViews.HomePage(this.props)
              : null
    }

    return CustomViews.HomePage(this.props)
  }
}

export let HomePage = (props:Utils.EntityComponentProps<Models.HomePage>) : JSX.Element =>
  <HomePageComponent {...props} />

export let HomePage_to_page = (id:number) => {
  let can_edit = Utils.any_of([Permissions.can_edit_HomePage, Permissions.can_edit_HomePage_Course, Permissions.can_edit_Course])
  return Utils.scene_to_page<Models.HomePage>(can_edit, HomePage, Api.get_HomePage(id), Api.update_HomePage, "HomePage", "HomePage", `/HomePages/${id}`)
}

export let HomePage_to = (id:number, target_element_id:string, ) => {
  Utils.render_page_manager(target_element_id,
    HomePage_to_page(id),
    
  )
}
