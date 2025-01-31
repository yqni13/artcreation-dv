const { body } = require('express-validator');

exports.authSchema = [
    body('user')
        .trim()
        .notEmpty()
        .withMessage('backend-require'),
    body('pass')
        .trim()
        .notEmpty()
        .withMessage('backend-require')
]
