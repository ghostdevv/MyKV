const { db, test } = require('../db');
const assert = require('uvu/assert');

test('db.has', async () => {
    await db.set('test', 'yes');
    const res1 = await db.has('test');

    await db.del('test');
    const res2 = await db.has('test');

    assert.is(res1, true);
    assert.is(res2, false);
});
