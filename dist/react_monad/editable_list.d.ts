import { List } from "immutable";
import { C } from '../react_monad/core';
export declare type EditableListState<A> = {
    items: List<A>;
    selected_index: undefined | number;
};
export declare type ListOperation<A> = {
    kind: "add";
    value: A;
} | {
    kind: "remove";
    value: A;
    index: number;
} | {
    kind: "toggle";
    value: A;
    index: number;
    selected: boolean;
};
export declare let editable_list: <A>(list_name: string, initial_items: C<List<A>>, create_new_form: (_: EditableListState<A>) => C<A>) => C<EditableListState<A>>;
