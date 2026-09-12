/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
const shorthands = undefined;

/**
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
async function up(pgm) {
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
    });
}

/**
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
async function down(pgm) {
    pgm.dropTable('assets', {
        ifExists: true
    });
}

module.exports = { shorthands, up, down };