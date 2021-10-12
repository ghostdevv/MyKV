import { defaults, MyKVOptions } from './options';
import { configent } from 'configent';

/**
 * Use configent to merge a config with defaults
 */
export const createConfig = (inp: Object): MyKVOptions =>
    configent(defaults, inp, {
        name: 'mykv',
    });
