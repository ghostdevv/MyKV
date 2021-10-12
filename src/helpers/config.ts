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
export const checkRequired = (options: Object, required: String[] = []) => {
    for (const item of required) {
        // @ts-ignore
        if (!options[item] || options[item] == '') return false;
    }

    return true;
};
