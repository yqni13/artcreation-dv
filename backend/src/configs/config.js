module.exports.Config = {
    MODE: process.env.MODE || 'development',
    PORT: process.env.SECRET_NODE_PORT || 3000,
    EMAIL_RECEIVER: process.env.SECRET_EMAIL_RECEIVER || null,
    EMAIL_SENDER: process.env.SECRET_EMAIL_SENDER || null,
    EMAIL_PASS: process.env.SECRET_EMAIL_PASS || null,
    ADMIN_ID: process.env.SECRET_ADMIN_ID || null,
    ADMIN_USER: process.env.SECRET_ADMIN_USER || null,
    ADMIN_PASS: process.env.SECRET_ADMIN_PASS || null,
    AUTH_KEY: process.env.SECRET_CRYPTO_KEY || null,
    PUBLIC_KEY: process.env.SECRET_PUBLIC_KEY || null,
    PRIVATE_KEY: process.env.SECRET_PRIVATE_KEY || null,
    DB_HOST: process.env.SECRET_DB_HOST_NEON || null,
    DB_DB: process.env.SECRET_DB_DB_NEON || null,
    DB_USER: process.env.SECRET_DB_USER_NEON || null,
    DB_PASS: process.env.SECRET_DB_PASS_NEON || null,
    CLOUDSTORAGE_BUCKET: process.env.SECRET_CLOUDSTORAGE_BUCKET || null,
    CLOUDSTORAGE_ENDPOINT: process.env.SECRET_CLOUDSTORAGE_ENDPOINT || null,
    CLOUDSTORAGE_ACCESS_KEY_ID: process.env.SECRET_CLOUDSTORAGE_ACCESS_KEY_ID || null,
    CLOUDSTORAGE_SECRET_KEY: process.env.SECRET_CLOUDSTORAGE_SECRET_KEY || null,
    BETTERSTACK_LOGGING_KEY: process.env.SECRET_BETTERSTACK_LOGGING_KEY || null,
    BETTERSTACK_HOST: process.env.SECRET_BETTERSTACK_HOST || null
};

module.exports.Database = {
    user: process.env.SECRET_DB_USER_LOCAL,
    password: process.env.SECRET_DB_PASS_LOCAL,
    database: process.env.SECRET_DB_DB_LOCAL,
    host: process.env.SECRET_DB_HOST_LOCAL,
    port: process.env.SECRET_DB_PORT_LOCAL
};