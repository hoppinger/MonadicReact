import * as React from "react"
import * as ReactDOM from "react-dom"
import * as Immutable from "immutable"
import * as i18next from 'i18next'

export type ToggleContainerProps = { content:()=>JSX.Element, button_text:(toggled:boolean)=>string }
export type ToggleContainerState = { toggled:boolean }
export class ToggleContainer extends React.Component<ToggleContainerProps, ToggleContainerState> {
  constructor(props:ToggleContainerProps, context:any) {
    super(props, context)
    this.state = { toggled:false }
  }

  render() {
    return <div className={`toggle-container ${this.state.toggled ? "toggle-container--toggled" : ""} `}>
        <a className="toggle-button"
            onClick={() => this.setState({...this.state, toggled:!this.state.toggled}) }>
          {i18next.t(this.props.button_text(this.state.toggled))}
        </a>
        { this.state.toggled ? this.props.content() : null }
      </div>
  }
}
