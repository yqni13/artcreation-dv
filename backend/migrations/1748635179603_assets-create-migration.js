/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
    pgm.createTable('assets', {
        assets_id: {
            type: 'uuid',
            unique: true,
            primaryKey: true
        },
        category: {
            type: 'varchar(30)',
            notNull: true
        },
        image_path: {
            type: 'text',
            notNull: true
        },
        thumbnail_path: {
            type: 'text',
            notNull: true
        },
        location: {
            type: 'varchar(100)'
        },
        datetime: {
            type: 'timestamp',
            notNull: true
        },
        created_on: {
            type: 'timestamp',
            notNull: true
        },
        last_modified: {
            type: 'timestamp',
            notNull: true
        }
    })
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropTable('assets', {
        ifExists: true
    });
};
