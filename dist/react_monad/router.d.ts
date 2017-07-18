/// <reference types="react" />
import * as React from "react";
import * as Immutable from "immutable";
import * as Option from "./option";
import { C, Mode, Context } from './core';
export declare type UrlElement<K> = string | {
    kind: "int";
    name: K;
};
export declare type UrlTemplate<K> = Array<UrlElement<K>>;
export declare let parse_url: <T, K extends keyof T>(template: UrlElement<K>[]) => (url: string) => Option.Option<T>;
export declare let instantiate_url: <T, K extends keyof T>(template: UrlElement<K>[]) => (t: T) => string;
export declare type Url<T> = PartialRetraction<string, T>;
export declare let make_url: <T, K extends keyof T>(template: UrlElement<K>[]) => PartialRetraction<string, T>;
export declare let fallback_url: () => PartialRetraction<string, {}>;
export declare type PartialRetraction<A, B> = {
    in: (_: A) => Option.Option<B>;
    out: (_: B) => A;
};
export declare type Route<A> = {
    url: Url<A>;
    page: (_: A) => C<void>;
};
export declare type ApplicationProps = {
    mode: Mode;
    base_url: string;
    slug: string;
    routes: Immutable.List<Route<{}>>;
};
export declare type ApplicationState = {
    context: Context;
};
export declare class Application extends React.Component<ApplicationProps, ApplicationState> {
    constructor(props: ApplicationProps, context: any);
    context_from_props(props: ApplicationProps, p: C<void>): Context;
    render(): JSX.Element;
}
export declare let application: (mode: Mode, base_url: string, slug: string, routes: Immutable.List<Route<{}>>) => JSX.Element;
export declare let get_context: (key?: string, dbg?: () => string) => C<Context>;
export declare let link_to_route: <T>(label: string, x: T, r: Route<T>, key?: string, className?: string) => C<void>;
