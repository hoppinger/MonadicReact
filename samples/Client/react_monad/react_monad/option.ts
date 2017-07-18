export type Methods<A> = { map:<B>(f:(_:A)=>B)=>Option<B> }

export type Option<A> = ({ kind:"none" } | { kind:"some", value:A }) & Methods<A>
export let none = function<A>() : Option<A> { return {
  kind:"none",
  map:function<B>(this:Option<A>, f:(_:A)=>B){ return map<A,B>(f)(this) } }
}
export let some = function<A>(x:A) : Option<A> { return {
  kind:"some", value:x,
  map:function<B>(this:Option<A>, f:(_:A)=>B){ return map<A,B>(f)(this) } } }

let map = function<A,B>(f:(_:A)=>B) : (x:Option<A>) => Option<B> { return x => x.kind == "none" ? none<B>() : some<B>(f(x.value)) }
