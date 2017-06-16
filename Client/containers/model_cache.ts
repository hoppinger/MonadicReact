import * as Immutable from 'immutable'

export type Id = number
export type Handle = number
export type NotifyNewItem = (new_item:{Id:Id}) => void
export type Instances = Immutable.Map<Id, { item: {Id:Id}, callbacks: Immutable.Map<Handle,NotifyNewItem> } >

export type Cache = {
  models: Immutable.Map<string,Instances>
}
