import { createConfig, checkRequired } from './helpers/config';
import * as mysql from 'mysql2/promise';
import { stringify, parse } from 'json-buffer';

class MyKV {
    #options;
    #connection: any;

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

    async get(key: string): Promise<any> {
        const [rows] = await this.#connection.execute(
            `SELECT * FROM ${this.#options.table} WHERE \`key\` = ? LIMIT 1`,
            [key],
        );

        if (rows.length == 0) return undefined;
        return parse(rows[0].value).data;
    }

    async set(key: string, value: any): Promise<void> {
        await this.#connection.execute(
            `INSERT IGNORE INTO ${
                this.#options.table
            } (\`key\`, \`value\`) VALUES (?, ?);`,
            [key, stringify({ data: value })],
        );
    }

    async del(key: string): Promise<void> {
        await this.#connection.execute(
            `DELETE FROM ${this.#options.table} WHERE \`key\` = ?`,
            [key],
        );
    }

    close(): void {
        if (!this.open) throw new Error('Connection is already closed');
        this.#connection.end();
    }

    async connect(): Promise<void> {
        if (this.open) throw new Error('Connection is already open');

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

        // Create the table
        await this.#connection.execute(
            `CREATE TABLE IF NOT EXISTS ${
                this.#options.table
            } (\`key\` VARCHAR(64) PRIMARY KEY NOT NULL, \`value\` TEXT DEFAULT "{ \\"data\\": null }")`,
        );

        return;
    }
}

export { MyKV };
export default MyKV;
