import { MyKVOptions } from '../options/options';
import { parse, stringify } from 'json-buffer';
import { BaseMyKV } from './BaseMyKV';

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

    async set(key: string, value: any): Promise<void> {
        if (typeof key != 'string')
            throw new TypeError(
                `Key should be a string, recieved ${typeof key}`,
            );

        await this.store
            .insert({ key, value: stringify(value) })
            .onConflict('key')
            .merge();
    }

    async has(key: string): Promise<boolean> {
        if (typeof key != 'string')
            throw new TypeError(
                `Key should be a string, recieved ${typeof key}`,
            );

        const h = await this.store.select('key').where({ key }).first();

        return !!h;
    }

    async del(key: string): Promise<void> {
        if (typeof key != 'string')
            throw new TypeError(
                `Key should be a string, recieved ${typeof key}`,
            );

        await this.store.del().where({ key });
    }

    async keys(limit?: number): Promise<string[]> {
        if (limit && isNaN(limit))
            throw new TypeError('The limit must be a number');

        const q = this.store;
        if (limit) q.limit(limit);

        const k = await q.select('key');

        return k ? k.map((x) => x.key) : [];
    }

    async values(limit?: number): Promise<any[]> {
        if (limit && isNaN(limit))
            throw new TypeError('The limit must be a number');

        const q = this.store;
        if (limit) q.limit(limit);

        const v = await q.select('value');

        return v ? v.map((x) => parse(x.value)) : [];
    }

    async entries(limit?: number): Promise<[string, any][]> {
        if (limit && isNaN(limit))
            throw new TypeError('The limit must be a number');

        const q = this.store;
        if (limit) q.limit(limit);

        const kv = await q.select();

        return kv ? kv.map((x) => [x.key, parse(x.value)]) : [];
    }
}

export default MyKV;
