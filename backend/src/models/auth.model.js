require('dotenv').config();
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');
const UserModel = require('./user.model');
const { 
    InvalidCredentialsException 
} = require('../utils/exceptions/auth.exception');


class AuthModel {
    login = async (params) => {
        if(!Object.keys(params).length) {
            return { error: 'no params found' };
        }

        const user = await UserModel.findOne(params['user']);
        if(!user) {
            throw new InvalidCredentialsException('Username not registered.');
        }

        const cryptoKey = process.env.SECRET_CRYPTO_KEY
        const decryptedPass = CryptoJS.AES.decrypt(params['pass'], cryptoKey).toString(CryptoJS.enc.Utf8);
        const passMatching = decryptedPass === process.env.SECRET_ADMIN_PASS;
        if(!passMatching) {
            throw new InvalidCredentialsException('Incorrect password.');
        }

        const expiresIn = 6; // input handled as hours
        const token = jwt.sign({}, process.env.SECRET_ASYMMETRIC_KEY, {
            algorithm: 'RS256',
            expiresIn: expiresIn,
            subject: user.id
        })

        const responseBody = {
            user: user.name,
            user_id: user.id,
            expiresIn: expiresIn, 
            token: token
        }

        return responseBody;
    }
}

module.exports = new AuthModel;