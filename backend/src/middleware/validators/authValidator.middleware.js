const { body } = require('express-validator');

exports.authSchema = [
    body('user')
        .trim()
        .notEmpty()
        .withMessage('data-required'),
    body('pass')
        .trim()
        .notEmpty()
        .withMessage('data-required')
]
