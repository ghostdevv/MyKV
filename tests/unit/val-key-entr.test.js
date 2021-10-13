const assert = require('uvu/assert');
const { db } = require('../db');
const { test } = require('uvu');

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
