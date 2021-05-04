import { configent } from 'configent';
import defaults from '../config.defaults.js';

export const createConfig = (inp) =>
    configent(defaults, inp, {
        name: 'mykv',
    });

export const checkRequired = (options, required = []) => {
    for (const item of required) {
        if (!options[item]) return false;
    }

    return true;
};
