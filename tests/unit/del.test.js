const assert = require('uvu/assert');
const { db } = require('../db');
const { test } = require('uvu');

test('db.del', async () => {
    await db.connect();

    await db.set('test', true);
    await db.del('test');

    const v = await db.get('test');
    if (v !== undefined) throw new Error('Failed');

    db.close();
});

test.run();
