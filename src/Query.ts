import * as mysql from 'mysql2';

export default class Query {
    #connection: mysql.Pool;
    #table: string;

    constructor(connection: mysql.Pool, table: string) {
        this.#connection = connection;
        this.#table = table;
    }

    async execute(query: string, ...items: any[]): Promise<mysql.Query> {
        return this.#connection.execute(
            query.replace(/:table/gi, this.#table),
            items,
        );
    }
}
