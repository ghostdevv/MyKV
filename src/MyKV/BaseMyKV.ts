import { defaults, MyKVOptions } from '../options/options';
import { createConfig } from '../options/helpers';
import knex from 'knex';

export interface MyKVRecord {
    key: string;
    value: string;
}

export class BaseMyKV {
    protected readonly options;
    protected readonly driver;

    private _connected = false;

    constructor(options?: MyKVOptions) {
        this.options = createConfig(options || defaults);
        this.driver = knex(this.options);
    }

    /**
     * Get the knex store for this instance of mykv
     */
    public get store() {
        return this.driver.from<MyKVRecord>(this.options.table);
    }

    /**
     * Check whether the database is connected
     */
    public get connected() {
        return this._connected;
    }

    /**
     * Closes the connection to the database
     */
    async close(): Promise<void> {
        this._connected = false;
        await this.driver.destroy();
    }

    /**
     * Get the raw knex connection
     */
    public get raw() {
        return this.driver;
    }

    /**
     * Connect to the db
     */
    async connect(): Promise<void> {
        if (!(await this.driver.schema.hasTable(this.options.table)))
            await this.driver.schema.createTable(
                this.options.table,
                (table) => {
                    table.string('key', 64);
                    table.text('value');
                    table.primary(['key']);
                    table.unique(['key']);
                },
            );

        // Test the connection
        await this.driver.raw('select 1+1 as result');

        this._connected = true;
    }
}
