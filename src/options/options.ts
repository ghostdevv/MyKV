import { Knex } from 'knex';

export const defaults: MyKVOptions = {
    table: 'mykv',

    client: 'mysql',

    pool: {
        min: 1,
        max: 10
    }
}

/**
 * MyKV uses knex under the hood, along with some aditional configuration to make your life easier
 */
export interface MyKVOptions extends Knex.Config {
    /**
     * The table MyKV should store your data in
     */
    table: string;
}