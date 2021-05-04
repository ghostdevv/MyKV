import { configent } from 'configent';
import defaults from '../config.defaults';

export const createConfig = (inp: Object) =>
    configent(defaults, inp, {
        name: 'mykv',
    });

export const checkRequired = (options: Object, required: String[] = []) => {
    for (const item of required) {
        // @ts-ignore
        if (!options[item] || options[item] == '') return false;
    }

    return true;
};
