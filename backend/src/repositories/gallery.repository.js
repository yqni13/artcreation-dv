const DBConnect = require('../db/connect.db')
const { v4: uuidv4 } = require('uuid');

class GalleryRepository {
    findOne = async (params) => {
        if(!Object.keys(params).length) {
            return {error: 'no params found'};
        }

        const table = 'gallery';
        const idColumn = 'gallery_id';
        const sql = `SELECT * FROM ${table} WHERE ${idColumn} = $1`;
        const values = [params['id']];

        try {
            const connection = DBConnect.connect();
            const { rows } = await connection.query(sql, values);
            return {
                db_select: rows[0],
                token: params['accessToken']
            };
        } catch (error) {
            console.log("DB ERROR ON SELECT: ", error.message);
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

    }

    create = async (params) => {
        if(!Object.keys(params).length) {
            return {error: 'no params found'};
        }
        
        const table = 'gallery';
        const uuid = uuidv4();
        const timeStamp = new Date().toISOString();
    
        const sql = `INSERT INTO ${table} 
        (gallery_id, image_path, thumbnail_path, title, reference_nr, price, art_type, dimensions, keywords, comment, technique, publication_year, created_on, last_modified) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`;

        const values = [uuid, imagePath, imagePath, params['title'], params['referenceNr'], params['price'], 
        params['artType'], params['dimensions'], params['keywords'], params['comment'], params['technique'], 
        params['publication'], timeStamp, timeStamp];

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