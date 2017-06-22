import * as React from "react"
import * as ReactDOM from "react-dom"
import * as Immutable from "immutable"
import * as i18next from 'i18next'

export let Cancel = (props:{onClick:() => void}) =>
  <button className="button button--cancel"
    onClick={() => props.onClick()}>
    {i18next.t('Cancel')}
  </button>

export let Add = (props:{disabled?:boolean, onClick:() => void, target_name:string}) =>
  <button disabled={props.disabled}
          className="button button--add"
          onClick={() => props.onClick()}>
    {i18next.t(`Add existing ${props.target_name}`)}
  </button>

export let Create = (props:{onClick:() => void, target_name:string}) =>
  <button className="button button--create"
          onClick={() => props.onClick()}>
    {i18next.t(`Create new ${props.target_name}`)}
  </button>
export let Search = (props:{onClick:() => void}) =>
  <button className="button button--search"
          onClick={() => props.onClick()}>
    {i18next.t(`Search`)}
  </button>
