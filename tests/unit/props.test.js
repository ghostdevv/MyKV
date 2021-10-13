const assert = require('uvu/assert');
const { db } = require('../db');
const { test } = require('uvu');

test('database open getter works', async () => {
    await db.connect();

    assert.is(db.connected, true);

    await db.close();

    assert.is(db.connected, false);
});

test.run();
