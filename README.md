# MyKV

[![](https://img.shields.io/npm/v/mykv?label=Latest%20Version&style=for-the-badge&logo=npm&color=informational)](https://www.npmjs.com/package/mykv)
[![](https://img.shields.io/static/v1?label=Project%20Creator&message=GHOST&color=informational&style=for-the-badge)](https://ghostdev.xyz)
[![](https://img.shields.io/github/workflow/status/ghostdevv/mykv/Tests/main?style=for-the-badge)](https://github.com/ghostdevv/mykv)

MyKV is a key value wrapper for MySQL. The idea is to have a full feature wrapper that allows for quick use of the MySQL database.

# How to use

```js
const { MyKV } = require('mykv');
// or
import { MyKV } from 'mykv';

const db = new MyKV({
    // Required options:
    host: '',
    database: '',
    username: '',
    password: '',
});

db.connect()
    .then(() => console.log('Connected'))
    .catch((e) => console.error(`Unable to connect: ${e.message}`));
```

Default options can be found [here](https://github.com/ghostdevv/MyKV/blob/main/src/config.defaults.ts)

# Methods

These are the methods used on your created db

-   ### Get

    `await db.get(key);`<br />

    ```js
    const item = await db.get('1234');
    ```

    TypeScript:

    ```ts
    interface Result {
        id: string;
        username: string;
    }

    const item = await db.get<Result>('1234');
    ```

-   ### Set

    `await db.set(key, value);`<br />

    ```js
    await db.set('1234', { id: '1234', username: 'GHOST' });
    ```

-   ### Delete

    `await db.del(key);`<br />

    ```js
    await db.del('1234');
    ```

-   ### Has

    `await db.has(key);`<br />

    ```js
    const has = await db.has('1234'); // true or false
    ```

-   ### Clear

    `await db.clear();`<br />

    ```js
    await db.clear();
    ```

-   ### Keys

    `await db.keys(limit?: number);`<br />
    Returns all keys in the db, you can optionally provide a limit of the number of keys returned<br />

    ```js
    const keys = await db.keys();
    const tenKeys = await db.keys(10); // Optional limit
    ```

-   ### Values

    `await db.values(limit?: number);`<br />
    Returns all items in the db (without their keys), you can optionally provide a limit of the number of values returned<br />

    ```js
    const values = await db.values();
    const tenValues = await db.values(10); // Optional limit
    ```

-   ### Entries

    `await db.entries(limit?: number);`<br />
    Returns all keys and values in an array, like [Map.prototype.entries](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/entries)<br />

    ```js
    const entries = await db.entries();
    const tenEntries = await db.entries(10); // Optional limit
    ```

# Support
-   Message me on discord: `GHOST#7524`<br>
-   Join the [discord](https://discord.gg/2Vd4wAjJnm)<br>
-   Create a issue on the [github](https://github.com/ghostdevv/mykv)
