import { defaults, MyKVOptions } from './options/options';
import { createConfig } from './options/helpers';
import knex from 'knex';

export interface MyKVRecord {
    key: string;
    value: string | undefined | null;
}

export class MyKV {
    private readonly options;
    private readonly db;

    private connected = false;

    constructor(options?: MyKVOptions) {
        this.options = createConfig(options || defaults);
        this.db = knex(this.options);
    }

    /**
     * Closes the connection to the database
     */
    async close(): Promise<void> {
        await this.db.destroy();
        this.connected = false;
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

        this.connected = true;
    }
}

export default MyKV;
