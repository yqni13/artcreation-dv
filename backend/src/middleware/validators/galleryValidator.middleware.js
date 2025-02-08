const { body } = require('express-validator');
const CustomValidator = require('../../utils/customValidators.utils');

exports.galleryFindOneSchema = [

];

exports.galleryFindAllFilteredSchema = [
    body('table')
        .trim()
        .notEmpty()
        .withMessage('backend-required'),
    body('queryParams')
        .notEmpty()
        .withMessage('backend-required')
];

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
        .optional({values: 'null'}),
    body('price')
        .isNumeric()
        .optional({values: 'null'}),
    body('artType')
        .trim()
        .notEmpty()
        .withMessage('backend-require')
        .bail()
        .custom((value) => CustomValidator.validateArtType(value)),
    body('dimensions')
        .trim()
        .notEmpty()
        .withMessage('backend-require'),
    body('artGenre')
        .trim()
        .notEmpty()
        .withMessage('backend-required')
        .bail()
        .custom((value) => CustomValidator.validateArtGenre(value)),
    body('comment')
        .optional({values: 'null'}),
    body('artMedium')
        .trim()
        .notEmpty()
        .withMessage('backend-required')
        .bail()
        .custom((value) => CustomValidator.validateArtMedium(value)),
    body('artTechnique')
        .trim()
        .notEmpty()
        .withMessage('backend-required')
        .bail()
        .custom((value) => CustomValidator.validateArtTechnique(value)),
    body('publication')
        .notEmpty()
        .withMessage('backend-require')
        .bail()
        .isInt({min: 1000, max: 2100})
        .withMessage('backend-range-publication')
];