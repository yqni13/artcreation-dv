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
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropColumn('gallery', 'art_frame_model');
    pgm.dropColumn('gallery', 'art_frame_color');
};
