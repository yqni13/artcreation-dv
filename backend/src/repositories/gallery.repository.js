const DBConnect = require('../db/connect.db')


class GalleryRepository {


    findOne = async (params) => {
        if(!Object.keys(params).length) {
            return {error: 'no params found'};
        }

        const table = 'gallery';
        const idColumn = 'gallery_id';
        const sql = `SELECT * FROM ${table} WHERE ${idColumn} = $1;`;
        const values = [params['id']];

        try {
            const connection = DBConnect.connect();
            const { rows } = await connection.query(sql, values);
            return {
                db_select: rows[0],
                token: params['accessToken']
            };
        } catch (error) {
            console.log("DB ERROR ON SELECT (Gallery Repository, FindOne): ", error.message);
            return {
                db_select: 'fail',
                error: error,
                token: params['accessToken']
            };
        }
    }

    findAll = async () => {

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
            return {db_select: result['rows']};
        } catch(error) {
            console.log("DB ERROR ON SELECT (Gallery Repository, FindAllFiltered): ", error.message);
            return {
                db_select: 'fail',
                error: error
            };
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

        const values = [params['uuid'], params['imagePath'], params['thumbnailPath'], params['title'],
        params['referenceNr'], params['price'], params['artType'], params['dimensions'], params['artGenre'],
        params['comment'], params['artTechnique'], params['artMedium'], params['publication'], timeStamp, timeStamp];

        try {
            const connection = await DBConnect.connect();
            await connection.query(sql, values);
            return { 
                db_insert: 'success',
                token: params['accessToken']
            };
        } catch (error) {
            console.log("DB ERROR ON INSERT: ", error.message);
            return {
                db_insert: 'fail',
                error: error,
                token: params['accessToken']
            };
        }
    }

    update = async (params) => {

    }

    delete = async (params) => {

    }
}

module.exports = new GalleryRepository();