import * as Moment from 'moment';
import { C, Mode, CmdCommon } from './core';
export declare type OptionalParameters = {
    disabled?: boolean,
    size?: number
}
export declare type NumberProps = {
    kind: "number";
    value: number;
    mode: Mode;
} & CmdCommon<number>;
export declare type StringType = "email" | "tel" | "text" | "url" | "password";
export declare type StringProps = {
    kind: "string";
    value: string;
    type: StringType;
    mode: Mode;
} & CmdCommon<string>;
export declare type BooleanStyle = "checkbox" | "fancy toggle" | "plus/minus" | "radio";
export declare type BoolProps = {
    kind: "bool";
    value: boolean;
    mode: Mode;
    style: BooleanStyle;
} & CmdCommon<boolean>;
export declare type DateProps = {
    kind: "date";
    value: Moment.Moment;
    mode: Mode;
} & CmdCommon<Moment.Moment>;
export declare type DateTimeProps = {
    kind: "date time";
    value: Moment.Moment;
    mode: Mode;
} & CmdCommon<Moment.Moment>;
export declare type TimeProps = {
    kind: "time";
    value: Moment.Moment;
    mode: Mode;
} & CmdCommon<Moment.Moment>;
export declare let number: (mode: Mode, key?: string, dbg?: () => string) => (value: number) => C<number>;
export declare let string: (mode: Mode, type?: StringType, key?: string, dbg?: () => string, optional_parameters?: OptionalParameters) => (value: string) => C<string>;
export declare let bool: (mode: Mode, style: BooleanStyle, key?: string, dbg?: () => string) => (value: boolean) => C<boolean>;
export declare let date_time: (mode: Mode, key?: string, dbg?: () => string) => (value: Moment.Moment) => C<Moment.Moment>;
export declare let date: (mode: Mode, key?: string, dbg?: () => string) => (value: Moment.Moment) => C<Moment.Moment>;
export declare let time: (mode: Mode, key?: string, dbg?: () => string) => (value: Moment.Moment) => C<Moment.Moment>;
