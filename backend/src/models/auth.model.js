require('dotenv').config();
const jwt = require('jsonwebtoken');
const UserModel = require('./user.model');
const { 
    InvalidCredentialsException 
} = require('../utils/exceptions/auth.exception');
const { decryptRSA } = require('../utils/crypto.utils');
const Secrets = require('../utils/secrets.utils');


class AuthModel {
    login = async (params) => {
        if(!Object.keys(params).length) {
            return { error: 'no params found' };
        }

        const user = await UserModel.findOne(params['user']);
        if(!user) {
            throw new InvalidCredentialsException('auth-invalid-user');
        }

        const decryptedPass = decryptRSA(params['pass'], Secrets.PRIVATE_KEY);
        const passMatching = decryptedPass === Secrets.ADMIN_PASS;
        if(!passMatching) {
            throw new InvalidCredentialsException('auth-invalid-pass');
        }

        const expiration = '6h';
        const token = await this.generateToken(user, expiration);

        return {
            user: user.name,
            expiresIn: expiration, 
            token: token
        }
    }

    generateToken = async (user, expiration) => {
        const payload = {
            id: Secrets.ADMIN_ID,
            user: user + String(Date.now()),
            role: 'admin'
        }

        const options = {
            expiresIn: expiration,
            algorithm: 'RS256',
            issuer: 'https://artcreation-dv.at'
        }

        const token = jwt.sign(payload, Secrets.PRIVATE_KEY, options)
        return {
            body: {
                token: token
            },
            code: 1,
            msg: this.msg1
        }
    }
}

module.exports = new AuthModel();