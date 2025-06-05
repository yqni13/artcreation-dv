const { validationResult } = require('express-validator');
const { InvalidPropertiesException } = require('../utils/exceptions/validation.exception');

exports.checkValidation = (req) => {
    const errors = validationResult(req);
    const allErrors = [
        ...(req.customValidationErrors || []),
        ...errors.array()
    ];
    if(allErrors.length > 0) {
        throw new InvalidPropertiesException('Missing or invalid properties', { data: allErrors });
    }
}