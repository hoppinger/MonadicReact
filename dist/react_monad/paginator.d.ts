import { C } from '../react_monad/core';
export declare type Page<A> = {
    num_pages: number;
    page_index: number;
    items: A;
};
export declare let paginate: <A, B>(items_per_page: number, get_page: (current_page: number, items_per_page: number) => C<Page<A>>, key?: string, dbg?: () => string) => (renderer: (items: A) => C<B>) => C<B>;
