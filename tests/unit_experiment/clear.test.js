const { db, test } = require('../db');
const assert = require('uvu/assert');

test('db.clear', async () => {
    await db.set('test', true);
    await db.clear();

    const v = await db.get('test');
    if (v) throw new Error("Failed, didn't clear");
});
