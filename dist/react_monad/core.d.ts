/// <reference types="react" />
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
export declare type Mode = "edit" | "view";
export declare type Context = {
    mode: Mode;
    set_mode: (new_mode: Mode, callback?: () => void) => C<void>;
    logic_frame: number;
    force_reload: (callback?: () => void) => C<void>;
    current_page: C<void>;
    set_page: <T>(x: T, new_page: Route<T>, callback?: () => void) => C<void>;
    set_url: <T>(x: T, new_url: Url<T>, callback?: () => void) => C<void>;
};
export declare type Cont<A> = (callback: () => void) => (_: A) => void;
export declare type C<A> = {
    comp: (ctxt: () => Context) => (cont: Cont<A>) => JSX.Element;
    bind: <B>(key: string, k: (_: A) => C<B>, className?: string, dbg?: () => string) => C<B>;
    never: <B>(key?: string) => C<B>;
    ignore: (key?: string) => C<void>;
    ignore_with: <B>(x: B) => C<B>;
    map: <B>(f: (_: A) => B, key?: string, dbg?: () => string) => C<B>;
    filter: (f: (_: A) => boolean, key?: string, dbg?: () => string) => C<A>;
};
export declare function make_C<A>(comp: (ctxt: () => Context) => (cont: Cont<A>) => JSX.Element): C<A>;
export declare let unit: <A>(x: A, key?: string, dbg?: () => string) => C<A>;
export declare let bind: <A, B>(key: string, p: C<A>, k: (_: A) => C<B>, className?: string, dbg?: () => string) => C<B>;
export declare let map: <A, B>(key?: string, dbg?: () => string) => (_: (_: A) => B) => (_: C<A>) => C<B>;
export declare let filter: <A>(key?: string, dbg?: () => string) => (_: (_: A) => boolean) => (_: C<A>) => C<A>;
