import { MyKVOptions } from '../options/options';
import { BaseMyKV } from './BaseMyKV';
import { parse } from 'json-buffer';

export class MyKV extends BaseMyKV {
    constructor(options?: MyKVOptions) {
        super(options);
    }

    /**
     * Empty the database
     */
    clear() {
        return this.store.del();
    }

    async get<T extends string>(key: string): Promise<T | undefined> {
        if (typeof key != 'string')
            throw new TypeError(
                `Key should be a string, recieved ${typeof key}`,
            );

        const value = await this.store.select('value').where({ key }).first();

        return value ? parse(value.value) : undefined;
    }
}

export default MyKV;
