const { AuthenticationException, UnexpectedException } = require("../utils/exceptions/common.exception");
const nodemailer = require('nodemailer');
const Secrets = require('../utils/secrets.utils');
const { decryptRSA, decryptAES } = require('../utils/crypto.utils');
const logger = require('../logger/config.logger').getLogger();

class MailingModel {
    sendMail = async (params) => {
        if(!Object.keys(params).length) {
            return { error: 'no params found' };
        }

        const sender = decryptRSA(params['sender'], Secrets.PRIVATE_KEY);
        const subject = decryptRSA(params['subject'], Secrets.PRIVATE_KEY);
        const message = await decryptAES(params['body'], Secrets.IV_POSITION, Secrets.AES_PASSPHRASE);

        const mailOptions = {
            from: Secrets.EMAIL_SENDER,
            to: Secrets.EMAIL_RECEIVER,
            replyTo: sender,
            subject: subject,
            text: message
        };

        try {
            const success = await this.wrapedSendMail(mailOptions);
            return { response: { success, sender } };
        } catch (error) {
            logger.error("ERROR ON SENDMAIL", {
                error: error.code,
                stack: error.stack,
                context: {
                    method: 'artdv_mailing_sendMail',
                    params
                }
            });
            if(error.status === 535) {
                throw new AuthenticationException('server-535-auth#email-service', { data: error.message});
            } else {
                throw new UnexpectedException();
            }
        }
    }

    async wrapedSendMail(mailOptions) {
        return new Promise((resolve, reject) => {
            const transporter = nodemailer.createTransport({
                service: 'gmx',
                host: 'mail.gmx.net',
                port: 465,
                secure: true,
                tls: {
                    secure: true,
                    ciphers: 'SSLv3',
                    rejectUnauthorized: false
                },
                auth: {
                    user: Secrets.EMAIL_SENDER,
                    pass: Secrets.EMAIL_PASS
                }
            });

            transporter.sendMail(mailOptions, function(error, info) {
                if(error) {
                    if(error.responseCode === 535) {
                        return reject(new AuthenticationException(error));
                    } else {
                        return reject(new UnexpectedException(error));
                    }
                }
                resolve(true);
            })
        })
    }
}

module.exports = new MailingModel;