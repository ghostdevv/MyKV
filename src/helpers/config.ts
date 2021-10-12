import defaults from '../config.defaults';
import { configent } from 'configent';

/**
 * Use configent to merge a config with defaults
 */
export const createConfig = (inp: Object) =>
    configent(defaults, inp, {
        name: 'mykv',
    });

/**
 * Check config has requried options
 */
export const checkRequired = (options: Record<string, any>, required: string[] = []) => {
    for (const item of required) {
        if (!options[item] || options[item] == '') return false;
    }

    return true;
};
