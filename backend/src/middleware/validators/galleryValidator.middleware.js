const { body, param } = require('express-validator');
const CustomValidator = require('../../utils/customValidators.utils');
const GalleryRepository = require('../../repositories/gallery.repository');
const { SaleStatus } = require('../../utils/enums/sale-status.enum');
const { ArtGenre } = require('../../utils/enums/art-genre.enum');
const { ArtMedium } = require('../../utils/enums/art-medium.enum');
const { ArtTechnique } = require('../../utils/enums/art-technique.enum');

exports.galleryFindOneSchema = [
    param('id')
        .trim()
        .notEmpty()
        .withMessage('data-required')
        .bail()
        .custom((id) => CustomValidator.validateUUID(id))
];

exports.galleryFindByRefNrSchema = [
    param('refNr')
        .trim()
        .notEmpty()
        .withMessage('data-required')
];

exports.galleryCreateSchema = [
    body('imagePath')
        .trim()
        .notEmpty()
        .withMessage('data-required')
        .bail()
        .custom((_, {req}) => CustomValidator.validateImageFileInput(req)),
    body('thumbnailPath')
        .trim()
        .notEmpty()
        .withMessage('data-required'),
    body('title')
        .isLength({max: 100})
        .withMessage('data-invalid-max#title!100')
        .optional({values: 'null'}),
    body('saleStatus')
        .trim()
        .notEmpty()
        .withMessage('data-required')
        .bail()
        .isLength({max: 50})
        .withMessage('data-invalid-max#saleStatus!50')
        .bail()
        .custom((value) => CustomValidator.validateEnum(value, SaleStatus, 'saleStatus')),
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
        .custom((value) => CustomValidator.validateEnum(value, ArtGenre, 'artGenre')),
    body('artMedium')
        .trim()
        .notEmpty()
        .withMessage('data-required')
        .bail()
        .isLength({max: 20})
        .withMessage('data-invalid-max#artMedium!20')
        .bail()
        .custom((value) => CustomValidator.validateEnum(value, ArtMedium, 'artMedium')),
    body('artTechnique')
        .trim()
        .notEmpty()
        .withMessage('data-required')
        .bail()
        .isLength({max: 20})
        .withMessage('data-invalid-max#artTechnique!20')
        .bail()
        .custom((value) => CustomValidator.validateEnum(value, ArtTechnique, 'artTechnique')),
    body('publication')
        .notEmpty()
        .withMessage('data-required')
        .bail()
        .isInt({min: 1000, max: 2100})
        .withMessage('data-invalid-range#publication?1000!2100')
];

exports.galleryUpdateSchema = [
    body('id')
        .trim()
        .notEmpty()
        .withMessage('data-required')
        .bail()
        .custom((value) => CustomValidator.validateUUID(value))
        .bail()
        .custom(async (id, {req}) => await CustomValidator.validateExistingEntry(id, GalleryRepository, req))
        .bail()
        .custom((_, {req}) => CustomValidator.validateImageFileInput(req)),
    body('referenceNr')
        .trim()
        .notEmpty()
        .withMessage('data-required')
        .bail()
        .custom((value, { req }) => CustomValidator.validateRefNrNoManualChange(value, req)),
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
    body('saleStatus')
        .trim()
        .notEmpty()
        .withMessage('data-required')
        .bail()
        .isLength({max: 50})
        .withMessage('data-invalid-max#saleStatus!50')
        .bail()
        .custom((value) => CustomValidator.validateEnum(value, SaleStatus, 'saleStatus')),
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
        .custom((value) => CustomValidator.validateEnum(value, ArtGenre, 'artGenre')),
    body('artMedium')
        .trim()
        .notEmpty()
        .withMessage('data-required')
        .bail()
        .isLength({max: 20})
        .withMessage('data-invalid-max#artMedium!20')
        .bail()
        .custom((value) => CustomValidator.validateEnum(value, ArtMedium, 'artMedium')),
    body('artTechnique')
        .trim()
        .notEmpty()
        .withMessage('data-required')
        .bail()
        .isLength({max: 20})
        .withMessage('data-invalid-max#artTechnique!20')
        .bail()
        .custom((value) => CustomValidator.validateEnum(value, ArtTechnique, 'artTechnique')),
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
        .custom(async (id, {req}) => await CustomValidator.validateExistingEntry(id, GalleryRepository, req))
];

exports.galleryRefNrPreviewSchema = [
    param('artGenre')
        .trim()
        .notEmpty()
        .withMessage('data-required')
        .bail()
        .custom((value) => CustomValidator.validateEnum(value, ArtGenre, 'artGenre'))
];