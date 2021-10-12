import { defaults, MyKVOptions } from '../options/options';
import { createConfig } from '../options/helpers';
import knex from 'knex';

export class BaseMyKV {
    protected readonly options;
    protected readonly db;

    private _connected = false;

    constructor(options?: MyKVOptions) {
        this.options = createConfig(options || defaults);
        this.db = knex(this.options);
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
        await this.db.destroy();
        this._connected = false;
    }

    /**
     * Get the raw knex connection
     */
    public get raw() {
        return this.db;
    }

    /**
     * Connect to the db
     */
    async connect(): Promise<void> {
        if (!(await this.db.schema.hasTable(this.options.table)))
            await this.db.schema.createTable(this.options.table, (table) => {
                table.string('key', 64);
                table.text('value');
                table.primary(['key']);
                table.unique(['key']);
            });

        // Test the connection
        await this.db.raw('select 1+1 as result');

        this._connected = true;
    }
}
