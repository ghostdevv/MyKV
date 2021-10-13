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

db.connect().then(async () => {
    console.log('Connected');

    for (let i = 0; i < 3; i++) {
        await db.set(i.toString(), i);
        console.log(await db.get(i.toString()));
    }

    console.log(await db.has('a'));

    console.log(await db.values(2));
});
