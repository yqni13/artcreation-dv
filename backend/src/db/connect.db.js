const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const Secrets = require('../utils/secrets.utils');
const { Database } = require('../configs/config');
const {
    DBConnectionException,
    DBSyntaxSQLException
} = require('../utils/exceptions/db.exception');
const logger = require('../logger/config.logger').getLogger();

class DBConnect {

    #pool;

    constructor() {
        // const connectionString = this.#getConnectionString(true); // local development
        const connectionString = this.#getConnectionString(false);
        this.#pool = new Pool({connectionString});
    }

    init = async () => {
        const client = await this.connection();
        try {
            const results = await client.query(`SELECT * FROM gallery;`);
            if((results && results.rowCount === 0)){
                await this.#initTables(client);
            }
        } catch(error) {
            if(error && error.code === '42P01') {
                await this.#initTables(client);
            } else if(error) {
                logger.error("DB ERROR CONNECTION INIT", {
                    error: error.code,
                    stack: error.stack,
                    context: {
                        method: 'artdv_db-connect_Init'
                    }
                });
                throw new DBConnectionException(error);
            }
        }
        console.log("DB COMMUNICATION: SUCCESS")
        await this.close(client);
    }

    #initTables = async (client) => {
        try {
            const sql = fs.readFileSync(path.resolve(__dirname, 'init.sql')).toString();
            await client.query(sql);
            console.log(`db successfully initiated;`)
        } catch(error) {
            logger.error("DB ERROR CONNECTION INITTABLES", {
                error: error.code,
                stack: error.stack,
                context: {
                    method: 'artdv_db-connect_InitTables'
                }
            });
            throw new DBSyntaxSQLException(error);
        }
    }

    #getConnectionString = (isLocalhost) => {
        // keep local version for testing/maintenance
        if(isLocalhost) {
            const db = Database.database;
            const user = Database.user;
            const pass = Database.password;
            const host = Database.host;
            const port = Database.port;
            return `postgresql://${user}:${pass}@${host}:${port}/${db}`;
        } else {
            const db = Secrets.DB_DB;
            const host = Secrets.DB_HOST;
            const user = Secrets.DB_USER;
            const pass = Secrets.DB_PASS;
            return `postgresql://${user}:${pass}@${host}/${db}?sslmode=require`;
        }
    }

    connection = async () => {
        try {
            const client = await this.#pool.connect()
            return client;
        } catch(error) {
            logger.error("DB ERROR CONNECTION CONNECT", {
                error: error.code,
                stack: error.stack,
                context: {
                    method: 'artdv_db-connect_Connection'
                }
            });
            throw new DBConnectionException('server-535-auth#database');
        }
    }

    close = async (client) => {
        try {
            await client.release(true);
        } catch(error) {
            logger.error("DB ERROR CONNECTION CLOSE", {
                error: error.code,
                stack: error.stack,
                context: {
                    method: 'artdv_db-connect_Close'
                }
            });
            throw new DBConnectionException('server-535-auth#database');
        }
    }
}

module.exports = new DBConnect();


