const { checkRequired } = require('../../dist/helpers/config.js');

const { test } = require('uvu');

test('check that it works', () => {
    const res = checkRequired({ hello: true }, ['hello']);
    const res2 = checkRequired({ world: '' }, ['world']);

    if (res !== true) throw new Error('Res should be true');
    if (res2 !== false) throw new Error('Res2 should be false');
});

test.run();
