/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
    pgm.createTable('gallery', {
        gallery_id: {
            type: 'uuid',
            unique: true,
            primaryKey: true
        },
        reference_nr: {
            type: 'varchar(6)',
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
        title: {
            type: 'varchar(100)'
        },
        sale_status: {
            type: 'varchar(50)',
            notNull: true
        },
        price: {
            type: 'numeric(9, 2)'
        },
        dimensions: {
            type: 'varchar(20)',
            notNull: true
        },
        art_genre: {
            type: 'varchar(20)',
            notNull: true
        },
        art_medium: {
            type: 'varchar(20)',
            notNull: true
        },
        art_technique: {
            type: 'varchar(20)',
            notNull: true
        },
        publication_year: {
            type: 'numeric',
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
    }, {
        ifNotExists: true
    });
    pgm.createTable('news', {
        news_id: {
            type: 'uuid',
            unique: true,
            primaryKey: true
        },
        gallery: {
            type: 'uuid',
            references: '"gallery"',
            onDelete: 'cascade'
        },
        image_path: {
            type: 'text'
        },
        thumbnail_path: {
            type: 'text'
        },
        visual_timestamp: {
            type: 'timestamp',
            notNull: true
        },
        title: {
            type: 'varchar(100)',
            notNull: true
        },
        content: {
            type: 'text',
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
    }, {
        ifNotExists: true
    });
    pgm.addIndex('news', 'gallery');
}

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropTable('news', {
        ifExists: true,
        cascade: true
    });
    pgm.dropTable('gallery', {
        ifExists: true
    });
}
