import * as Immutable from 'immutable'
import * as Moment from 'moment'

export type HomePage = {
    Id : number
    CreatedDate:Moment.Moment
    
    
  }
  
export type Course = {
    Id : number
    CreatedDate:Moment.Moment
    Name : string
  Points : number
  Logo : string
    
  }
  
export type Lecture = {
    Id : number
    CreatedDate:Moment.Moment
    Name : string
  Description : string
    
  }
  
export type HomePage_Course = {
    Id : number
    CreatedDate:Moment.Moment
    HomePageId : number
  CourseId : number
    
  }
  

export type Course_Lecture = {
    Id : number
    CreatedDate:Moment.Moment
    CourseId : number
  LectureId : number
    
  }
  

