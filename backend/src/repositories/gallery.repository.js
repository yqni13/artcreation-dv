const DBConnect = require('../db/connect.db')
const GalleryModel = require('../models/gallery.model');

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
            const connection = await DBConnect.connect();
            const result = await connection.query(sql, values);
            return {
                db_select: result['rows'][0],
                token: params['accessToken'],
                code: 1,
                msg: this.msg1
            };
        } catch (error) {
            console.log("DB ERROR ON SELECT (Gallery Repository, FindOne): ", error.message);
            return {
                error: error,
                token: params['accessToken'],
                code: 0,
                msg: this.msg0
            };
        }
    }

    findAllFiltered = async (params) => {
        // params must contain: {table: value} & {queryParams: {key-value pair(s)}}
        if(!Object.keys(params).length) {
            return {error: 'no params found'};
        }

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
                    whereClause += `${Object.keys(filter)[i]} = $${i+1}'`
                } else {
                    whereClause += `${Object.keys(filter)[i]} = $${i+1} AND `
                }
            }
        }

        const sql = 'SELECT * FROM ' + params['table'] + ' WHERE ' + whereClause + orderClause;
        const values = Object.values(params['queryParams']);

        try {
            const connection = await DBConnect.connect();
            const result = await connection.query(sql, values);
            return {
                number_of_entries: result['rows'].length,
                db_select: result['rows'],
                code: 1,
                msg: this.msg1
            };
        } catch(error) {
            console.log("DB ERROR ON SELECT (Gallery Repository, FindAllFiltered): ", error.message);
            return {
                error: error,
                code: 0,
                msg: this.msg0
            };
        }
    }

    findAll = async () => {
        const table = 'gallery';

        const sql = `SELECT * FROM ${table}`
        try {
            const connection = await DBConnect.connect();
            const result = await connection.query(sql);
            return {
                number_of_entries: result['rows'].length,
                db_select: result['rows'],
                code: 1,
                msg: this.msg1
            }
        } catch(error) {
            console.log("DB ERROR ON SELECT (Gallery Repository, FindAll): ", error.message);
            return {
                error: error,
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
        (gallery_id, image_path, thumbnail_path, title, reference_nr, price, art_type, dimensions, art_genre, art_comment, art_technique, art_medium, publication_year, created_on, last_modified) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`;

        const values = [params['id'], params['imagePath'], params['thumbnailPath'], params['title'],
        params['referenceNr'], params['price'], params['artType'], params['dimensions'], params['artGenre'],
        params['comment'], params['artTechnique'], params['artMedium'], params['publication'], timeStamp, timeStamp];

        try {
            const connection = await DBConnect.connect();
            await connection.query(sql, values);
            return { 
                db_insert: 'success',
                token: params['accessToken'],
                code: 1,
                msg: this.msg1
            };
        } catch (error) {
            console.log("DB ERROR ON INSERT (Gallery Repository, create): ", error.message);
            return {
                error: error,
                token: params['accessToken'],
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
        SET reference_nr = $1, image_path = $2, thumbnail_path = $3, title = $4, price = $5, art_type = $6, dimensions = $7, art_genre = $8, art_comment = $9, art_technique = $10, art_medium = $11, publication_year = $12, last_modified = $13
        WHERE gallery_id = $14`;

        const values = [params['referenceNr'], params['imagePath'], params['thumbnailPath'], params['title'],
        params['price'], params['artType'], params['dimensions'], params['artGenre'], params['comment'], 
        params['artTechnique'], params['artMedium'], params['publication'], timeStamp, params['id']];
    
        console.log("UPDATE, VALUES: ", values);

        try {
            const connection = await DBConnect.connect();
            await connection.query(sql, values);
            return {
                db_update: 'success',
                // token: params['accessToken'],
                code: 1,
                msg: this.msg1
            }
        } catch(error) {
            console.log("DB ERROR ON UPDATE (Gallery Repository, update): ", error.message);
            return {
                db_update: 'fail',
                error: error,
                // token: params['accessToken'],
                code: 0,
                msg: this.msg0
            }
        }
    }

    delete = async (params) => {

    }
}

module.exports = new GalleryRepository();