/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
const shorthands = undefined;

/**
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
async function up(pgm) {
    pgm.addColumn('gallery', {
        art_frame_model: {
            type: 'varchar(30)',
            notNull: true,
            default: 'default'
        },
        art_frame_color: {
            type: 'varchar(30)',
            notNull: true,
            default: '#ffffff'
        }
    });
}

/**
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
async function down(pgm) {
    pgm.dropColumn('gallery', 'art_frame_model');
    pgm.dropColumn('gallery', 'art_frame_color');
}

module.exports = { shorthands, up, down };