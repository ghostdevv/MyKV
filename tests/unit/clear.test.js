const assert = require('uvu/assert');
const { db } = require('../db');
const { test } = require('uvu');

test('db.clear', async () => {
    await db.connect();

    await db.set('test', true);
    await db.clear();

    const v = await db.get('test');
    if (v) throw new Error("Failed, didn't clear");

    db.close();
});

test.run();
