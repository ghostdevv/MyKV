const { join } = require('path');
require('dotenv').config({ path: join(__dirname, './.env') });
const { MyKV } = require('../dist');

const { test } = require('uvu');
const assert = require('uvu/assert');

const db = new MyKV({
    connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USERNAME,
        database: process.env.DB_DATABASE,
        password: process.env.DB_PASSWORD,
    },
});

test('setting and getting a value', async () => {
    await db.connect();

    await db.set('test', true);
    const v = await db.get('test');

    if (v !== true) throw new Error('Failed');

    db.close();
});

test('db.del', async () => {
    await db.connect();

    await db.set('test', true);
    await db.del('test');

    const v = await db.get('test');
    if (v !== undefined) throw new Error('Failed');

    db.close();
});

test('db.has', async () => {
    await db.connect();

    await db.set('test', 'yes');
    const res1 = await db.has('test');

    await db.del('test');
    const res2 = await db.has('test');

    assert.is(res1, true);
    assert.is(res2, false);

    db.close();
});

test('database open getter works', async () => {
    await db.connect();

    assert.is(db.connected, true);

    db.close();

    assert.is(db.connected, false);
});

test('db.clear', async () => {
    await db.connect();

    await db.set('test', true);
    await db.clear();

    const v = await db.get('test');
    if (v) throw new Error("Failed, didn't clear");

    db.close();
});

test('db.keys', async () => {
    await db.connect();

    await db.clear();
    await db.set('test', true);
    await db.set('test2', true);

    const keys = await db.keys();
    const limitKeys = await db.keys(1);

    db.close();

    assert.equal(keys, ['test', 'test2']);
    assert.equal(limitKeys, ['test']);
});

test('db.values', async () => {
    await db.connect();

    await db.clear();
    await db.set('test', true);
    await db.set('test2', false);

    const values = await db.values();
    const limitValues = await db.values(1);

    db.close();

    assert.equal(values, [true, false]);
    assert.equal(limitValues, [true]);
});

test('db.entries', async () => {
    await db.connect();

    await db.clear();
    await db.set('test', true);
    await db.set('test2', false);

    const entries = await db.entries();
    const limitEntries = await db.entries(1);

    db.close();

    assert.equal(entries, [
        ['test', true],
        ['test2', false],
    ]);

    assert.equal(limitEntries, [['test', true]]);
});

test.run();
