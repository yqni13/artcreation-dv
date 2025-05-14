const DBConnect = require("../db/connect.db");
const Utils = require('../utils/common.utils');
const logger = require('../logger/config.logger').getLogger();

class NewsRepository {

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

        const table = 'news';
        const idColumn = 'news_id';
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
            logger.error("DB ERROR ON SELECT (News Repository, FindOne)", {
                error: error.code,
                stack: error.stack,
                context: {
                    method: 'artdv_news_FindOne',
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
        if((params['queryParams'] === undefined || Object.keys(params['queryParams']).length === 0) 
            || !Object.keys(params).length) {
            return {error: 'no params found'};
        }

        const table = 'news';
        const filter = {};
        Object.entries(params['queryParams']).forEach(([k, v]) => {
            Object.assign(filter, {[k]: v});
        });

        const orderClause = ' ORDER BY visual_timestamp ASC';
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
            logger.error("DB ERROR ON SELECT (News Repository, FindAllFiltered)", {
                error: error.code,
                stack: error.stack,
                context: {
                    method: 'artdv_news_FindAllFiltered',
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
        const table = 'news';
        const orderPrio1 = 'created_on';

        const sql = `SELECT * FROM ${table} ORDER BY ${orderPrio1} DESC`;
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
            logger.error("DB ERROR ON SELECT (News Repository, FindAll)", {
                error: error.code,
                stack: error.stack,
                context: {
                    method: 'artdv_news_FindAll'
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

        const table = 'news';
        const timestamp = Utils.getCustomLocaleTimestamp();

        const sql = `INSERT INTO ${table}
        (news_id, gallery, image_path, thumbnail_path, visual_timestamp, title, content, created_on, last_modified)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`;

        const values = [params['id'], params['galleryId'], params['imagePath'], params['thumbnailPath'], 
        timestamp, params['title'], params['content'], timestamp, timestamp];

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
        } catch(error) {
            logger.error("DB ERROR ON INSERT (News Repository)", {
                error: error.code,
                stack: error.stack,
                context: {
                    method: 'artdv_news_Create',
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
            }
        }
    }

    update = async (params) => {
        if(!Object.keys(params).length) {
            return {error: 'no params found'};
        }

        const table = 'news';
        const timestamp = Utils.getCustomLocaleTimestamp();

        const sql = `UPDATE ${table}
        SET gallery = $1, image_path = $2, thumbnail_path = $3, visual_timestamp = $4, title = $5, content = $6, last_modified = $7
        WHERE news_id = $8`;

        const values = [params['galleryId'], params['imagePath'], params['thumbnailPath'], 
        timestamp, params['title'], params['content'], timestamp, params['id']];

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
            };
        } catch(error) {
            logger.error("DB ERROR ON UPDATE (News Repository)", {
                error: error.code,
                stack: error.stack,
                context: {
                    method: 'artdv_news_Update',
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

        const table = 'news';
        const sql = `DELETE FROM ${table} WHERE news_id = $1`;
        const values = [params['id']];

        let connection;
        try {
            connection = await DBConnect.connection();
            await connection.query(sql, values);
            await DBConnect.close(connection);
            return {
                body: {
                    db_operation: 'delete',
                },
                code: 1,
                msg: this.msg1
            };
        } catch(error) {
            logger.error("DB ERROR ON DELETE (News Repository)", {
                error: error.code,
                stack: error.stack,
                context: {
                    method: 'artdv_news_Delete',
                    params
                }
            });
            await DBConnect.close(connection);
            return {
                body: {
                    db_operation: 'delete',
                    error: error,
                },
                code: 0,
                msg: this.msg0
            }
        }
    }
}

module.exports = new NewsRepository();