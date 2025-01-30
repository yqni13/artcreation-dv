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

        const expiresIn = '6h';
        const token = jwt.sign({ user_id: user.id }, process.env.SECRET_JWT, {
            expiresIn: expiresIn
        });
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