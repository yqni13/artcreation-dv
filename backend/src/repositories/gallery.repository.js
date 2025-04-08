const DBConnect = require('../db/connect.db')
const Utils = require('../utils/common.utils');
const logger = require('../logger/config.logger').getLogger()

class GalleryRepository {

    msg0 = '';
    msg1 = '';

    constructor() {
        this.msg0 = 'Error';
        this.msg1 = 'Success';
    }

    findOne = async (params) => {
        if(!Object.keys(params).length) {
            return {error: 'no params found'};
        }

        const table = 'gallery';
        const idColumn = 'gallery_id';
        const sql = `SELECT * FROM ${table} WHERE ${idColumn} = $1;`;
        const values = [params['id']];

        let connection;
        try {
            connection = await DBConnect.connection();
            const result = await connection.query(sql, values);
            await DBConnect.close(connection);
            return {
                body: {
                    db_operation: 'select',
                    data: result['rows'][0] || null,
                },
                code: 1,
                msg: this.msg1
            };
        } catch (error) {
            logger.error("DB ERROR ON SELECT (Gallery Repository, FindOne)", {
                error: error.message,
                stack: error.stack,
                context: {
                    method: 'artdv_gallery_FindOne',
                    params
                }
            });
            await DBConnect.close(connection);
            return {
                body: {
                    db_operation: 'select',
                    error: error,
                },
                code: 0,
                msg: this.msg0
            };
        }
    }

    findAllFiltered = async (params) => {
        // params must contain: {table: value, queryParams: {key: value, key: value, ...}}
        if((params['queryParams'] === undefined || Object.keys(params['queryParams']).length === 0) 
            || !Object.keys(params).length) {
            return {error: 'no params found'};
        }

        const table = 'gallery';
        const filter = {};
        Object.entries(params['queryParams']).forEach(([k, v]) => {
            Object.assign(filter, {[k]: v});
        });

        const orderClause = ' ORDER BY reference_nr ASC';
        let whereClause = '';
        if(Object.keys(filter).length === 1) {
            whereClause += `${Object.keys(filter)[0]} = $1`
        } else if(Object.keys(filter).length > 1) {
            for(let i = 0; i < filter.length; i++) {
                if(i === filter.length-1) {
                    whereClause += `${Object.keys(filter)[i]} = $${i+1}`
                } else {
                    whereClause += `${Object.keys(filter)[i]} = $${i+1} AND `
                }
            }
        }

        const sql = `SELECT * FROM ${table} WHERE ${whereClause} ${orderClause}`;
        const values = Object.values(params['queryParams']);

        let connection;
        try {
            connection = await DBConnect.connection();
            const result = await connection.query(sql, values);
            await DBConnect.close(connection);
            return {
                db_operation: 'select',
                number_of_entries: result['rows'].length,
                data: result['rows'] || null,
            };
        } catch(error) {
            logger.error("DB ERROR ON SELECT (Gallery Repository, FindAllFiltered)", {
                error: error.message,
                stack: error.stack,
                context: {
                    method: 'artdv_gallery_FindAllFiltered',
                    params
                }
            });
            await DBConnect.close(connection);
            return {
                db_operation: 'select',
                error: error,
            };
        }
    }

    findAll = async () => {
        const table = 'gallery';
        const orderPrio1 = 'publication_year';
        const orderPrio2 = 'created_on';

        const sql = `SELECT * FROM ${table} ORDER BY ${orderPrio1} DESC, ${orderPrio2} DESC`;
        let connection;
        try {
            connection = await DBConnect.connection();
            const result = await connection.query(sql);
            await DBConnect.close(connection);
            return {
                body: {
                    db_operation: 'select',
                    number_of_entries: result['rows'].length,
                    data: result['rows'] || null,
                },
                code: 1,
                msg: this.msg1
            }
        } catch(error) {
            logger.error("DB ERROR ON SELECT (Gallery Repository, FindAll)", {
                error: error.message,
                stack: error.stack,
                context: {
                    method: 'artdv_gallery_FindAllFiltered'
                }
            });
            await DBConnect.close(connection);
            return {
                body: {
                    db_operation: 'select',
                    error: error,
                },
                code: 0,
                msg: this.msg0
            }
        }
    }

