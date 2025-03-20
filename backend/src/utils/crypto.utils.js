const crypto = require('crypto');

// RSA
exports.decryptRSA = (data, privateKey) => {
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
}