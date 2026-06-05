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
                const key = req.header('Artdv-Meta-Key');
                if(Secrets.MODE.trim() === 'production' && (!key || key.trim() !== Secrets.META_API_KEY.trim())) {
                    throw new InvalidCredentialsException('backend-invalid-authkey');
                }
            } else {
                const authHeader = req.headers.authorization;
                const bearer = 'Bearer ';
                if (!authHeader || !authHeader.startsWith(bearer)) {
                    throw new TokenMissingException();
                }
    
                const privateKey = Secrets.PRIVATE_KEY.trim();
                const token = authHeader.replace(bearer, '');
                const decode = jwt.verify(token, privateKey);
    
                if(decode.id !== Secrets.ADMIN_ID.trim()) {
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