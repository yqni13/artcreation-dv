const { body } = require('express-validator');

exports.galleryFindOneSchema = [

]

exports.galleryFindAllFilteredSchema = [

]

exports.galleryCreateSchema = [
    body('accessToken')
        .trim()
        .notEmpty()
        .withMessage('backend-required')
        .bail()
        .isJWT()
        .withMessage('backend-invalid-jwt'),
    body('imagePath')
        .trim()
        .notEmpty()
        .withMessage('backend-required'),
    body('thumbnailPath')
        .trim()
        .notEmpty()
        .withMessage('backend-required'),
    body('title')
        .isLength({max: 100})
        .optional(),
    body('referenceNr')
        .trim()
        .notEmpty()
        .withMessage('backend-require')
        .bail() 
        .isLength({min: 6, max: 6})
        .withMessage('backend-length-refNr'),
    body('price')
        .isNumeric()
        .optional(),
    body('artType')
        .trim()
        .notEmpty()
        .withMessage('backend-require')
        .bail()
        .custom((value) => validateArtType(value)),
    body('dimensions')
        .trim()
        .notEmpty()
        .withMessage('backend-require'),
    body('keywords')
        .isLength({max: 10})
        .withMessage('backend-length-keywords')
        .optional(),
    body('comment')
        .optional(),
    body('technique')
        .optional(),
    body('publication')
        .notEmpty()
        .withMessage('backend-require')
        .bail()
        .isInt({min: 1000, max: 2100})
        .withMessage('backend-range-publication')
]

validateArtType = (value) => {
    const types = ['original', 'print', 'originalORprint', 'handcraft'];
    if(!types.includes(value)) {
        throw new Error('backend-invalid-type')
    }
    return true;
}