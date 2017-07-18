import * as Immutable from "immutable";
import { C, CmdCommon, Mode } from './core';
export declare type H1Props<A, B> = {
    kind: "h1";
    className: string | undefined;
    text: string;
    value: A;
    p: (_: A) => C<B>;
} & CmdCommon<B>;
export declare type H2Props<A, B> = {
    kind: "h2";
    className: string | undefined;
    text: string;
    value: A;
    p: (_: A) => C<B>;
} & CmdCommon<B>;
export declare type LabelProps<A, B> = {
    kind: "label";
    className: string | undefined;
    text: string;
    span_before_content: boolean;
    value: A;
    p: (_: A) => C<B>;
} & CmdCommon<B>;
export declare type DivProps<A, B> = {
    kind: "div";
    className: string | undefined;
    value: A;
    ps: Array<(_: A) => C<void>>;
    p: (_: A) => C<B>;
} & CmdCommon<B>;
export declare type FormProps<A, B> = {
    kind: "form";
    className: string | undefined;
    value: A;
    p: (_: A) => C<B>;
} & CmdCommon<B>;
export declare type MultiSelectorType = "list" | "checkbox";
export declare type MultiSelectorProps<A> = {
    kind: "multi selector";
    type: MultiSelectorType;
    to_string: (_: A) => string;
    items: Immutable.List<A>;
    selected_items: undefined | Immutable.List<A>;
} & CmdCommon<Immutable.List<A>>;
export declare type ImageProps = {
    kind: "image";
    src: string;
    mode: Mode;
} & CmdCommon<string>;
export declare type SelectorType = "dropdown" | "radio";
export declare type SelectorProps<A> = {
    kind: "selector";
    type: SelectorType;
    to_string: (_: A) => string;
    items: Immutable.List<A>;
    selected_item: undefined | A;
} & CmdCommon<A>;
export declare type ButtonProps<A> = {
    kind: "button";
    type: "a" | "button";
    label: string;
    x: A;
    disabled: boolean;
    className: string;
} & CmdCommon<A>;
export declare type LinkProps = {
    kind: "link";
    label: string;
    url: string;
    disabled: boolean;
} & CmdCommon<void>;
export declare type FileProps = {
    kind: "file";
    label: string;
    url: string;
    mode: Mode;
    disabled: boolean;
} & CmdCommon<File>;
export declare function label<A, B>(text: string, span_before_content?: boolean, className?: string, key?: string, dbg?: () => string): (p: (_: A) => C<B>) => ((_: A) => C<B>);
export declare function h1<A, B>(text: string, className?: string, key?: string, dbg?: () => string): (p: (_: A) => C<B>) => ((_: A) => C<B>);
export declare function h2<A, B>(text: string, className?: string, key?: string, dbg?: () => string): (p: (_: A) => C<B>) => ((_: A) => C<B>);
export declare function div<A, B>(className?: string, key?: string, dbg?: () => string): (ps: Array<(_: A) => C<void>>) => (p: (_: A) => C<B>) => ((_: A) => C<B>);
export declare function overlay<A, B>(key?: string, dbg?: () => string): (ps: Array<(_: A) => C<void>>) => (p: (_: A) => C<B>) => ((_: A) => C<B>);
export declare function form<A, B>(className?: string, key?: string, dbg?: () => string): (p: (_: A) => C<B>) => ((_: A) => C<B>);
export declare let selector: <A>(type: SelectorType, to_string: (_: A) => string, key?: string, dbg?: () => string) => (items: Immutable.List<A>, selected_item?: A) => C<A>;
export declare let multi_selector: <A>(type: MultiSelectorType, to_string: (_: A) => string, key?: string, dbg?: () => string) => (items: Immutable.List<A>, selected_items?: Immutable.List<A>) => C<Immutable.List<A>>;
export declare let image: (mode: Mode, key?: string, dbg?: () => string) => (src: string) => C<string>;
export declare let a: <A>(label: string, disabled?: boolean, key?: string, className?: string, dbg?: () => string) => (x: A) => C<A>;
export declare let button: <A>(label: string, disabled?: boolean, key?: string, className?: string, dbg?: () => string) => (x: A) => C<A>;
export declare let link: <A>(label: string, url: string, disabled?: boolean, key?: string, dbg?: () => string) => C<void>;
export declare let file: <A>(mode: Mode, label: string, url: string, disabled?: boolean, key?: string, dbg?: () => string) => C<File>;
