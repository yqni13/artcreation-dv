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
            "app_version": "2.0.4",
            "db_version": "1.4.1"
        };
    }
}

module.exports = MetaModel;