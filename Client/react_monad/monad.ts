import * as React from "react"
import * as ReactDOM from "react-dom"
import * as Immutable from "immutable"

export type Mode = "edit"|"view"
export type CmdCommon<A> = { cont:Cont<A>, key:string, debug_info:() => string }
export type Unit<A> = { kind:"unit", value:A } & CmdCommon<A>
export type Bind<A> = { kind:"bind", once:boolean, p:C<any>, k:(_:any) => C<A> } & CmdCommon<A>
export type String = { kind:"string", value:string, mode:Mode } & CmdCommon<string>
export type Int = { kind:"int", value:number, mode:Mode } & CmdCommon<number>
export type Image = { kind:"image", src:string, mode:Mode } & CmdCommon<string>
export type BooleanStyle = "checkbox"|"fancy toggle"|"plus/minus"
export type Bool = { kind:"bool", value:boolean, mode:Mode, style:BooleanStyle } & CmdCommon<boolean>
export type Delay<A> = { kind:"delay", dt:number, value:A, p:(_:A)=>C<A> } & CmdCommon<A>
export type Lift<A> = { kind:"custom", props_data:any, react_class:React.ClassicComponentClass<Lift<A>> } & CmdCommon<A>
export type LiftPromise<A> = { kind:"lift promise", p:(_:any)=>Promise<A>, value:any, is_value_changed:(old_value:any,new_value:any)=>boolean } & CmdCommon<A>
export type Retract<A> = { kind:"retract", inb:(_:any)=>A, out:(_:any)=>(_:A)=>any, p:(_:any)=>C<any>, value:A } & CmdCommon<A>
export type Repeat<A> = { kind:"repeat", value:A, p:(_:A)=>C<A> } & CmdCommon<A>
export type Any<A> = { kind:"any", value:A, ps:Array<(_:A)=>C<A>> } & CmdCommon<A>
export type SelectorType = "dropdown"|{ kind:"radio", name:string }
export type Selector<A> = { kind:"selector", type:SelectorType, to_string:(_:A)=>string, items:Immutable.List<A>, selected_item:undefined|A } & CmdCommon<A>
export type MultiSelectorType = "list"|"checkbox"
export type MultiSelector<A> = { kind:"multi selector", type:MultiSelectorType, to_string:(_:any)=>string, items:A, selected_items:undefined|A } & CmdCommon<A>
export type Label<A> = { kind:"label", text:string, value:A, p:(_:A)=>C<A> } & CmdCommon<A>

export type Cmd<A> =
  Unit<A>
  | Bind<A>
  | String
  | Int
  | Bool
  | Image
  | Delay<A>
  | LiftPromise<A>
  | Retract<A>
  | Repeat<A>
  | Selector<A>
  | MultiSelector<A>
  | Any<A>
  | Lift<A>
  | Label<A>

export type Cont<A> = (callback:() => void) => (_:A) => void
export type C<A> = {
  comp:(cont:Cont<A>) => Cmd<A>
  bind:<B>(key:string, k:(_:A)=>C<B>, dbg?:()=>string)=>C<B>
  bind_once:<B>(key:string, k:(_:A)=>C<B>, dbg?:()=>string)=>C<B>
  ignore:()=>C<void>
}

function make_C<A>(comp:(cont:Cont<A>) => Cmd<A>) : C<A> {
  return {
    comp:comp,
    bind:function<B>(this:C<A>, key:string, k:(_:A)=>C<B>, dbg?:()=>string) : C<B> {
            return bind<A,B>(key || "", this, k, dbg)
          },
    bind_once:function<B>(this:C<A>, key:string, k:(_:A)=>C<B>, dbg?:()=>string) : C<B> {
            return bind_once<A,B>(key || "", this, k, dbg)
          },
    ignore:function(this:C<A>) : C<void> {
      return this.bind(``, _ => unit<void>(null))
    }
  }
}

export let unit = function<A>(x:A, dbg?:() => string) : C<A> { return make_C<A>(cont =>
  ({ kind:"unit", debug_info:dbg, value:x, cont:cont, key:null })) }

export let bind = function<A,B>(key:string, p:C<A>, k:((_:A)=>C<B>), dbg?:() => string) : C<B> {
  return make_C<B>(cont => ({ kind:"bind", debug_info:dbg, p:p as C<any>, k:k as (_:any) => C<B>, once:false, cont:cont, key:key }))
}

export let bind_once = function<A,B>(key:string, p:C<A>, k:((_:A)=>C<B>), dbg?:() => string) : C<B> {
  return make_C<B>(cont => ({ kind:"bind", debug_info:dbg, p:p as C<any>, k:k as (_:any) => C<B>, once:true, cont:cont, key:key }))
}

