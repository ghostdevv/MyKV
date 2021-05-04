const { join } = require('path');
require('dotenv').config({ path: join(__dirname, './.env') });
const { MyKV } = require('../../dist/MyKV.js');

const { test } = require('uvu');
const assert = require('uvu/assert');

const { host, user, database, password } = process.env;

const db = new MyKV({
    host,
    user,
    database,
    password,
});

test('setting and getting a value', async () => {
    await db.connect();

    await db.set('test', true);
    const v = await db.get('test');

    if (v !== true) throw new Error('Failed');

    db.close();
});

test('deleting a value', async () => {
    await db.connect();

    await db.set('test', true);
    await db.del('test');

    const v = await db.get('test');
    if (v !== undefined) throw new Error('Failed');

    db.close();
});

test('database open getter works', async () => {
    await db.connect();

    assert.is(db.open, true);

    db.close();

    assert.is(db.open, false);
});

test.run();
