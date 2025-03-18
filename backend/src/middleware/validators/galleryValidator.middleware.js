const { body, param } = require('express-validator');
const CustomValidator = require('../../utils/customValidators.utils');
const GalleryRepository = require('../../repositories/gallery.repository');

exports.galleryFindOneSchema = [
    param('id')
        .trim()
        .notEmpty()
        .withMessage('data-required')
        .bail()
        .custom((id) => CustomValidator.validateUUID(id))
];

exports.galleryCreateSchema = [
    // custom solution file input => express-validator does not handle files
    CustomValidator.validateImageFileInput,
    body('imagePath')
        .trim()
        .notEmpty()
        .withMessage('data-required'),
    body('thumbnailPath')
        .trim()
        .notEmpty()
        .withMessage('data-required'),
    body('title')
        .isLength({max: 100})
        .withMessage('data-invalid-max#title!100')
        .optional({values: 'null'}),
    body('price')
        .isNumeric()
        .optional({values: 'null'}),
    body('dimensions')
        .trim()
        .notEmpty()
        .withMessage('data-required')
        .bail()
        .isLength({max: 20})
        .withMessage('data-invalid-max#dimensions!20'),
    body('artGenre')
        .trim()
        .notEmpty()
        .withMessage('data-required')
        .bail()
        .isLength({max: 20})
        .withMessage('data-invalid-max#artGenre!20')
        .bail()
        .custom((value) => CustomValidator.validateArtGenre(value)),
    body('artMedium')
        .trim()
        .notEmpty()
        .withMessage('data-required')
        .bail()
        .isLength({max: 20})
        .withMessage('data-invalid-max#artMedium!20')
        .bail()
        .custom((value) => CustomValidator.validateArtMedium(value)),
    body('artTechnique')
        .trim()
        .notEmpty()
        .withMessage('data-required')
        .bail()
        .isLength({max: 20})
        .withMessage('data-invalid-max#artTechnique!20')
        .bail()
        .custom((value) => CustomValidator.validateArtTechnique(value)),
    body('publication')
        .notEmpty()
        .withMessage('data-required')
        .bail()
        .isInt({min: 1000, max: 2100})
        .withMessage('data-invalid-range#publication?1000!2100')
];

exports.galleryUpdateSchema = [
    CustomValidator.validateImageFileUpdate,
    body('id')
        .trim()
        .notEmpty()
        .withMessage('data-required')
        .bail()
        .custom((value) => CustomValidator.validateUUID(value))
        .bail()
        .custom((id, {req}) => CustomValidator.validateExistingEntry(id, GalleryRepository, req)),
    body('referenceNr')
        .trim()
        .notEmpty()
        .withMessage('data-required')
        .bail()
        .custom((value, { req }) => CustomValidator.validateRefNrNoManualChange(value, req, GalleryRepository)),
    body('imagePath')
        .trim()
        .notEmpty()
        .withMessage('data-required'),
    body('thumbnailPath')
        .trim()
        .notEmpty()
        .withMessage('data-required'),
    body('title')
        .isLength({max: 100})
        .optional({values: 'null'}),
    body('price')
        .isNumeric()
        .optional({values: 'null'}),
    body('dimensions')
        .trim()
        .notEmpty()
        .withMessage('data-required')
        .bail()
        .isLength({max: 20})
        .withMessage('data-invalid-max#dimensions!20'),
    body('artGenre')
        .trim()
        .notEmpty()
        .withMessage('data-required')
        .bail()
        .custom((value) => CustomValidator.validateArtGenre(value)),
    body('artMedium')
        .trim()
        .notEmpty()
        .withMessage('data-required')
        .bail()
        .isLength({max: 20})
        .withMessage('data-invalid-max#artMedium!20')
        .bail()
        .custom((value) => CustomValidator.validateArtMedium(value)),
    body('artTechnique')
        .trim()
        .notEmpty()
        .withMessage('data-required')
        .bail()
        .isLength({max: 20})
        .withMessage('data-invalid-max#artTechnique!20')
        .bail()
        .custom((value) => CustomValidator.validateArtTechnique(value)),
    body('publication')
        .notEmpty()
        .withMessage('data-required')
        .bail()
        .isInt({min: 1000, max: 2100})
        .withMessage('data-invalid-range#publication?1000!2100')
];

exports.galleryDeleteSchema = [
    param('id')
        .trim()
        .notEmpty()
        .withMessage('data-required')
        .bail()
        .custom((id) => CustomValidator.validateUUID(id))
        .bail()
        .custom((id, {req}) => CustomValidator.validateExistingEntry(id, GalleryRepository, req))
];

exports.galleryRefNrPreviewSchema = [
    param('artGenre')
        .trim()
        .notEmpty()
        .withMessage('data-required')
        .bail()
        .custom((value) => CustomValidator.validateArtGenre(value))
];