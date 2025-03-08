const { body } = require('express-validator');
const CustomValidator = require('../../utils/customValidators.utils');

exports.mailingSchema = [
    body('sender')
        .trim()
        .notEmpty()
        .withMessage('data-required')
        .bail()
        .custom((encryptedSender) => CustomValidator.validateEncryptedSender(encryptedSender)),
    body('subject')
        .trim()
        .notEmpty()
        .withMessage('data-required'),
    body('body')
        .trim()
        .notEmpty()
        .withMessage('data-required')
]