const { db, test } = require('../db');
const assert = require('uvu/assert');

test('db.del', async () => {
    await db.set('test', true);
    await db.del('test');

    const v = await db.get('test');
    if (v !== undefined) throw new Error('Failed');
});
