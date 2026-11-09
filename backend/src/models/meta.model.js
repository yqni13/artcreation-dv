const Secrets = require('../utils/secrets.utils');

class MetaModel {

    constructor() {
        //
    }
    
    getInfoData() {
        return {
            "app": "artcreation-dv",
            "author": "yqni13",
            "environment": Secrets.MODE,
            "app_version": "3.0.0",
            "db_version": "1.5.0"
        };
    }
}

module.exports = MetaModel;