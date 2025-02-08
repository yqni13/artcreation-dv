const { body } = require('express-validator');
const CustomValidator = require('../../utils/customValidators.utils');

exports.galleryFindOneSchema = [
    // body('accessToken')
    //     .trim()
    //     .notEmpty()
    //     .withMessage('backend-required')
    //     .bail()
    //     .isJWT()
    //     .withMessage('backend-invalid-jwt'),
    body('id')
        .trim()
        .notEmpty()
        .withMessage('backend-require')
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

exports.galleryFindAllSchema = [
    // body('accessToken')
    //     .trim()
    //     .notEmpty()
    //     .withMessage('backend-required')
    //     .bail()
    //     .isJWT()
    //     .withMessage('backend-invalid-jwt'),
];

exports.galleryCreateSchema = [
    // body('accessToken')
    //     .trim()
    //     .notEmpty()
    //     .withMessage('backend-required')
    //     .bail()
    //     .isJWT()
    //     .withMessage('backend-invalid-jwt'),
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

exports.galleryUpdateSchema = [
    // body('accessToken')
    //     .trim()
    //     .notEmpty()
    //     .withMessage('backend-required')
    //     .bail()
    //     .isJWT()
    //     .withMessage('backend-invalid-jwt'),
    body('id')
        .trim()
        .notEmpty()
        .withMessage('backend-required')
        .bail()
        .custom((value) => CustomValidator.validateUUID(value)),
    body('referenceNr')
        .trim()
        .notEmpty()
        .withMessage('backend-required')
        .bail()
        .isLength({min: 6, max: 6})
        .withMessage('backend-invalid-referenceNr'),
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