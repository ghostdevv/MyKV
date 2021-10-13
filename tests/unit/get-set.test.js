const assert = require('uvu/assert');
const { db } = require('../db');
const { test } = require('uvu');

test('setting and getting a value', async () => {
    await db.connect();

    await db.set('test', true);
    const v = await db.get('test');

    if (v !== true) throw new Error('Failed');

    await db.close();
});

test.run();
