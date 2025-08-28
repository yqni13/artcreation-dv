const jwt = require('jsonwebtoken');
const { 
    InvalidCredentialsException,
    TokenMissingException
} = require('../utils/exceptions/auth.exception');
const Secrets = require('../utils/secrets.utils');
const logger = require('../logger/config.logger').getLogger();


const auth = (isMetaAuth = false) => {
    return async function (req, res, next) {
        try {
            if(isMetaAuth) {
                if(Secrets.MODE === 'production' && (!req.params.key || (req.params.key !== Secrets.META_API_KEY))) {
                    throw new InvalidCredentialsException('backend-invalid-authkey');
                }
            } else {
                const authHeader = req.headers.authorization;
                const bearer = 'Bearer ';
                if (!authHeader || !authHeader.startsWith(bearer)) {
                    throw new TokenMissingException();
                }
    
                const privateKey = Secrets.PRIVATE_KEY;
                const token = authHeader.replace(bearer, '');
                const decode = jwt.verify(token, privateKey);
    
                if(decode.id !== Secrets.ADMIN_ID) {
                    throw new InvalidCredentialsException('auth-invalid-id');
                }
            }
            next();
        } catch(error) {
            logger.error("AUTH ERROR ON VERIFICATION (Auth Model)", {
                error: error.code,
                stack: error.stack,
                context: {
                    method: 'artdv_middleware_Auth'
                }
            });
            error.status = 401;
            next(error);
        }
        
    };
}

module.exports = auth;