export let lift_promise = function<A,B>(p:(_:A) => Promise<B>, is_value_changed:(old_value:A,new_value:A)=>boolean, key?:string, dbg?:() => string) : ((_:A)=>C<B>) {
  return x => make_C<B>(cont => ({ kind:"lift promise", debug_info:dbg, is_value_changed:is_value_changed, value:x, p:p as (_:any)=>Promise<B>, cont:cont, key:key }))
}

export let retract = function<A,B>(inb:(_:A)=>B, out:(_:A)=>(_:B)=>A, p:(_:B)=>C<B>, key?:string, dbg?:() => string) : ((_:A) => C<A>) {
  return (initial_value:A) => make_C<A>((cont:Cont<A>) =>
    ({ kind:"retract", debug_info:dbg, inb:inb as (_:A)=>any, out:out as (_:A)=>(_:any)=>A, p:p as (_:any)=>C<any>, value:initial_value, cont:cont, key:key }))
}

export let repeat = function<A>(p:(_:A)=>C<A>, key?:string, dbg?:() => string) : ((_:A) => C<A>) {
  return initial_value => make_C<A>(cont => ({ kind:"repeat", debug_info:dbg, p:p as (_:A)=>C<A>, value:initial_value, cont:cont, key:key }))
}

export let any = function<A>(ps:Array<(_:A)=>C<A>>, key?:string, dbg?:() => string) : ((_:A) => C<A>) {
  return initial_value => make_C<A>(cont => ({ kind:"any", debug_info:dbg, ps:ps as Array<(_:A)=>C<A>>, value:initial_value, cont:cont, key:key }))
}

export let selector = function<A>(type:SelectorType, to_string:(_:A)=>string, key?:string, dbg?:() => string) : ((items:Immutable.List<A>, selected_item?:A) => C<A>) {
  return (items, selected_item) => make_C<A>(cont => ({ kind:"selector", debug_info:dbg, items:items, selected_item:selected_item, type:type, to_string:to_string, cont:cont, key:key }))
}

export let multi_selector = function<A>(type:MultiSelectorType, to_string:(_:A)=>string, key?:string, dbg?:() => string) : ((items:Immutable.List<A>, selected_items?:Immutable.List<A>) => C<Immutable.List<A>>) {
  return (items, selected_items) => make_C<Immutable.List<A>>((cont:Cont<Immutable.List<A>>) => (
    { kind:"multi selector",
      debug_info:dbg,
      items:items,
      selected_items:selected_items,
      type:type,
      to_string:to_string,
      cont:cont,
      key:key }))
}

export let delay = <A>(dt:number, key?:string, dbg?:() => string) => (p:(_:A)=>C<A>) : ((_:A) => C<A>) => {
  return initial_value => make_C<A>(cont =>
    ({ kind:"delay", debug_info:dbg, dt:dt, p:p as (_:A)=>C<A>, value:initial_value, cont:cont, key:key }))
}

export let custom = <A>(key?:string, dbg?:() => string) => (react_class:React.ClassicComponentClass<Lift<A>>, props_data:any) : C<A> => {
  return make_C<A>(cont =>
    ({ kind:"custom", debug_info:dbg, react_class:react_class, props_data:props_data, cont:cont, key:key }))
}

export let string = (mode:Mode, key?:string, dbg?:() => string) => function(value:string) : C<string> {
  return make_C<string>(cont =>
    ({ kind:"string", debug_info:dbg, mode:mode, value:value, cont:cont, key:key }))
}

export let int = (mode:Mode, key?:string, dbg?:() => string) => function(value:number) : C<number> {
  return make_C<number>(cont =>
    ({ kind:"int", debug_info:dbg, mode:mode, value:value, cont:cont, key:key }))
}

export let bool = (mode:Mode, style:BooleanStyle, key?:string, dbg?:() => string) => function(value:boolean) : C<boolean> {
  return make_C<boolean>(cont =>
    ({ kind:"bool", debug_info:dbg, style:style, mode:mode, value:value, cont:cont, key:key }))
}

export let image = (mode:Mode, key?:string, dbg?:() => string) => function(src:string) : C<string> {
  return make_C<string>(cont =>
    ({ kind:"image", debug_info:dbg, mode:mode, src:src, cont:cont, key:key }))
}

export let label = <A>(text:string, key?:string, dbg?:() => string) => (p:(_:A)=>C<A>) : ((_:A) => C<A>) => {
  return value => make_C<A>(cont =>
    ({ kind:"label", debug_info:dbg, text:text, value:value, p:p as (_:A)=>C<A>, cont:cont, key:key }))
}
