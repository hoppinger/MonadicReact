import * as React from "react"
import * as ReactDOM from "react-dom"
import * as createReactClass from 'create-react-class'
import {List, Map, Set} from "immutable"
import * as Immutable from "immutable"
import * as Models from './generated_models'
import * as Api from './generated_api'
import * as ViewUtils from './generated_views/view_utils'
import {C, unit, bind, bind_once, lift_promise, retract, delay, repeat, string, int, any, custom, selector, multi_selector} from './react_monad/monad'
import * as Monad from './react_monad/monad'
import {Interpreter, InterpreterProps} from './react_monad/interpreter'

// sample 1
let course_form : (_:Models.Course) => C<Models.Course> = c =>
  repeat<Models.Course>(c =>
    any<Models.Course>([
      c => retract<Models.Course, string>(
        c => c.Name || "", c => n => ({...c, Name:n}),
        string("edit", `course_name_${c.Id}`), `course_retract_${c.Id}`)(c),
      c => retract<Models.Course, number>(
        c => c.Points || 0, c => p => ({...c, Points:p}),
        int("edit", `course_points_${c.Id}`), `course_retract_${c.Id}`)(c)
    ], `inner_course_form_${c.Id}`)(c), `course_repeater_${c.Id}`)(c)

let download_course : (_:number) => C<Models.Course> = c_id => lift_promise<void, Models.Course>(x => Api.get_Course(c_id).then(c => c.Item), `course_downloader_lift_${c_id}`)(null)
let upload_course : (_:Models.Course) => C<Models.Course> = c =>
  lift_promise<Models.Course, void>(Api.update_Course, `course_uploader_lift_${c.Id}`)(c).bind(`course_uploader_${c.Id}`, _ =>
  unit<Models.Course>(c))


let course_view = (c_id:number) =>
  download_course(c_id).bind_once(`course_downloader_${c_id}`, c =>
  course_form(c).bind(`course_form_${c.Id}`, c =>
  delay<Models.Course>(200, `course_delayer_${c.Id}`)(c => upload_course(c))(c)).ignore())

// sample 2
type CounterState = { current:number, signals_sent:number }
let Counter = createReactClass({
    getInitialState: () => ({ current:0, signals_sent:0 }),
    render: function() {
      return <div>
        <label style={{margin:"10px"}}>Progress: {this.state.current}/{this.props.props_data.target}</label>
        <button onClick={() => this.setState({...this.state, current: this.state.current+1}, () =>
          this.state.current >= this.props.props_data.target + 1 && this.setState({...this.state, current: 0}, () =>
          this.props.cont(() =>
            this.setState({...this.state, signals_sent:this.state.signals_sent+1}))
            (this.state.signals_sent + 1)))}>+1</button>
      </div>
    }
  })

let counter : C<void> =
  selector<number>("dropdown", x => x.toString())(List<number>([1, 3, 5])).bind(`target_selector`, n =>
  custom<number>()(Counter, { target:n }).bind<void>(`counter`, s =>
  string("view")(`The component has ticked ${s} times.`).ignore()))


// sample 3
let sample3 : C<void> =
  multi_selector<number>({ kind: "checkbox", name: "multi selector" },
    x => x.toString())(List<number>([1, 3, 5]), List<number>([1, 5])).bind(`multi_selector`, n =>
  string("view")(JSON.stringify(n.toArray())).ignore())


export function HomePage(props:ViewUtils.EntityComponentProps<Models.HomePage>) : JSX.Element {
  return <div>
      This is the homepage
      {
        React.createElement<InterpreterProps<void>>(Interpreter, {
          cmd: course_view(1).comp(continuation => value => console.log("something has happened"))
               // counter.comp(continuation => value => null)
               // sample3.comp(continuation => value => null)
          })
      }
  </div>
}

// TODO:
  // npm package
  // add () in front of all combinators to enforce laziness and improve closures
  // multiple nested selectors in Counter sample: propagate with "all"
  // Api.download/upload operators should already be lifted out the box (from the generator)
  // various operators
    // toggles
      // pretty toggle
      // checkbox
      // open/close
    // all
    // div?
    // label
    // menu
    // tabs
    // paginated list
      // select
      // add new
      // add existing
    // page manager (with url's)
  // fully headless custom page renderer
  // documentation
  // linkedin post linked on reddit
  // better sample file structure
