const { config } = require('dotenv');
const { join } = require('path');
config({ path: join(__dirname, './.env') });

const { MyKV } = require('../dist');

module.exports.db = new MyKV({
    connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USERNAME,
        database: process.env.DB_DATABASE,
        password: process.env.DB_PASSWORD,
    },
});
