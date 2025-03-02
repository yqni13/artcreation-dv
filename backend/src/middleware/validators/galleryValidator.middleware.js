const { body, param } = require('express-validator');
const CustomValidator = require('../../utils/customValidators.utils');
const GalleryRepository = require('../../repositories/gallery.repository');

exports.galleryFindOneSchema = [
    param('id')
        .trim()
        .notEmpty()
        .withMessage('backend-require')
        .bail()
        .custom((id) => CustomValidator.validateUUID(id))
];

exports.galleryCreateSchema = [
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
        .withMessage('backend-title-length')
        .optional({values: 'null'}),
    body('price')
        .isNumeric()
        .optional({values: 'null'}),
    body('dimensions')
        .trim()
        .notEmpty()
        .withMessage('backend-require')
        .bail()
        .isLength({max: 20})
        .withMessage('backend-length-20'),
    body('artGenre')
        .trim()
        .notEmpty()
        .withMessage('backend-required')
        .bail()
        .isLength({max: 20})
        .withMessage('backend-length-20')
        .bail()
        .custom((value) => CustomValidator.validateArtGenre(value)),
    body('artMedium')
        .trim()
        .notEmpty()
        .withMessage('backend-required')
        .bail()
        .isLength({max: 20})
        .withMessage('backend-length-20')
        .bail()
        .custom((value) => CustomValidator.validateArtMedium(value)),
    body('artTechnique')
        .trim()
        .notEmpty()
        .withMessage('backend-required')
        .bail()
        .isLength({max: 20})
        .withMessage('backend-length-20')
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
    body('id')
        .trim()
        .notEmpty()
        .withMessage('backend-required')
        .bail()
        .custom((value) => CustomValidator.validateUUID(value))
        .bail()
        .custom((id) => CustomValidator.validateExistingEntry(id, GalleryRepository)),
    body('referenceNr')
        .trim()
        .notEmpty()
        .withMessage('backend-required')
        .bail()
        .custom((value, { req }) => CustomValidator.validateRefNrNoManualChange(value, req.body.id, GalleryRepository)),
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
    body('dimensions')
        .trim()
        .notEmpty()
        .withMessage('backend-require')
        .bail()
        .isLength({max: 20})
        .withMessage('backend-length-20'),
    body('artGenre')
        .trim()
        .notEmpty()
        .withMessage('backend-required')
        .bail()
        .isLength({max: 20})
        .withMessage('backend-length-20')
        .bail()
        .custom((value) => CustomValidator.validateArtGenre(value)),
    body('artMedium')
        .trim()
        .notEmpty()
        .withMessage('backend-required')
        .bail()
        .isLength({max: 20})
        .withMessage('backend-length-20')
        .bail()
        .custom((value) => CustomValidator.validateArtMedium(value)),
    body('artTechnique')
        .trim()
        .notEmpty()
        .withMessage('backend-required')
        .bail()
        .isLength({max: 20})
        .withMessage('backend-length-20')
        .bail()
        .custom((value) => CustomValidator.validateArtTechnique(value)),
    body('publication')
        .notEmpty()
        .withMessage('backend-require')
        .bail()
        .isInt({min: 1000, max: 2100})
        .withMessage('backend-range-publication')
];

exports.galleryDeleteSchema = [
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
        .bail()
        .custom((id) => CustomValidator.validateUUID(id))
        .bail()
        .custom((id) => CustomValidator.validateExistingEntry(id, GalleryRepository))
];