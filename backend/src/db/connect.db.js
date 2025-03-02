const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const Secrets = require('../utils/secrets.util');
const { Database } = require('../configs/config');
const {
    DBConnectionException,
    DBSyntaxSQLException
} = require('../utils/exceptions/db.exception');

class DBConnect {

    #pool;

    constructor() {
        const connectionString = this.#getConnectionString(false);
        this.#pool = new Pool({connectionString});
    }

    init = async () => {
        const client = await this.connection();
        try {
            await client.query(`SELECT * FROM gallery`);
        } catch(error) {
            if((error && error.code === '42P01') || (results && results.rowCount === 0)) {
                await this.#initTables(client);
            } else if(error) {
                console.log("DB REQUEST ERROR: ", error);
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
            console.log("DB INIT ERROR: ", error);
            throw new DBSyntaxSQLException(error);
        }
    }

    #getConnectionString = (localhost = false) => {
        if(localhost) {
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
            console.log("DB CONNECT ERROR: ", error);
            throw new DBConnectionException(error);
        }
    }

    close = async (client) => {
        try {
            await client.release(true);
        } catch(error) {
            console.log("DB CLOSE ERROR: ", error);
            throw new DBConnectionException(error);
        }
    }
}

module.exports = new DBConnect();


