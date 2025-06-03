const DBConnect = require('../db/connect.db');
const logger = require('../logger/config.logger').getLogger();
const Utils = require('../utils/common.utils');

class AssetsRepository {

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

        const table = 'assets';
        const idColumn = 'assets_id';
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
            logger.error("DB ERROR ON SELECT (Assets Repository, FindOne)", {
                error: error.code,
                stack: error.stack,
                context: {
                    method: 'artdv_assets_FindOne',
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
    
            const table = 'assets';
            const filter = {};
            Object.entries(params['queryParams']).forEach(([k, v]) => {
                Object.assign(filter, {[k]: v});
            });
    
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
    
            const sql = `SELECT * FROM ${table} WHERE ${whereClause}`;
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
                logger.error("DB ERROR ON SELECT (Assets Repository, FindAllFiltered)", {
                    error: error.code,
                    stack: error.stack,
                    context: {
                        method: 'artdv_assets_FindAllFiltered',
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
        const table = 'assets';
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
            logger.error("DB ERROR ON SELECT (Assets Repository, FindAll)", {
                error: error.code,
                stack: error.stack,
                context: {
                    method: 'artdv_assets_FindAll'
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
        
        const table = 'assets';
        const timeStamp = Utils.getCustomLocaleTimestamp();

        const sql = `INSERT INTO ${table} 
        (assets_id, category, image_path, thumbnail_path, location, datetime, created_on, last_modified)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`;

        const values = [params['id'], params['category'], params['imagePath'], params['thumbnailPath'],
        params['location'], params['datetime'], timeStamp, timeStamp];

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
            logger.error("DB ERROR ON INSERT (Assets Repository)", {
                error: error.code,
                stack: error.stack,
                context: {
                    method: 'artdv_assets_Create',
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

        const table = 'assets';
        const timeStamp = Utils.getCustomLocaleTimestamp();

        const sql = `UPDATE ${table} 
        SET category = $1, image_path = $2, thumbnail_path = $3, location = $4, datetime = $5,
        last_modified = $6
        WHERE assets_id = $7`;

        const values = [params['category'], params['imagePath'], params['thumbnailPath'], params['location'],
        params['datetime'], timeStamp, params['id']];

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
            logger.error("DB ERROR ON UPDATE (Assets Repository)", {
                error: error.code,
                stack: error.stack,
                context: {
                    method: 'artdv_assets_Update',
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

        const table = 'assets';
        const sql = `DELETE FROM ${table} WHERE assets_id = $1`;
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
            logger.error("DB ERROR ON DELETE (Assets Repository)", {
                error: error.code,
                stack: error.stack,
                context: {
                    method: 'artdv_assets_Delete',
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

module.exports = new AssetsRepository();