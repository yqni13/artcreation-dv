require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
const sender = 'lukas.varga@gmx.at'
const receiver = 'artcreation.dv@gmx.at'

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

app.post('/send-email', (req, res) => {
    const subject = req.body.subject
    const email = req.body.email;
    const message = req.body.message;

    const transporter = nodemailer.createTransport({
        service: 'gmx',
        host: 'mail.gmx.com',
        port: 465,
        secure: true,
        tls: {
            ciphers: 'SSLv3',
            rejectUnauthorized: false
        },
        auth: {
            user: sender,
            pass: process.env.SECRET_EMAIL_PASS
        }
    });

    // TODO(yqni13): add correct from-address to handle emails and adjust details

    const mailOptions = {
        from: sender,
        replyTo: email,
        to: receiver,
        subject: subject,
        text: message
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.status(500).send('Error sending email');
        } else {
            console.log('Email sent:', info.response);
            res.status(200).send('Email sent successfully');
        }
    });
});

app.listen(port, () => {
    console.log(`Node server listening at http://localhost:${port}`);
});