const { Config } = require('../configs/config');
const { AuthSecretNotFoundException } = require('./exceptions/auth.exception');
const fs = require('fs');

class Secrets {

    MODE = '';
    EMAIL_RECEIVER = '';
    EMAIL_SENDER = '';
    EMAIL_PASS = '';
    ADMIN_USER = '';
    ADMIN_PASS = '';
    AUTH_KEY = '';
    DB_USER = '';
    DB_PASS = '';
    DB_HOST = '';
    DB_DB = '';
    PUBLIC_KEY = '';
    PRIVATE_KEY = '';

    constructor() {
        this.MODE = this.#setMode();
        this.EMAIL_RECEIVER = this.#setEmailReceiver();
        this.EMAIL_SENDER = this.#setEmailSender();
        this.EMAIL_PASS = this.#setEmailPass();
        this.ADMIN_USER = this.#setAdminUser();
        this.ADMIN_PASS = this.#setAdminPass();
        this.AUTH_KEY = this.#setAuthKey();
        this.DB_USER = this.#setDbUser();
        this.DB_PASS = this.#setDbPass();
        this.DB_HOST = this.#setDbHost();
        this.DB_DB = this.#setDbDatabase();
        this.PUBLIC_KEY = this.#setPublicKey();
        this.PRIVATE_KEY = this.#setPrivateKey();
    }

    #setMode = () => {
        if(!Config.MODE) {
            throw new AuthSecretNotFoundException('backend-404-env#MODE');
        }
        return Config.MODE;
    }

    #setEmailReceiver = () => {
        if(!Config.EMAIL_RECEIVER) {
            throw new AuthSecretNotFoundException('backend-404-env#EMAIL_RECEIVER');
        }
        return Config.EMAIL_RECEIVER;
    }

    #setEmailSender = () => {
        if(!Config.EMAIL_SENDER) {
            throw new AuthSecretNotFoundException('backend-404-env#EMAIL_SENDER');
        }
        return Config.EMAIL_SENDER;
    }

    #setEmailPass = () => {
        if(!Config.EMAIL_PASS) {
            throw new AuthSecretNotFoundException('backend-404-env#EMAIL_PASS');
        }
        return Config.EMAIL_PASS;
    }

    #setAdminUser = () => {
        if(!Config.ADMIN_USER) {
            throw new AuthSecretNotFoundException('backend-404-env#ADMIN_USER');
        }
        return Config.ADMIN_USER;
    }

    #setAdminPass = () => {
        if(!Config.ADMIN_PASS) {
            throw new AuthSecretNotFoundException('backend-404-env#ADMIN_PASS');
        }
        return Config.ADMIN_PASS;
    }

    #setAuthKey = () => {
        if(!Config.AUTH_KEY) {
            throw new AuthSecretNotFoundException('backend-404-env#AUTH_KEY');
        }
        return Config.AUTH_KEY;
    }

    #setDbUser = () => {
        if(!Config.DB_USER) {
            throw new AuthSecretNotFoundException('backend-404-env#DB_USER');
        }
        return Config.DB_USER;
    }

    #setDbPass = () => {
        if(!Config.DB_PASS) {
            throw new AuthSecretNotFoundException('backend-404-env#DB_PASS');
        }
        return Config.DB_PASS;
    }

    #setDbHost = () => {
        if(!Config.DB_HOST) {
            throw new AuthSecretNotFoundException('backend-404-env#DB_HOST');
        }
        return Config.DB_HOST;
    }

    #setDbDatabase = () => {
        if(!Config.DB_DB) {
            throw new AuthSecretNotFoundException('backend-404-env#DB_DB');
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
            throw new AuthSecretNotFoundException('backend-404-env#PUBLIC_KEY');
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
            throw new AuthSecretNotFoundException('backend-404-env#PRIVATE_KEY');
        }    
        return key;
    }
}

module.exports = new Secrets();