    create = async (params) => {
        if(!Object.keys(params).length) {
            return {error: 'no params found'};
        }
        
        const table = 'gallery';
        const timeStamp = Utils.getCustomLocaleTimestamp();

        const sql = `INSERT INTO ${table} 
        (gallery_id, image_path, thumbnail_path, title, reference_nr, sale_status, price, dimensions, art_genre,art_technique, art_medium, publication_year, created_on, last_modified) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`;

        const values = [params['id'], params['imagePath'], params['thumbnailPath'], params['title'],
        params['referenceNr'], params['saleStatus'], params['price'], params['dimensions'], params['artGenre'],
        params['artTechnique'], params['artMedium'], params['publication'], timeStamp, timeStamp];

        let connection;
        try {
            connection = await DBConnect.connection();
            await connection.query(sql, values);
            await DBConnect.close(connection);
            return {
                body: {
                    db_operation: 'insert',
                    id: params['id'],
                },
                code: 1,
                msg: this.msg1
            };
        } catch (error) {
            logger.error("DB ERROR ON INSERT (Gallery Repository)", {
                error: error.message,
                stack: error.stack,
                context: {
                    method: 'artdv_gallery_Create',
                    params
                }
            });
            await DBConnect.close(connection);
            return {
                body: {
                    db_operation: 'insert',
                    error: error,
                },
                code: 0,
                msg: this.msg0
            };
        }
    }

    update = async (params) => {
        if(!Object.keys(params).length) {
            return {error: 'no params found'};
        }

        const table = 'gallery';
        const timeStamp = Utils.getCustomLocaleTimestamp();

        const sql = `UPDATE ${table} 
        SET reference_nr = $1, image_path = $2, thumbnail_path = $3, sale_status = $4, title = $5, price = $6, dimensions = $7, art_genre = $8, art_technique = $9, art_medium = $10, publication_year = $11,
        last_modified = $12
        WHERE gallery_id = $13`;

        const values = [params['referenceNr'], params['imagePath'], params['thumbnailPath'], params['saleStatus'],
        params['title'], params['price'], params['dimensions'], params['artGenre'], params['artTechnique'],
        params['artMedium'], params['publication'], timeStamp, params['id']];

        let connection;
        try {
            connection = await DBConnect.connection();
            await connection.query(sql, values);
            await DBConnect.close(connection);
            return {
                body: {
                    db_operation: 'update',
                    id: params['id'],
                },
                code: 1,
                msg: this.msg1
            }
        } catch(error) {
            logger.error("DB ERROR ON UPDATE (Gallery Repository)", {
                error: error.message,
                stack: error.stack,
                context: {
                    method: 'artdv_gallery_Update',
                    params
                }
            });
            await DBConnect.close(connection);
            return {
                body: {
                    db_operation: 'update',
                    error: error,
                },
                code: 0,
                msg: this.msg0
            }
        }
    }

    delete = async (params) => {
        if(!Object.keys(params).length) {
            return {error: 'no params found'};
        }

        const table = 'gallery';
        const sql = `DELETE FROM ${table} WHERE gallery_id = $1`;
        const values = [params['id']];

        let connection;
        try {
            connection = await DBConnect.connection();
            await connection.query(sql, values);
            await DBConnect.close(connection);
            return {
                body: {
                    db_operation: 'delete',
                    deleted: true
                },
                code: 1,
                msg: this.msg1
            }
        } catch(error) {
            logger.error("DB ERROR ON DELETE (Gallery Repository)", {
                error: error.message,
                stack: error.stack,
                context: {
                    method: 'artdv_gallery_Delete',
                    params
                }
            });
            await DBConnect.close(connection);
            return {
                body: {
                    db_operation: 'delete',
                    deleted: false,
                    error: error,
                },
                code: 0,
                msg: this.msg0
            }
        }
    }
}

module.exports = new GalleryRepository();