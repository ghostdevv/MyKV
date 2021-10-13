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
    async clear(): Promise<void> {
        if (!this.connected)
            throw new Error(
                'You must be connected to the db to do this, try await db.connect',
            );

        await this.store.del();
    }

    /**
     * Get a key's value from the db
     */
    async get<T extends string>(key: string): Promise<T | undefined> {
        if (!this.connected)
            throw new Error(
                'You must be connected to the db to do this, try await db.connect',
            );

        if (typeof key != 'string')
            throw new TypeError(
                `Key should be a string, recieved ${typeof key}`,
            );

        const value = await this.store.select('value').where({ key }).first();

        return value ? parse(value.value) : undefined;
    }

    /**
     * Set the value of a key
     */
    async set(key: string, value: any): Promise<void> {
        if (!this.connected)
            throw new Error(
                'You must be connected to the db to do this, try await db.connect',
            );

        if (typeof key != 'string')
            throw new TypeError(
                `Key should be a string, recieved ${typeof key}`,
            );

        await this.store
            .insert({ key, value: stringify(value) })
            .onConflict('key')
            .merge();
    }

    /**
     * Check if a key exists
     */
    async has(key: string): Promise<boolean> {
        if (!this.connected)
            throw new Error(
                'You must be connected to the db to do this, try await db.connect',
            );

        if (typeof key != 'string')
            throw new TypeError(
                `Key should be a string, recieved ${typeof key}`,
            );

        const h = await this.store.select('key').where({ key }).first();

        return !!h;
    }

    /**
     * Delete a key
     */
    async del(key: string): Promise<void> {
        if (!this.connected)
            throw new Error(
                'You must be connected to the db to do this, try await db.connect',
            );

        if (typeof key != 'string')
            throw new TypeError(
                `Key should be a string, recieved ${typeof key}`,
            );

        await this.store.del().where({ key });
    }

    /**
     * Get all keys
     */
    async keys(limit?: number): Promise<string[]> {
        if (!this.connected)
            throw new Error(
                'You must be connected to the db to do this, try await db.connect',
            );

        if (limit && isNaN(limit))
            throw new TypeError('The limit must be a number');

        const q = this.store;
        if (limit) q.limit(limit);

        const k = await q.select('key');

        return k ? k.map((x) => x.key) : [];
    }

    /**
     * Get all values
     */
    async values(limit?: number): Promise<any[]> {
        if (!this.connected)
            throw new Error(
                'You must be connected to the db to do this, try await db.connect',
            );

        if (limit && isNaN(limit))
            throw new TypeError('The limit must be a number');

        const q = this.store;
        if (limit) q.limit(limit);

        const v = await q.select('value');

        return v ? v.map((x) => parse(x.value)) : [];
    }

    /**
     * Get all keys and values in tuple form
     */
    async entries(limit?: number): Promise<[string, any][]> {
        if (!this.connected)
            throw new Error(
                'You must be connected to the db to do this, try await db.connect',
            );

        if (limit && isNaN(limit))
            throw new TypeError('The limit must be a number');

        const q = this.store;
        if (limit) q.limit(limit);

        const kv = await q.select();

        return kv ? kv.map((x) => [x.key, parse(x.value)]) : [];
    }
}

export default MyKV;
