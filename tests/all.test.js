const { config } = require('dotenv');
const { join } = require('path');
config({ path: join(__dirname, './.env') });

const assert = require('uvu/assert');
const { MyKV } = require('../dist');
const { suite } = require('uvu');

const db = new MyKV({
    connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USERNAME,
        database: process.env.DB_DATABASE,
        password: process.env.DB_PASSWORD,
    },
});

const all = suite();

all.before(async () => await db.connect());
all.after(async () => await db.close());

all('setting and getting a value', async () => {
    await db.set('test', true);
    const v = await db.get('test');

    if (v !== true) throw new Error('Failed');
});

all('db.del', async () => {
    await db.set('test', true);
    await db.del('test');

    const v = await db.get('test');
    if (v !== undefined) throw new Error('Failed');
});

all('db.has', async () => {
    await db.set('test', 'yes');
    const res1 = await db.has('test');

    await db.del('test');
    const res2 = await db.has('test');

    assert.is(res1, true);
    assert.is(res2, false);
});

// all('database open getter works', async () => {
//     await db.connect();

//     assert.is(db.open, true);

//     db.close();

//     assert.is(db.open, false);
// });

all('db.clear', async () => {
    await db.set('test', true);
    await db.clear();

    const v = await db.get('test');
    if (v) throw new Error("Failed, didn't clear");
});

all('db.keys', async () => {
    await db.clear();
    await db.set('test', true);
    await db.set('test2', true);

    const keys = await db.keys();
    const limitKeys = await db.keys(1);

    assert.equal(keys, ['test', 'test2']);
    assert.equal(limitKeys, ['test']);
});

all('db.values', async () => {
    await db.clear();
    await db.set('test', true);
    await db.set('test2', false);

    const values = await db.values();
    const limitValues = await db.values(1);

    assert.equal(values, [true, false]);
    assert.equal(limitValues, [true]);
});

all('db.entries', async () => {
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

all.run();
