import 'dotenv/config';
import { MyKV } from 'mykv';

const db = new MyKV({
    connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USERNAME,
        database: process.env.DB_DATABASE,
        password: process.env.DB_PASSWORD,
    },
});

db.connect().then(() => console.log('Connected'));
