require('dotenv').config();
const { AuthenticationException, UnexpectedException } = require("../utils/exceptions/common.exception");
const nodemailer = require('nodemailer');

class MailingModel {
    sendMail = async (params) => {
        if(!Object.keys(params).length) {
            return { error: 'no params found' };
        }

        const sender = params['sender'];
        const subject = params['subject'];
        const message = params['body'];

        const mailOptions = {
            from: process.env.SECRET_EMAIL_SENDER,
            to: process.env.SECRET_EMAIL_RECEIVER,
            replyTo: sender,
            subject: subject,
            text: message
        };
        try {
            const success = await this.wrapedSendMail(mailOptions);
            return { response: { success, sender } };
        } catch (error) {
            console.error("ERROR sendMail: ", error);
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
                    user: process.env.SECRET_EMAIL_SENDER,
                    pass: process.env.SECRET_EMAIL_PASS
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