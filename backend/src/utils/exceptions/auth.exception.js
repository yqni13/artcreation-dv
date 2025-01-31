const { ErrorCodes } = require('../errorCodes.utils');
const { ErrorStatusCodes } = require('../errorStatusCodes.utils');
const { Config } = require('../../configs/config');

class AuthException extends Error {
    constructor(code, message, data, status = 401) {
        super(message);
        if(Config.MODE === 'development') {
            this.message = 'Auth Error: ' + message;
        } else {
            this.message = message;
        }
        this.name = 'Auth Error';
        this.code = code;
        this.error = this.constructor.name;
        this.status = status;
        this.data = data;
    }
}

class UnauthorizedException extends AuthException {
    constructor(data) {
        super(ErrorCodes.UnauthorizedException, 'User unauthorized for action.', data);
    }
}

class InvalidCredentialsException extends AuthException {
    constructor (message, data){
        super(ErrorCodes.InvalidCredentialsException, message, data);
    }
}

module.exports = {
    UnauthorizedException,
    InvalidCredentialsException
}