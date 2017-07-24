import { C, Mode } from './core';
export declare type MediaType = 'image' | 'video' | 'youtube';
export declare function rich_text(mode: Mode, key?: string, dbg?: () => string): (_: string) => C<string>;
