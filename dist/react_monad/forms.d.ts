import * as Immutable from "immutable";
import { C, Mode } from './core';
import * as Moment from 'moment';
export declare type FormErrors = {
    errors: Immutable.Map<string, Array<string>>;
};
export declare type FormData<M> = {
    model: M;
} & FormErrors;
export declare type FormEntry<M> = {
    kind: "string";
    field_name: string;
    in: (_: M) => string;
    out: (_: M) => (_: string) => M;
    get_errors: (_: M) => Array<string>;
} | {
    kind: "number";
    field_name: string;
    in: (_: M) => number;
    out: (_: M) => (_: number) => M;
    get_errors: (_: M) => Array<string>;
} | {
    kind: "date";
    field_name: string;
    in: (_: M) => Moment.Moment;
    out: (_: M) => (_: Moment.Moment) => M;
    get_errors: (_: M) => Array<string>;
} | {
    kind: "time";
    field_name: string;
    in: (_: M) => Moment.Moment;
    out: (_: M) => (_: Moment.Moment) => M;
    get_errors: (_: M) => Array<string>;
} | {
    kind: "datetime";
    field_name: string;
    in: (_: M) => Moment.Moment;
    out: (_: M) => (_: Moment.Moment) => M;
    get_errors: (_: M) => Array<string>;
} | {
    kind: "image";
    field_name: string;
    in: (_: M) => string;
    out: (_: M) => (_: string) => M;
    get_errors: (_: M) => Array<string>;
} | {
    kind: "file";
    field_name: string;
    filename: (_: M) => string;
    url: (_: M) => string;
    in: (_: M) => File;
    out: (_: M) => (_: File) => M;
    get_errors: (_: M) => Array<string>;
} | {
    kind: "lazy image";
    field_name: string;
    download: (c: M) => C<string>;
    upload: (c: M) => (src: string) => C<string>;
} | {
    kind: "lazy file";
    field_name: string;
    filename: (_: M) => string;
    out: (_: M) => (_: File) => M;
    url: (_: M) => string;
    upload: (_: M) => (_: File) => C<void>;
};
export declare let simple_inner_form: <M>(mode: Mode, model_name: (_: M) => string, entries: FormEntry<M>[]) => (_: FormData<M>) => C<FormData<M>>;
export declare let form_errors: <M>(model_name: (_: M) => string, entries: FormEntry<M>[]) => (fd: any) => C<FormData<M>>;
export declare let simple_form_with_autosave: <M>(mode: Mode, model_name: (_: M) => string, entries: FormEntry<M>[], download_M: C<M>, upload_M: (_: M) => C<M>) => C<void>;
export declare let simple_form_with_save_button: <M>(mode: Mode, model_name: (_: M) => string, entries: FormEntry<M>[], download_M: C<M>, upload_M: (_: M) => C<M>) => C<void>;
export declare let simple_form_with_prev_and_next_buttons: <M>(mode: Mode, model_name: (_: M) => string, entries: FormEntry<M>[], prev_enabled: (_: FormData<M>) => boolean, next_enabled: (_: FormData<M>) => boolean, prev_visible: (_: FormData<M>) => boolean, next_visible: (_: FormData<M>) => boolean, on_prev: (_: M) => M, on_next: (_: M) => M) => (_: FormData<M>) => C<FormData<M>>;
