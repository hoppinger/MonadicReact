import * as React from "react"
import * as ReactDOM from "react-dom"
import * as createReactClass from 'create-react-class'
import * as Immutable from "immutable"
import * as Models from './generated_models'
import * as Api from './generated_api'
import * as ViewUtils from './generated_views/view_utils'
import {C, unit, bind, bind_once, lift_promise, retract, delay, repeat, string, int, any, custom, selector} from './react_monad/monad'
import * as Monad from './react_monad/monad'
import {Interpreter} from './react_monad/interpreter'

// sample 1
let inner_course_form : (_:Models.Course) => C<Models.Course> = c =>
  any<Models.Course>(`inner_course_form_${c.Id}`, [
    c => retract<Models.Course, string>(`course_retract_${c.Id}`,
      c => c.Name || "", c => n => ({...c, Name:n}),
      string(`course_name_${c.Id}`))(c),
    c => retract<Models.Course, number>(`course_retract_${c.Id}`,
      c => c.Points || 0, c => p => ({...c, Points:p}),
      int(`course_points_${c.Id}`))(c)
  ])(c)

let course_form : (_:Models.Course) => C<Models.Course> = c =>
  repeat<Models.Course>(`course_repeater_${c.Id}`, c =>
    inner_course_form(c))(c)

let course_form_uploader : (_:Models.Course) => C<Models.Course> = c =>
  course_form(c).then(`course_form_${c.Id}`, false, c =>
  delay<Models.Course>(`course_delayer_${c.Id}`, 200)(c => upload_course(c))(c))

let download_course : (_:number) => C<Models.Course> = c_id => lift_promise<void, Models.Course>(`course_downloader_lift_${c_id}`, x => Api.get_Course(c_id).then(c => c.Item))(null)
let upload_course : (_:Models.Course) => C<Models.Course> = c =>
  lift_promise<Models.Course, void>(`course_uploader_lift_${c.Id}`, Api.update_Course)(c).then(`course_uploader_${c.Id}`, false, _ =>
  unit<Models.Course>(c))


let course_view = (c_id:number) =>
  download_course(c_id).then(`course_downloader_${c_id}`, true, c =>
  course_form_uploader(c)
  )


// sample 2
type CounterState = { current:number, signals_sent:number }
let Counter = createReactClass({
    getInitialState: () => ({ current:0, signals_sent:0 }),
    render: function() {
      return <div>
        <label style={{margin:"10px"}}>Progress: {this.state.current}/{this.props.props_data.target} ({this.state.signals_sent})</label>
        <button onClick={() => this.setState({...this.state, current: this.state.current+1}, () =>
          this.state.current == this.props.props_data.target + 1 && this.setState({...this.state, current: 0},
            () => this.props.cont(() => this.setState({...this.state, signals_sent:this.state.signals_sent+1}))(`Tick!!! ${this.state.signals_sent}`)))}>+1</button>
      </div>
    }
  })

let counter : C<{}> =
  selector<number>(`target_selector`, "dropdown", x => x.toString())(Immutable.List<number>([1, 3, 5])).then(`target_selector`, false, n =>
  custom<string>(`custom_class`)(Counter, { target:n }).then<{}>(`counter`, false, s =>
  console.log("Custom class says", s) || unit<{}>({})))

export let HomePage = (props:ViewUtils.EntityComponentProps<Models.HomePage>) : JSX.Element => {
  return <div>
      This is the homepage
      <Interpreter cmd={
        // course_view(1).comp(continuation => value => console.log("something has happened"))
        counter.comp(continuation => value => null)
      } />
  </div>
}

// TODO:
  // npm package
  // various operators
  // custom classes
    // custom classes permanence on the page
      // repeat(dropdown to choose target)
      // custom class
      // readonly string to show the last message
