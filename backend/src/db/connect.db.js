const Pool = require('pg').Pool;
const fs = require('fs');
const path = require('path');
const { Database, Config } = require('../configs/config.js')
const {
    DBConnectionException,
    DBSyntaxSQLException
} = require('../utils/exceptions/db.exception');

class DBConnect {

    static async init() {
        const pool = await this.connect();
        pool.query(`SELECT * FROM gallery`, async (error, results) => {
            // table not existing => error.code 42P01
            if(error && error.code === '42P01') {
                const sql = fs.readFileSync(path.resolve(__dirname, 'init.sql')).toString();
                pool.query(sql, (error, results) => {
                    if(error) {
                        throw new DBSyntaxSQLException(error);
                    } else if(results) {
                        console.log(`tables successfully created;`)
                    }
                })
            } else if(error) {
                console.log("DB INIT ERROR: ", error);
            }

            if(results && results.rowCount === 0) {
                console.log(`tables are empty;`);
                // TODO(yqni13): load init data
            }
        })
    }

    static async connect() {
        const isProdEnv = Config.MODE === 'production';
        try {
            const pool = new Pool({
                user: Database.user,
                database: Database.database,
                password: Database.password,
                host: Database.host,
                port: Database.port,
                ssl: isProdEnv ? true : false
            });
            return pool;
        } catch (err) {
            throw new DBConnectionException(err);
        }
    }
}

module.exports = DBConnect;


