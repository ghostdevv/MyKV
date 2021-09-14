export default {
    /**
     * The table that key value pairs are stored in
     */
    table: 'mykv',

    /**
     * The host the db is running on
     */
    host: '',

    /**
     * The name of the database to use
     */
    database: '',

    /**
     * The username to authenticate with
     */
    user: '',

    /**
     * The password to authenticate with
     */
    password: '',

    /**
     * The port the database is running on, on the host
     */
    port: 3306,

    /**
     * Whether to wait for connections (sql pools)
     */
    waitForConnections: true,

    /**
     * Sql pool connection limit
     */
    connectionLimit: 10,

    /**
     * Sql pool queue limit
     */
    queueLimit: 0,
};
