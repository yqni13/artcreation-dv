const { Config } = require('../../configs/config');
const { ErrorCodes } = require('../../utils/errorCodes.utils');
const { ErrorStatusCodes } = require('../../utils/errorStatusCodes.utils');

class DBException extends Error {
    constructor(code, message, data, status = 500) {
        super(message);
        if(Config.MODE === 'development') {
            this.message = 'Common Error: ' + message;
        } else {
            this.message = message;
        }
        this.name = 'Database Error';
        this.code = code;
        this.error = this.constructor.name;
        this.status = status;
        this.data = data;
    }
}

class DBConnectionException extends DBException {
    constructor(data) {
        super(ErrorCodes.DBConnectionException, 'Database not connected', data, ErrorStatusCodes.DBConnectionException);
    }
}

class DBNotExistingException extends DBException {
    constructor(message, data) {
        super(ErrorCodes.DBNotExistingException, message, data, ErrorStatusCodes.DBNotExistingException);
    }
}

class DBSyntaxSQLException extends DBException {
    constructor(message, data) {
        super(ErrorCodes.DBSyntaxSQLException, message, data, ErrorStatusCodes.DBSyntaxSQLException);
    }
}

module.exports = {
    DBConnectionException,
    DBNotExistingException,
    DBSyntaxSQLException
};