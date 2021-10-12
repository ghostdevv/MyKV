import 'dotenv/config';
import { MyKV } from 'mykv';

const db = new MyKV({
    connection: {
        host: process.env.HOST,
        user: process.env.USER,
        database: process.env.DATABASE,
        password: process.env.PASSWORD,
    },
});
