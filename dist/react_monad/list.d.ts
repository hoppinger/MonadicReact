import * as Immutable from "immutable";
import { C } from '../react_monad/core';
export declare let list: <A, B>(items: Immutable.List<A>, key?: string, className?: string, dbg?: () => string) => (renderer: (index: number) => (_: A) => C<B>) => C<B>;
