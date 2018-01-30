/// <reference types="react" />
import * as React from "react";
import { Route, Url } from './router';
export declare type CmdCommon<A> = {
    cont: Cont<A>;
    context: () => Context;
    key: string;
    debug_info: () => string;
};
export declare type UnitProps<A> = {
    kind: "unit";
    value: A;
} & CmdCommon<A>;
export declare type BindProps<B, A> = {
    kind: "bind";
    once: boolean;
    p: C<B>;
    k: (_: B) => C<A>;
    className: string;
} & CmdCommon<A>;
export declare type MapProps<A, B> = {
    kind: "map";
    p: C<A>;
    f: (_: A) => B;
} & CmdCommon<B>;
export declare type FilterProps<A> = {
    kind: "filter";
    p: C<A>;
    f: (_: A) => boolean;
} & CmdCommon<A>;
export declare type ShouldComponentUpdateProps<A, B> = {
    kind: "should component update";
    p: (_: A) => C<B>;
    f: (_: A) => boolean;
    v: A;
} & CmdCommon<B>;
export declare type Mode = "edit" | "view";
export declare type Context = {
    logic_frame: number;
    force_reload: (callback?: () => void) => C<void>;
    current_page: C<void>;
    set_page: <T>(x: T, new_page: Route<T>, callback?: () => void) => C<void>;
    set_url: <T>(x: T, new_url: Url<T>, callback?: () => void) => C<void>;
    push_route: (new_route: Route<{}>, callback?: () => void) => C<void>;
    set_routes: (routes: Array<Route<{}>>, callback?: () => void) => C<void>;
};
export declare type Cont<A> = (callback: () => void) => (_: A) => void;
export declare type C<A> = {
    comp: (ctxt: () => Context) => (cont: Cont<A>) => JSX.Element;
    then: <B>(key: string, k: (_: A) => C<B>, className?: string, dbg?: () => string) => C<B>;
    never: <B>(key?: string) => C<B>;
    ignore: (key?: string) => C<void>;
    ignore_with: <B>(x: B) => C<B>;
    map: <B>(f: (_: A) => B, key?: string, dbg?: () => string) => C<B>;
    filter: (f: (_: A) => boolean, key?: string, dbg?: () => string) => C<A>;
};
export declare function make_C<A>(comp: (ctxt: () => Context) => (cont: Cont<A>) => JSX.Element): C<A>;
export declare let unit: <A>(x: A, key?: string, dbg?: () => string) => C<A>;
export declare type JoinProps<A> = {
    p: C<C<A>>;
} & CmdCommon<A>;
export declare type JoinState<A> = {
    p_inner: "waiting" | JSX.Element;
    p_outer: JSX.Element;
};
export declare let bind: <A, B>(key: string, p: C<A>, k: (_: A) => C<B>, className?: string, dbg?: () => string) => C<B>;
export declare let map: <A, B>(key?: string, dbg?: () => string) => (_: (_: A) => B) => (_: C<A>) => C<B>;
export declare let filter: <A>(key?: string, dbg?: () => string) => (_: (_: A) => boolean) => (_: C<A>) => C<A>;
export declare let should_component_update: <A, B>(key?: string, dbg?: () => string) => (_: (_: A) => boolean) => (_: (_: A) => C<B>) => (_: A) => C<B>;
export declare type SimpleApplicationProps<A> = {
    p: C<A>;
    cont: (_: A) => void;
};
export declare type SimpleApplicationState<A> = {
    context: Context;
};
export declare class SimpleApplication<A> extends React.Component<SimpleApplicationProps<A>, SimpleApplicationState<A>> {
    constructor(props: SimpleApplicationProps<A>, context: any);
    context_from_props(props: SimpleApplicationProps<A>, p: C<void>): Context;
    render(): JSX.Element;
}
export declare let simple_application: <A>(p: C<A>, cont: (_: A) => void) => JSX.Element;
