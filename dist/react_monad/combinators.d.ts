/// <reference types="react" />
import * as Immutable from "immutable";
import { C, Cont, CmdCommon, Context } from './core';
export declare type RepeatProps<A> = {
    kind: "repeat";
    value: A;
    p: (_: A) => C<A>;
} & CmdCommon<A>;
export declare type AllProps<A> = {
    kind: "all";
    ps: Array<C<A>>;
} & CmdCommon<Array<A>>;
export declare type AnyProps<A, B> = {
    kind: "any";
    value: A;
    ps: Array<(_: A) => C<B>>;
    className: string;
} & CmdCommon<B>;
export declare type NeverProps<A, B> = {
    kind: "never";
    p: C<A>;
} & CmdCommon<B>;
export declare type RetractProps<A, B> = {
    kind: "retract";
    inb: (_: A) => B;
    out: (_: A) => (_: B) => A;
    p: (_: B) => C<B>;
    value: A;
} & CmdCommon<A>;
export declare type DelayProps<A> = {
    kind: "delay";
    dt: number;
    value: A;
    p: (_: A) => C<A>;
} & CmdCommon<A>;
export declare type RetryStrategy = "never" | "semi exponential";
export declare type LiftPromiseProps<A, B> = {
    kind: "lift promise";
    p: (_: B) => Promise<A>;
    retry_strategy: RetryStrategy;
    value: B;
} & CmdCommon<A>;
export declare type SimpleMenuType = "side menu" | {
    kind: "tabs";
    max_tabs: number;
};
export declare let repeat: <A>(p: (_: A) => C<A>, key?: string, dbg?: () => string) => (_: A) => C<A>;
export declare let any: <A, B>(ps: ((_: A) => C<B>)[], key?: string, className?: string, dbg?: () => string) => (_: A) => C<B>;
export declare let never: <A, B>(p: C<A>, key?: string) => C<B>;
export declare let all: <A>(ps: C<A>[], key?: string, dbg?: () => string) => C<A[]>;
export declare let retract: <A, B>(inb: (_: A) => B, out: (_: A) => (_: B) => A, p: (_: B) => C<B>, key?: string, dbg?: () => string) => (_: A) => C<A>;
export declare let lift_promise: <A, B>(p: (_: A) => Promise<B>, retry_strategy: RetryStrategy, key?: string, dbg?: () => string) => (_: A) => C<B>;
export declare let delay: <A>(dt: number, key?: string, dbg?: () => string) => (p: (_: A) => C<A>) => (_: A) => C<A>;
export declare let mk_submenu_entry: <A>(label: string, children: MenuEntryValue<A>[]) => MenuEntrySubMenu<A>;
export declare let mk_menu_entry: <A>(v: A) => MenuEntryValue<A>;
export declare type MenuEntryValue<A> = {
    kind: "item";
    value: A;
};
export declare type MenuEntrySubMenu<A> = {
    kind: "sub menu";
    label: string;
    children: Array<MenuEntryValue<A>>;
};
export declare type MenuEntry<A> = MenuEntryValue<A> | MenuEntrySubMenu<A>;
export declare let simple_menu: <A, B>(type: SimpleMenuType, to_string: (_: A) => string, key?: string, dbg?: () => string) => (items: Immutable.List<MenuEntry<A>>, p: (_: A) => C<B>, selected_item?: A, selected_sub_menu?: string) => C<B>;
export declare let custom: <A>(key?: string, dbg?: () => string) => (render: (ctxt: () => Context) => (_: Cont<A>) => JSX.Element) => C<A>;
export declare let hide: (f_name: string, f: C<void>) => C<void>;
