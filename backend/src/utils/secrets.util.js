const { Config } = require('../configs/config');
const { AuthSecretNotFoundException } = require('./exceptions/auth.exception');
const fs = require('fs');

class Secrets {

    MODE = '';
    EMAIL_RECEIVER = '';
    EMAIL_SENDER = '';
    EMAIL_PASS = '';
    ADMIN_ID = 0;
    ADMIN_USER = '';
    ADMIN_PASS = '';
    AUTH_KEY = '';
    DB_USER = '';
    DB_PASS = '';
    DB_HOST = '';
    DB_DB = '';
    PUBLIC_KEY = '';
    PRIVATE_KEY = '';
    CLOUDSTORAGE_BUCKET = '';
    CLOUDSTORAGE_ENDPOINT = '';
    CLOUDSTORAGE_PUBLIC_URL = '';
    CLOUDSTORAGE_ACCESS_KEY_ID = '';
    CLOUDSTORAGE_SECRET_KEY = '';

    constructor() {
        this.MODE = this.#setMode();
        this.EMAIL_RECEIVER = this.#setEmailReceiver();
        this.EMAIL_SENDER = this.#setEmailSender();
        this.EMAIL_PASS = this.#setEmailPass();
        this.ADMIN_ID = this.#setAdminID();
        this.ADMIN_USER = this.#setAdminUser();
        this.ADMIN_PASS = this.#setAdminPass();
        this.AUTH_KEY = this.#setAuthKey();
        this.DB_USER = this.#setDbUser();
        this.DB_PASS = this.#setDbPass();
        this.DB_HOST = this.#setDbHost();
        this.DB_DB = this.#setDbDatabase();
        this.PUBLIC_KEY = this.#setPublicKey();
        this.PRIVATE_KEY = this.#setPrivateKey();
        this.CLOUDSTORAGE_BUCKET = this.#setCloudStorageBucket();
        this.CLOUDSTORAGE_ENDPOINT = this.#setCloudStorageEndpoint();
        this.CLOUDSTORAGE_PUBLIC_URL = this.#setCloudStoragePublicUrl();
        this.CLOUDSTORAGE_ACCESS_KEY_ID = this.#setCloudStorageAccessKeyID();
        this.CLOUDSTORAGE_SECRET_KEY = this.#setCloudStorageSecretKey();
    }

    #setMode = () => {
        if(!Config.MODE) {
            throw new AuthSecretNotFoundException('secret-404-env#MODE');
        }
        return Config.MODE;
    }

    #setEmailReceiver = () => {
        if(!Config.EMAIL_RECEIVER) {
            throw new AuthSecretNotFoundException('secret-404-env#EMAIL_RECEIVER');
        }
        return Config.EMAIL_RECEIVER;
    }

    #setEmailSender = () => {
        if(!Config.EMAIL_SENDER) {
            throw new AuthSecretNotFoundException('secret-404-env#EMAIL_SENDER');
        }
        return Config.EMAIL_SENDER;
    }

    #setEmailPass = () => {
        if(!Config.EMAIL_PASS) {
            throw new AuthSecretNotFoundException('secret-404-env#EMAIL_PASS');
        }
        return Config.EMAIL_PASS;
    }

    #setAdminID = () => {
        if(!Config.ADMIN_ID) {
            throw new AuthSecretNotFoundException('secret-404-env#ADMIN_ID');
        }
        return Config.ADMIN_ID;
    }

    #setAdminUser = () => {
        if(!Config.ADMIN_USER) {
            throw new AuthSecretNotFoundException('secret-404-env#ADMIN_USER');
        }
        return Config.ADMIN_USER;
    }

    #setAdminPass = () => {
        if(!Config.ADMIN_PASS) {
            throw new AuthSecretNotFoundException('secret-404-env#ADMIN_PASS');
        }
        return Config.ADMIN_PASS;
    }

    #setAuthKey = () => {
        if(!Config.AUTH_KEY) {
            throw new AuthSecretNotFoundException('secret-404-env#AUTH_KEY');
        }
        return Config.AUTH_KEY;
    }

    #setDbUser = () => {
        if(!Config.DB_USER) {
            throw new AuthSecretNotFoundException('secret-404-env#DB_USER');
        }
        return Config.DB_USER;
    }

    #setDbPass = () => {
        if(!Config.DB_PASS) {
            throw new AuthSecretNotFoundException('secret-404-env#DB_PASS');
        }
        return Config.DB_PASS;
    }

    #setDbHost = () => {
        if(!Config.DB_HOST) {
            throw new AuthSecretNotFoundException('secret-404-env#DB_HOST');
        }
        return Config.DB_HOST;
    }

    #setDbDatabase = () => {
        if(!Config.DB_DB) {
            throw new AuthSecretNotFoundException('secret-404-env#DB_DB');
        }
        return Config.DB_DB;
    }

    #setPublicKey = () => {
        let key;
        if(Config.MODE === 'development') {
            key = !Config.PUBLIC_KEY ? null : fs.readFileSync(Config.PUBLIC_KEY, 'utf8');
        } else {
            key = Config.PUBLIC_KEY;
        }
        
        if(!key) {
            throw new AuthSecretNotFoundException('secret-404-env#PUBLIC_KEY');
        }    
        return key;
    }

    #setPrivateKey = () => {
        let key;
        if(Config.MODE === 'development') {
            key = !Config.PRIVATE_KEY ? null : fs.readFileSync(Config.PRIVATE_KEY, 'utf8');
        } else {
            key = Config.PRIVATE_KEY;
        }
    
        if(!key) {
            throw new AuthSecretNotFoundException('secret-404-env#PRIVATE_KEY');
        }    
        return key;
    }

    #setCloudStorageBucket = () => {
        if(!Config.CLOUDSTORAGE_BUCKET) {
            throw new AuthSecretNotFoundException('secret-404-env#CLOUDSTORAGE_BUCKET');
        }
        return Config.CLOUDSTORAGE_BUCKET;
    }

    #setCloudStorageEndpoint = () => {
        if(!Config.CLOUDSTORAGE_ENDPOINT) {
            throw new AuthSecretNotFoundException('secret-404-env#CLOUDSTORAGE_ENDPOINT');
        }
        return Config.CLOUDSTORAGE_ENDPOINT;
    }

    #setCloudStoragePublicUrl = () => {
        if(!Config.CLOUDSTORAGE_PUBLIC_URL) {
            throw new AuthSecretNotFoundException('secret-404-env#CLOUDSTORAGE_PUBLIC_URL');
        }
        return Config.CLOUDSTORAGE_PUBLIC_URL;
    }

    #setCloudStorageAccessKeyID = () => {
        if(!Config.CLOUDSTORAGE_ACCESS_KEY_ID) {
            throw new AuthSecretNotFoundException('secret-404-env#CLOUDSTORAGE_ACCESS_KEY_ID');
        }
        return Config.CLOUDSTORAGE_ACCESS_KEY_ID;
    }

    #setCloudStorageSecretKey = () => {
        if(!Config.CLOUDSTORAGE_SECRET_KEY) {
            throw new AuthSecretNotFoundException('secret-404-env#CLOUDSTORAGE_SECRET_KEY');
        }
        return Config.CLOUDSTORAGE_SECRET_KEY;
    }
}

module.exports = new Secrets();