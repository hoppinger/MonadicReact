import * as Models from './generated_models'
import * as Immutable from 'immutable'
import * as Moment from 'moment'
import 'whatwg-fetch'

export type ItemWithEditable<T> = {Item:T, Editable:boolean, JustCreated:boolean}

export type RawPage<T> = {
  Items:ItemWithEditable<T>[]
  PageIndex:number
  SearchQuery:string
  NumPages:number
  PageSize:number
  TotalCount:number
  CanCreate:boolean
  CanDelete:boolean
}

export let parse_date = <T>(e:any) : T&{CreatedDate:Moment.Moment} => { return { ...e, CreatedDate: Moment.utc(e.CreatedDate) }}

export let make_page = <T>(res:any, parse_other_args:(e:any) => T) : RawPage<T> => { return {
  Items: res.Items.map((i:any) => { return{ ...i, Item:parse_date(i.Item)} }).map((i:any) => { return{ ...i, Item:parse_other_args(i.Item)} }),
  PageIndex: res.PageIndex,
  SearchQuery:res.SearchQuery,
  NumPages: res.NumPages,
  PageSize: res.PageSize,
  TotalCount: res.TotalCount,
  CanCreate: res.CanCreate,
  CanDelete: res.CanDelete
}}

export async function get_HomePage_HomePage_Courses(source:Models.HomePage, page_index:number, page_size:number, query_string:string = null) : Promise<RawPage<Models.Course>> {
  let res = await fetch(`/api/v1/HomePage/${source.Id}/HomePage_Courses?page_index=${page_index}&page_size=${page_size}${(query_string != null ? "&search_query=" + query_string : "")}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return make_page<Models.Course>(json, e => { return {...e, }})
}

export async function get_HomePage_HomePage_Courses_Course(source:Models.HomePage, page_index:number, page_size:number, id:number) : Promise<Models.Course> {
  let res = await fetch(`/api/v1/HomePage/${source.Id}/HomePage_Courses/${id}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return {...json, CreatedDate: Moment.utc(json.CreatedDate),  } as Models.Course
}

export async function get_HomePage_HomePage_Courses_Course_by_id(source:Models.HomePage, id:number) : Promise<Models.Course> {
  let res = await fetch(`/api/v1/HomePage/${source.Id}/HomePage_Courses/${id}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return {...json, CreatedDate: Moment.utc(json.CreatedDate),  } as Models.Course
}




export async function create_HomePage() : Promise<Models.HomePage> {
  let res = await fetch(`/api/v1/HomePage/`,
    { method: 'post', credentials: 'include', headers:{'content-type': 'application/json',
      'X-XSRF-TOKEN': (document.getElementsByName("__RequestVerificationToken")[0] as any).value } })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return {...json, CreatedDate: Moment.utc(json.CreatedDate),  } as Models.HomePage
}

export async function update_HomePage(item:Models.HomePage) : Promise<void> {
  let res = await fetch(`/api/v1/HomePage/`, { method: 'put',
      body: JSON.stringify({...item, CreatedDate:undefined, }), credentials: 'include', headers:{'content-type': 'application/json', 'X-XSRF-TOKEN': (document.getElementsByName("__RequestVerificationToken")[0] as any).value } })
  if (!res.ok) throw Error(res.statusText)
  return
}

export async function delete_HomePage(source:Models.HomePage) : Promise<void> {
  let res = await fetch(`/api/v1/HomePage/${source.Id}`, { method: 'delete', credentials: 'include', headers:{'content-type': 'application/json', 'X-XSRF-TOKEN': (document.getElementsByName("__RequestVerificationToken")[0] as any).value} })
  if (!res.ok) throw Error(res.statusText)
  return
}

export async function get_HomePage(id:number) : Promise<ItemWithEditable<Models.HomePage>> {
  let res = await fetch(`/api/v1/HomePage/${id}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return { Item: {...json.Item, CreatedDate: Moment.utc(json.Item.CreatedDate),  } as Models.HomePage,
           Editable: !!json.Editable, JustCreated:false }
}

export async function get_HomePages(page_index:number, page_size:number, search_query:string = null) : Promise<RawPage<Models.HomePage>> {
  let res = await fetch(`/api/v1/HomePage?page_index=${page_index}&page_size=${page_size}${(search_query != null ? "&page_size=" + search_query : "")}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })

  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return make_page<Models.HomePage>(json, e => { return {...e, }})
}







  
  
export async function get_Course_HomePage_Courses(source:Models.Course, page_index:number, page_size:number, query_string:string = null) : Promise<RawPage<Models.HomePage>> {
  let res = await fetch(`/api/v1/Course/${source.Id}/HomePage_Courses?page_index=${page_index}&page_size=${page_size}${(query_string != null ? "&search_query=" + query_string : "")}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return make_page<Models.HomePage>(json, e => { return {...e, }})
}

export async function get_Course_HomePage_Courses_HomePage(source:Models.Course, page_index:number, page_size:number, id:number) : Promise<Models.HomePage> {
  let res = await fetch(`/api/v1/Course/${source.Id}/HomePage_Courses/${id}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return {...json, CreatedDate: Moment.utc(json.CreatedDate),  } as Models.HomePage
}

export async function get_Course_HomePage_Courses_HomePage_by_id(source:Models.Course, id:number) : Promise<Models.HomePage> {
  let res = await fetch(`/api/v1/Course/${source.Id}/HomePage_Courses/${id}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return {...json, CreatedDate: Moment.utc(json.CreatedDate),  } as Models.HomePage
}




export async function get_Course_Course_Lectures(source:Models.Course, page_index:number, page_size:number, query_string:string = null) : Promise<RawPage<Models.Lecture>> {
  let res = await fetch(`/api/v1/Course/${source.Id}/Course_Lectures?page_index=${page_index}&page_size=${page_size}${(query_string != null ? "&search_query=" + query_string : "")}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return make_page<Models.Lecture>(json, e => { return {...e, }})
}

export async function get_Course_Course_Lectures_Lecture(source:Models.Course, page_index:number, page_size:number, id:number) : Promise<Models.Lecture> {
  let res = await fetch(`/api/v1/Course/${source.Id}/Course_Lectures/${id}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return {...json, CreatedDate: Moment.utc(json.CreatedDate),  } as Models.Lecture
}

export async function get_Course_Course_Lectures_Lecture_by_id(source:Models.Course, id:number) : Promise<Models.Lecture> {
  let res = await fetch(`/api/v1/Course/${source.Id}/Course_Lectures/${id}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return {...json, CreatedDate: Moment.utc(json.CreatedDate),  } as Models.Lecture
}


export async function get_unlinked_Course_Course_Lectures(source:Models.Course, page_index:number, page_size:number) : Promise<RawPage<Models.Lecture>> {
  let res = await fetch(`/api/v1/Course/${source.Id}/unlinked/Course_Lectures?page_index=${page_index}&page_size=${page_size}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return make_page<Models.Lecture>(json, e => { return {...e, }})
}

    
export async function create_linked_Course_Course_Lectures_Lecture(source:Models.Course) : Promise<Models.Lecture[]> {
  let res = await fetch(`/api/v1/Course/${source.Id}/Course_Lectures_Lecture`, { method: 'post', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return json.map(e => { return {...e, CreatedDate: Moment.utc(e.CreatedDate),  }}) as Models.Lecture[]
}

export async function link_Course_Course_Lectures(source:Models.Course, target:Models.Lecture) : Promise<void> {
  let res = await fetch(`/api/v1/Course/${source.Id}/Course_Lectures/${target.Id}`, { method: 'post', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  return
}

export async function unlink_Course_Course_Lectures(source:Models.Course, target:Models.Lecture) : Promise<void> {
  let res = await fetch(`/api/v1/Course/${source.Id}/Course_Lectures/${target.Id}`, { method: 'delete', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  return
}


export async function create_Course() : Promise<Models.Course> {
  let res = await fetch(`/api/v1/Course/`,
    { method: 'post', credentials: 'include', headers:{'content-type': 'application/json',
      'X-XSRF-TOKEN': (document.getElementsByName("__RequestVerificationToken")[0] as any).value } })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return {...json, CreatedDate: Moment.utc(json.CreatedDate),  } as Models.Course
}

export async function update_Course(item:Models.Course) : Promise<void> {
  let res = await fetch(`/api/v1/Course/`, { method: 'put',
      body: JSON.stringify({...item, CreatedDate:undefined, Logo:""}), credentials: 'include', headers:{'content-type': 'application/json', 'X-XSRF-TOKEN': (document.getElementsByName("__RequestVerificationToken")[0] as any).value } })
  if (!res.ok) throw Error(res.statusText)
  return
}

export async function delete_Course(source:Models.Course) : Promise<void> {
  let res = await fetch(`/api/v1/Course/${source.Id}`, { method: 'delete', credentials: 'include', headers:{'content-type': 'application/json', 'X-XSRF-TOKEN': (document.getElementsByName("__RequestVerificationToken")[0] as any).value} })
  if (!res.ok) throw Error(res.statusText)
  return
}

export async function get_Course(id:number) : Promise<ItemWithEditable<Models.Course>> {
  let res = await fetch(`/api/v1/Course/${id}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return { Item: {...json.Item, CreatedDate: Moment.utc(json.Item.CreatedDate),  } as Models.Course,
           Editable: !!json.Editable, JustCreated:false }
}

export async function get_Courses(page_index:number, page_size:number, search_query:string = null) : Promise<RawPage<Models.Course>> {
  let res = await fetch(`/api/v1/Course?page_index=${page_index}&page_size=${page_size}${(search_query != null ? "&page_size=" + search_query : "")}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })

  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return make_page<Models.Course>(json, e => { return {...e, }})
}


export async function get_Course_Logo(item:Models.Course) : Promise<string> {
  let res = await fetch(`/api/v1/Course/${item.Id}/Logo`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return json.Content
}

export async function update_Course_Logo(item:Models.Course, new_src:string) : Promise<void> {
  let res = await fetch(`/api/v1/Course/${item.Id}/Logo`, { method: 'put', body: JSON.stringify({ Content: new_src }), credentials: 'include', headers:{'content-type': 'application/json', 'X-XSRF-TOKEN': (document.getElementsByName("__RequestVerificationToken")[0] as any).value } })
  if (!res.ok) throw Error(res.statusText)
  return
}





  
  
export async function get_Lecture_Course_Lectures(source:Models.Lecture, page_index:number, page_size:number, query_string:string = null) : Promise<RawPage<Models.Course>> {
  let res = await fetch(`/api/v1/Lecture/${source.Id}/Course_Lectures?page_index=${page_index}&page_size=${page_size}${(query_string != null ? "&search_query=" + query_string : "")}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return make_page<Models.Course>(json, e => { return {...e, }})
}

export async function get_Lecture_Course_Lectures_Course(source:Models.Lecture, page_index:number, page_size:number, id:number) : Promise<Models.Course> {
  let res = await fetch(`/api/v1/Lecture/${source.Id}/Course_Lectures/${id}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return {...json, CreatedDate: Moment.utc(json.CreatedDate),  } as Models.Course
}

export async function get_Lecture_Course_Lectures_Course_by_id(source:Models.Lecture, id:number) : Promise<Models.Course> {
  let res = await fetch(`/api/v1/Lecture/${source.Id}/Course_Lectures/${id}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return {...json, CreatedDate: Moment.utc(json.CreatedDate),  } as Models.Course
}


export async function get_unlinked_Lecture_Course_Lectures(source:Models.Lecture, page_index:number, page_size:number) : Promise<RawPage<Models.Course>> {
  let res = await fetch(`/api/v1/Lecture/${source.Id}/unlinked/Course_Lectures?page_index=${page_index}&page_size=${page_size}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return make_page<Models.Course>(json, e => { return {...e, }})
}

    
export async function create_linked_Lecture_Course_Lectures_Course(source:Models.Lecture) : Promise<Models.Course[]> {
  let res = await fetch(`/api/v1/Lecture/${source.Id}/Course_Lectures_Course`, { method: 'post', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return json.map(e => { return {...e, CreatedDate: Moment.utc(e.CreatedDate),  }}) as Models.Course[]
}

export async function link_Lecture_Course_Lectures(source:Models.Lecture, target:Models.Course) : Promise<void> {
  let res = await fetch(`/api/v1/Lecture/${source.Id}/Course_Lectures/${target.Id}`, { method: 'post', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  return
}

export async function unlink_Lecture_Course_Lectures(source:Models.Lecture, target:Models.Course) : Promise<void> {
  let res = await fetch(`/api/v1/Lecture/${source.Id}/Course_Lectures/${target.Id}`, { method: 'delete', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  return
}


export async function create_Lecture() : Promise<Models.Lecture> {
  let res = await fetch(`/api/v1/Lecture/`,
    { method: 'post', credentials: 'include', headers:{'content-type': 'application/json',
      'X-XSRF-TOKEN': (document.getElementsByName("__RequestVerificationToken")[0] as any).value } })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return {...json, CreatedDate: Moment.utc(json.CreatedDate),  } as Models.Lecture
}

export async function update_Lecture(item:Models.Lecture) : Promise<void> {
  let res = await fetch(`/api/v1/Lecture/`, { method: 'put',
      body: JSON.stringify({...item, CreatedDate:undefined, }), credentials: 'include', headers:{'content-type': 'application/json', 'X-XSRF-TOKEN': (document.getElementsByName("__RequestVerificationToken")[0] as any).value } })
  if (!res.ok) throw Error(res.statusText)
  return
}

export async function delete_Lecture(source:Models.Lecture) : Promise<void> {
  let res = await fetch(`/api/v1/Lecture/${source.Id}`, { method: 'delete', credentials: 'include', headers:{'content-type': 'application/json', 'X-XSRF-TOKEN': (document.getElementsByName("__RequestVerificationToken")[0] as any).value} })
  if (!res.ok) throw Error(res.statusText)
  return
}

export async function get_Lecture(id:number) : Promise<ItemWithEditable<Models.Lecture>> {
  let res = await fetch(`/api/v1/Lecture/${id}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return { Item: {...json.Item, CreatedDate: Moment.utc(json.Item.CreatedDate),  } as Models.Lecture,
           Editable: !!json.Editable, JustCreated:false }
}

export async function get_Lectures(page_index:number, page_size:number, search_query:string = null) : Promise<RawPage<Models.Lecture>> {
  let res = await fetch(`/api/v1/Lecture?page_index=${page_index}&page_size=${page_size}${(search_query != null ? "&page_size=" + search_query : "")}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })

  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return make_page<Models.Lecture>(json, e => { return {...e, }})
}







  
  
  