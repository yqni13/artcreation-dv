const DBConnect = require('../db/connect.db')

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

        try {
            const connection = await DBConnect.connection();
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
            console.log("DB ERROR ON SELECT (Gallery Repository, FindOne): ", error.message);
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

        try {
            const connection = await DBConnect.connection();
            const result = await connection.query(sql, values);
            await DBConnect.close(connection);
            return {
                db_operation: 'select',
                number_of_entries: result['rows'].length,
                data: result['rows'] || null,
            };
        } catch(error) {
            console.log("DB ERROR ON SELECT (Gallery Repository, FindAllFiltered): ", error.message);
            await DBConnect.close(connection);
            return {
                db_operation: 'select',
                error: error,
            };
        }
    }

    findAll = async () => {
        const table = 'gallery';
        const orderProperty = 'last_modified'

        const sql = `SELECT * FROM ${table} ORDER BY ${orderProperty} DESC`;
        try {
            const connection = await DBConnect.connection();
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
            console.log("DB ERROR ON SELECT (Gallery Repository, FindAll): ", error.message);
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
        const timeStamp = new Date().toISOString();
    
        const sql = `INSERT INTO ${table} 
        (gallery_id, image_path, thumbnail_path, title, reference_nr, price, dimensions, art_genre,art_technique, art_medium, publication_year, created_on, last_modified) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`;

        const values = [params['id'], params['imagePath'], params['thumbnailPath'], params['title'],
        params['referenceNr'], params['price'], params['dimensions'], params['artGenre'],
        params['artTechnique'], params['artMedium'], params['publication'], timeStamp, timeStamp];

        try {
            const connection = await DBConnect.connection();
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
            console.log("DB ERROR ON INSERT (Gallery Repository): ", error.message);
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
        const timeStamp = new Date().toISOString();

        const sql = `UPDATE ${table} 
        SET reference_nr = $1, image_path = $2, thumbnail_path = $3, title = $4, price = $5, dimensions = $6,
        art_genre = $7, art_technique = $8, art_medium = $9, publication_year = $10, last_modified = $11
        WHERE gallery_id = $12`;

        const values = [params['referenceNr'], params['imagePath'], params['thumbnailPath'], params['title'],
        params['price'], params['dimensions'], params['artGenre'],
        params['artTechnique'], params['artMedium'], params['publication'], timeStamp, params['id']];

        try {
            const connection = await DBConnect.connection();
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
            console.log("DB ERROR ON UPDATE (Gallery Repository): ", error.message);
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

        try {
            const connection = await DBConnect.connection();
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
            console.log("DB ERROR ON DELETE (Gallery Repository): ", error.message);
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