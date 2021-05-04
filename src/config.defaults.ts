export default {
    // Database Settings
    table: 'mykv',

    // Required (given when running new MyKV())
    host: '',
    database: '',
    user: '',
    password: '',

    // Connection settings
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
};
