const { createConfig } = require('../../dist/helpers/config.js');

const { test } = require('uvu');
const assert = require('uvu/assert');

const defaultConfig = require('../../dist/config.defaults.js').default;

test('works', () => {
    assert.equal(createConfig({ port: 100 }), {
        ...defaultConfig,
        port: 100,
    });

    assert.equal(createConfig(), defaultConfig);
});

test.run();
