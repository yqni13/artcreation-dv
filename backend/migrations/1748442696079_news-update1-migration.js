/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = async (pgm) => {
    await pgm.dropColumns('news', 'visual_timestamp', {
        ifExists: true
    });

    // check for length collision and update value
    await pgm.db.query(`
        UPDATE news
        SET title = 'LENGTH COLLISION - CHECK NEW TITLE'
        WHERE LENGTH(title) > 75
    `);

    await pgm.db.query(`
        UPDATE news
        SET content = 'LENGTH COLLISION - CHECK NEW CONTENT'
        WHERE LENGTH(content) > 450
    `);

    // update length values
    await pgm.alterColumn('news', 'title', {
        type: 'varchar(75)',
        notNull: true
    });
    await pgm.alterColumn('news', 'content', {
        type: 'varchar(450)',
        notNull: true
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = async (pgm) => {
    await pgm.addColumns('news', {
        visual_timestamp: {
            ifNotExists: true,
            type: 'timestamp',
            default: '2025-05-28T16:08:00.000'
        }
    });
    await pgm.alterColumn('news', 'title', {
        type: 'varchar(100)',
        notNull: true
    });
    await pgm.alterColumn('news', 'content', {
        type: 'text',
        notNull: true
    });
};
