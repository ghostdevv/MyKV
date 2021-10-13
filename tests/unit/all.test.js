const assert = require('uvu/assert');
const { suite } = require('uvu');
const { db } = require('../db');

const test = suite();

test.before(async () => await db.connect());
test.after(async () => await db.close());

test('setting and getting a value', async () => {
    await db.set('test', true);
    const v = await db.get('test');

    if (v !== true) throw new Error('Failed');
});

test('db.del', async () => {
    await db.set('test', true);
    await db.del('test');

    const v = await db.get('test');
    if (v !== undefined) throw new Error('Failed');
});

test('db.has', async () => {
    await db.set('test', 'yes');
    const res1 = await db.has('test');

    await db.del('test');
    const res2 = await db.has('test');

    assert.is(res1, true);
    assert.is(res2, false);
});

// test('database open getter works', async () => {
//     await db.connect();

//     assert.is(db.open, true);

//     db.close();

//     assert.is(db.open, false);
// });

test('db.clear', async () => {
    await db.set('test', true);
    await db.clear();

    const v = await db.get('test');
    if (v) throw new Error("Failed, didn't clear");
});

test('db.keys', async () => {
    await db.clear();
    await db.set('test', true);
    await db.set('test2', true);

    const keys = await db.keys();
    const limitKeys = await db.keys(1);

    assert.equal(keys, ['test', 'test2']);
    assert.equal(limitKeys, ['test']);
});

test('db.values', async () => {
    await db.clear();
    await db.set('test', true);
    await db.set('test2', false);

    const values = await db.values();
    const limitValues = await db.values(1);

    assert.equal(values, [true, false]);
    assert.equal(limitValues, [true]);
});

test('db.entries', async () => {
    await db.clear();
    await db.set('test', true);
    await db.set('test2', false);

    const entries = await db.entries();
    const limitEntries = await db.entries(1);

    assert.equal(entries, [
        ['test', true],
        ['test2', false],
    ]);

    assert.equal(limitEntries, [['test', true]]);
});

test.run();
