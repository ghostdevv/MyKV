const { db, test } = require('../db');
const assert = require('uvu/assert');

test('setting and getting a value', async () => {
    await db.set('test', true);
    const v = await db.get('test');

    if (v !== true) throw new Error('Failed');

    await db.close();
});
