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
            "app_version": "1.2.8",
            "db_version": "1.3.0"
        };
    }
}

module.exports = MetaModel;