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
            "app_version": "1.2.13",
            "db_version": "1.4.0"
        };
    }
}

module.exports = MetaModel;