## How to migrate?

Create a new migration file (name scheme: <target-table>-update<serial_number>-migration).<br>This will be saved automatically at [migrations](../../migrations/).
```sh
    npm run migrate create <target-table>-update<serial_number>-migration
```


Adapt new migration file on up (target changes) and down (reset to current state).
```sh
const shorthands = undefined;

module.exports = {
    shorthands,
    up: (pgm) => {
        // alter, drop, rename, add tables or columns
    }
}

module.exports = {
    shorthands,
    down: (pgm) => {
        // reset to current state
    }
}
```

Since a central db is in use for this project, the migration can be executed locally.

Set project to type module in `package.json` (add <"type": "module">) and type the following commands in powershell (sslmode => cloud db; without sslmode => local):
```sh
path> $env:DATABASE_URL = "postgresql://<user>:<password>@<host>:<port>/<db>"
or
path> $env:DATABASE_URL = "postgresql://<user>:<password>@<host>/<db>?sslmode=require"
```

(direction: 'up' or 'down')

```sh
path> npx node-pg-migrate <direction>
or
path> npm run migrate-<direction>
```

or, in case of running single migration (up/down, migration file `without .js`)

```sh
path> $env:DATABASE_URL = <local_or_cloud_version>
path> npx node-pg-migrate <direction> <migration-number>_<migration-name>
```

<br>

Check database on correct changes and reset type in `package.json`.