/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
const shorthands = undefined;

/**
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
async function up(pgm) {
    pgm.alterColumn('gallery', 'reference_nr', {
        type: 'char(6)',
        notNull: true
    });
}

/**
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
async function down(pgm) {
    pgm.alterColumn('gallery', 'reference_nr', {
        type: 'varchar(6)',
        notNull: true
    });
}

module.exports = { shorthands, up, down };