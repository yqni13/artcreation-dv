module.exports.Config = {
    // MODE: process.env.SECRET_NODE_MODE,
    MODE: 'development',
    PORT: process.env.SECRET_NODE_PORT || 3000,
};

module.exports.Database = {
    user: 'postgres',
    database: 'artcreationdv',
    password: process.env.SECRET_DB_PASS,
    host: process.env.SECRET_DB_HOST || 'localhost',
    port: process.env.SECRET_DB_PORT || 5432
};