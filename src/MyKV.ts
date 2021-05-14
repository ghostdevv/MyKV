import { createConfig, checkRequired } from './helpers/config';
import { stringify, parse } from 'json-buffer';
import * as mysql from 'mysql2/promise';
import Query from './Query';

class MyKV {
    #options;
    #connection: any;
    #query: any;

    constructor(options = {}) {
        this.#options = createConfig(options);

        const hasRequired = checkRequired(this.#options, [
            'database',
            'host',
            'user',
            'password',
        ]);

        if (!hasRequired)
            throw new Error(
                'Please check you have all required options: database, host, user, and password',
            );
    }

    get open(): boolean {
        const v = this.#connection?.pool?._closed;
        return v == undefined ? false : !v;
    }

    async get<T>(key: string): Promise<T | undefined> {
        if (typeof key != 'string')
            throw new TypeError(
                `Key should be a string, recieved ${typeof key}`,
            );

        const [rows] = await this.#query.execute(
            'SELECT * FROM :table WHERE `key` = ? LIMIT 1',
            [key],
        );

        if (rows.length == 0) return undefined;
        return parse(rows[0].value).data;
    }

    async set(key: string, value: any): Promise<void> {
        if (typeof key != 'string')
            throw new TypeError(
                `Key should be a string, recieved ${typeof key}`,
            );

        value = stringify({ data: value });

        await this.#query.execute(
            'INSERT INTO :table (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value` = ?;',
            [key, value, value],
        );
    }

    async has(key: string): Promise<boolean> {
        if (typeof key != 'string')
            throw new TypeError(
                `Key should be a string, recieved ${typeof key}`,
            );

        const [rows] = await this.#query.execute(
            'SELECT `key` FROM :table WHERE `key` = ? LIMIT 1',
            [key],
        );

        return rows.length > 0;
    }

    async del(key: string): Promise<void> {
        if (typeof key != 'string')
            throw new TypeError(
                `Key should be a string, recieved ${typeof key}`,
            );

        await this.#query.execute('DELETE FROM :table WHERE `key` = ?', [key]);
    }

    async clear(): Promise<void> {
        await this.#query.execute('DELETE FROM :table');
    }

    async keys(limit: number): Promise<String[]> {
        if (limit && isNaN(limit))
            throw new TypeError('The limit must be a number');

        const [res] = await this.#query.execute(
            'SELECT `key` from :table' +
                (!isNaN(limit) ? ` LIMIT ${limit}` : ''),
        );

        return res.map(({ key }: { key: string }) => key);
    }

    async values(limit: number): Promise<any[]> {
        if (limit && isNaN(limit))
            throw new TypeError('The limit must be a number');

        const [res] = await this.#query.execute(
            'SELECT `value` from :table' +
                (!isNaN(limit) ? ` LIMIT ${limit}` : ''),
        );

        return res.map(({ value }: { value: any }) => parse(value).data);
    }

    async entries(limit: number): Promise<IterableIterator<[any, any]>> {
        if (limit && isNaN(limit))
            throw new TypeError('The limit must be a number');

        const [res] = await this.#query.execute(
            'SELECT * from :table' + (!isNaN(limit) ? ` LIMIT ${limit}` : ''),
        );

        return res.map(({ key, value }: { key: string; value: any }) => [
            key,
            parse(value).data,
        ]);
    }

    close(): void {
        if (!this.open) throw new Error('Connection is already closed');
        this.#connection.end();
    }

    async connect(): Promise<void> {
        if (this.open) return;

        // Connect
        this.#connection = mysql.createPool({
            host: this.#options.host,
            port: this.#options.port,

            database: this.#options.database,

            user: this.#options.user,
            password: this.#options.password,

            waitForConnections: this.#options.waitForConnections,
            connectionLimit: this.#options.connectionLimit,
            queueLimit: this.#options.queueLimit,
        });

        this.#query = new Query(this.#connection, this.#options.table);

        // Create the table
        await this.#query.execute(
            'CREATE TABLE IF NOT EXISTS :table (`key` VARCHAR(64) PRIMARY KEY NOT NULL, `value` TEXT DEFAULT "{ \\"data\\": null }")',
        );

        return;
    }
}

export { MyKV };
export default MyKV;
