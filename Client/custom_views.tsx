import * as React from "react"
import * as ReactDOM from "react-dom"
import {List, Map, Set} from "immutable"
import * as Immutable from "immutable"
import * as Models from './generated_models'
import * as Api from './generated_api'
import * as ViewUtils from './generated_views/view_utils'
import {C, unit, bind, bind_once,                          // core
        string, int, bool, image,                          // primitive
        selector, multi_selector, label,                   // html
        Cont, custom, repeat, any, lift_promise, retract, delay, // combinators
        menu // constructions
        } from './react_monad/monad'
import * as Monad from './react_monad/monad'

// sample 1
let course_form : (_:Models.Course) => C<Models.Course> = c =>
  repeat<Models.Course>(c =>
    any<Models.Course>([
      c => retract<Models.Course, string>(
        c => c.Name || "", c => n => ({...c, Name:n}),
        string("edit", `course_name_${c.Id}`), `course_name_retract_${c.Id}`)(c),
      c => retract<Models.Course, number>(
        c => c.Points || 0, c => p => ({...c, Points:p}),
        int("edit", `course_points_${c.Id}`), `course_points_retract_${c.Id}`)(c),
      c => retract<Models.Course, void>(
        c => null, c => _ => c,
        _ => download_logo(c).bind(`logo_downloader${c.Id}`, src =>
        repeat<string>((src:string) =>
          image("edit", `course_logo_${c.Id}`)(src).bind(`logo_uploader${c.Id}`, new_src =>
          upload_logo(c)(new_src)))(src)).ignore(), `course_logo_retract_${c.Id}`)(c),
    ], `inner_course_form_${c.Id}`)(c), `course_repeater_${c.Id}`)(c)

let download_course : (_:number) => C<Models.Course> = c_id => lift_promise<void, Models.Course>(x => Api.get_Course(c_id).then(c => c.Item), ((p,q) => false), `course_downloader_lift_${c_id}`)(null)
let upload_course : (_:Models.Course) => C<Models.Course> = c =>
  lift_promise<Models.Course, Models.Course>(c => Api.update_Course(c).then(_ => c),
  (c1,c2) => c1.Id != c2.Id || c1.Name != c2.Name || c1.Points != c2.Points || c1.CreatedDate.toDate().getTime() != c2.CreatedDate.toDate().getTime(),
   `course_uploader_lift_${c.Id}`)(c)

let download_logo : (c:Models.Course) => C<string> = c => lift_promise<void, string>(x => Api.get_Course_Logo(c), ((p,q) => false), `course_logo_downloader_lift_${c.Id}`)(null)
let upload_logo : (c:Models.Course) => (logo:string) => C<string> = c => l =>
  lift_promise<[Models.Course, string], string>(([c,src]) => Api.update_Course_Logo(c, src).then(_ => src),
  (c1,c2) => c1[1] != c2[1], `course_logo_uploader_lift${c.Id}`)([c,l])


let sample1 : C<void> =
  download_course(1).bind_once(`course_downloader_${1}`, c =>
  course_form(c).bind(`course_form_${c.Id}`, c =>
  delay<Models.Course>(200, `course_delayer_${c.Id}`)(c =>
    upload_course(c))(c)).ignore())

// sample 2
type CounterProps = { target:number, cont:Cont<number> }
type CounterState = { current:number, signals_sent:number }
class Counter extends React.Component<CounterProps, CounterState> {
  constructor(props:CounterProps, context:any) {
    super(props, context)

    this.state = { current:0, signals_sent:0 }
  }

  render() {
    return <div>
      <label style={{margin:"10px"}}>Progress: {this.state.current}/{this.props.target}</label>
      <button onClick={() => this.setState({...this.state, current: this.state.current+1}, () =>
        this.state.current >= this.props.target + 1 && this.setState({...this.state, current: 0}, () =>
        this.props.cont(() =>
          this.setState({...this.state, signals_sent:this.state.signals_sent+1}))
          (this.state.signals_sent + 1)))}>+1</button>
    </div>
  }
}

let sample2 : C<void> =
  selector<number>("dropdown", x => x.toString())(List<number>([1, 3, 5])).bind(`target_selector`, n =>
  custom<number>()(cont => <Counter target={n} cont={cont} />).bind<void>(`counter`, s =>
  string("view")(`The component has ticked ${s} times.`).ignore()))

// sample 3
let sample3 : C<void> =
  multi_selector<number>("checkbox",
    x => x.toString())(List<number>([1, 3, 5]), List<number>([1, 5])).bind(`multi_selector`, n =>
  string("view")(JSON.stringify(n.toArray())).ignore())

// sample 4
let sample4 : C<void> =
  repeat<boolean>(b =>
    any<boolean>([
      label<boolean>("My toggle: ")(b =>
        bool("edit", "checkbox", `basic toggle`)(b)),
      label<boolean>("Bellissimo!!! ")(b =>
        bool("edit", "fancy toggle", `fancy toggle`)(b)),
      label<boolean>("Meno bellissimo ")(b =>
        bool("edit", "plus/minus", `plus/minus toggle`)(b)),
    ], `toggles`)(b))(true).bind(`fancy_toggle_bind`, c =>
  string("view")(`Your selection is ${c.toString()}`).ignore())

// sample 5
let sample5 : C<void> =
  repeat<number>(n =>
      label<number>("number: ")(n =>
        int("edit", "int")(n))(n),
      `input number`)(0).bind(`input number bind`, c =>
  string("view")(`Your selection is ${c.toString()}`).ignore())

// sample 6
type FictionalPage = { title:string, content:string }

let sample6 : C<void> =
  menu<FictionalPage, string>("side menu", p => p.title, `fictional pages menu`)(
    List<FictionalPage>([
      { title:"About", content:"This page talks about us"},
      { title:"Content", content:"This page is full of interesting content"}
    ]), p => string("view")(p.content)
  ).ignore()

export function HomePage(props:ViewUtils.EntityComponentProps<Models.HomePage>) : JSX.Element {
  let all_samples =
    [
      { sample: sample1, description:"A form with upload and download." },
      { sample: sample2, description:"A selector." },
      { sample: sample3, description:"A multi-selector." },
      { sample: sample4, description:"A series of (coordinated) switches." },
      { sample: sample5, description:"A labelled item." },
      { sample: sample6, description:"A menu with content." },
    ]

  return <div>
      {
        all_samples.map((s,i) =>
          <div className="component">
            Sample {i+1} - {s.description}
            {
              s.sample.comp(continuation => value => console.log("done"))
            }
          </div>
        )
      }
  </div>
}

// TODO:
  // add () in front of all combinators to enforce laziness and improve closures
  // various operators
    // all
    // div
    // optional class on the label
    // menu selector: ([A] => (A => C<B>) => C<B>)
      // tabs
    // remove menu blank space when using custom headless renderer in scaffolder (move classes from _Layout to individual react model renderer)
    // add styling to menu with content, and perhaps also a size
    // add styling to tabs with content, and perhaps also a size
    // disable boolean checkboxes if mode is not edit
    // button: (A => B) => A => C<B>
    // mapM
    // paginated list
      // select
      // add new
      // add existing
    // page manager (with url's)
      // routing
    // sample with multiple independent elements repeat(any [repeat(el_i)])
    // files
    // image clearing
  // show to designers for feedback
  // documentation
  // linkedin post linked on reddit
  // better library file structure
  // better sample file structure
  // all samples, each hidden by toggle
  // npm package
  // Api.download/upload operators should already be lifted out the box (from the scaffolder)
  // default scaffolder views should use the monadic library
