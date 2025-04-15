const crypto = require('crypto');
const { UnexpectedException } = require('../utils/exceptions/common.exception');
const logger = require('../logger/config.logger').getLogger();

// RSA
exports.decryptRSA = (data, privateKey) => {
    try {
        const buffer = Buffer.from(data, "base64");
        const decrypted = crypto.privateDecrypt(
        {
            key: privateKey,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: "sha256",
        },
        buffer
        );
    
        return decrypted.toString("utf8");
    } catch(err) {
        logger.error('ERROR decryptRSA', {
            error: err.code,
            stack: err.stack,
            context: {
                method: 'artdv_crypto_decryptRSA'
            }
        });
        throw new UnexpectedException(err.message);
    }
}

// AES
exports.decryptAES = async (data, ivPosition, passPhrase) => {
    const encoded = String(data);
    try {    
        // part 1: split iv, key and encrypted text from data
        const salt1 = encoded.slice(0, ivPosition);
        const salt2 = encoded.slice(ivPosition + 32, 96);
        const salt = salt1 + salt2;
        
        const ivHex = encoded.slice(ivPosition, ivPosition + 32);
        const iv = Buffer.from(ivHex, 'hex');

        const encryptedBuffer = Buffer.from(encoded.slice(96), 'hex');
        
        // part 2: derive key
        const key = crypto.pbkdf2Sync(passPhrase, Buffer.from(salt, 'utf8'), 100000, 32, 'sha256');
        
        // part 3: decrypt
        const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
        let decrypted = Buffer.concat([decipher.update(encryptedBuffer), decipher.final()]);
        decrypted = decrypted.toString('utf8');
    
        return decrypted;
    } catch(err) {
        logger.error('ERROR decryptAES', {
            error: err.code,
            stack: err.stack,
            context: {
                method: 'artdv_crypto_decryptAES'
            }
        });
        throw new UnexpectedException(err.message);
    }
}