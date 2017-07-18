import { C, Mode } from './core';
export declare type MediaType = 'image' | 'video' | 'youtube';
export declare function rich_text(json_state: string, mode: Mode, key?: string, dbg?: () => string): C<string>;
