import { configent } from 'configent';
import { defaults } from './options';

/**
 * Use configent to merge a config with defaults
 */
export const createConfig = (inp: Object) =>
    configent(defaults, inp, {
        name: 'mykv',
    });
