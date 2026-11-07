/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
const shorthands = undefined;

/**
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
async function up(pgm) {
    pgm.dropColumns('news', 'visual_timestamp', {
        ifExists: true
    });

    // check for length collision and update value
    pgm.db.query(`
        UPDATE news
        SET title = 'LENGTH COLLISION - CHECK NEW TITLE'
        WHERE LENGTH(title) > 75
    `);

    pgm.db.query(`
        UPDATE news
        SET content = 'LENGTH COLLISION - CHECK NEW CONTENT'
        WHERE LENGTH(content) > 450
    `);

    // update length values
    pgm.alterColumn('news', 'title', {
        type: 'varchar(75)',
        notNull: true
    });
    pgm.alterColumn('news', 'content', {
        type: 'varchar(450)',
        notNull: true
    });
}

/**
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
async function down(pgm) {
    pgm.addColumns('news', {
        visual_timestamp: {
            ifNotExists: true,
            type: 'timestamp',
            default: '2025-05-28T16:08:00.000'
        }
    });
    pgm.alterColumn('news', 'title', {
        type: 'varchar(100)',
        notNull: true
    });
    pgm.alterColumn('news', 'content', {
        type: 'text',
        notNull: true
    });
}

module.exports = { shorthands, up, down };