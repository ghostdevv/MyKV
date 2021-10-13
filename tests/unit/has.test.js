const assert = require('uvu/assert');
const { db } = require('../db');
const { test } = require('uvu');

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

test.run();
