const { body, param } = require('express-validator');
const CustomValidator = require('../../utils/customValidators.utils');
const AssetsRepository = require('../../repositories/assets.repository');
const { AssetsCategory } = require('../../utils/enums/assets-category.enum');

exports.assetsFindOneSchema = [
    param('id')
        .trim()
        .notEmpty()
        .withMessage('data-required')
        .bail()
        .custom((id) => CustomValidator.validateUUID(id))
];

exports.assetsCreateSchema = [
    CustomValidator.validateImageFileInput,
    body('category')
        .trim()
        .notEmpty()
        .withMessage('data-required')
        .bail()
        .isLength({max: 30})
        .withMessage('data-invalid-max#category!30')
        .bail()
        .custom((value) => CustomValidator.validateEnum(value, AssetsCategory, 'category')),
    body('imagePath')
        .trim()
        .notEmpty()
        .withMessage('data-required'),
    body('thumbnailPath')
        .trim()
        .notEmpty()
        .withMessage('data-required'),
    body('location')
        .trim()
        .optional({values: 'null'}),
    body('datetime')
        .trim()
        .notEmpty()
        .withMessage('data-required')
];

exports.assetsUpdateSchema = [
    CustomValidator.validateImageFileUpdate,
    body('id')
        .trim()
        .notEmpty()
        .withMessage('data-required')
        .bail()
        .custom((value) => CustomValidator.validateUUID(value))
        .bail()
        .custom(async (id, {req}) => await CustomValidator.validateExistingEntry(id, AssetsRepository, req)),
    body('category')
        .trim()
        .notEmpty()
        .withMessage('data-required')
        .bail()
        .isLength({max: 30})
        .withMessage('data-invalid-max#category!30')
        .bail()
        .custom((value) => CustomValidator.validateEnum(value, AssetsCategory, 'category')),
    body('imagePath')
        .trim()
        .notEmpty()
        .withMessage('data-required'),
    body('thumbnailPath')
        .trim()
        .notEmpty()
        .withMessage('data-required'),
    body('location')
        .trim()
        .optional({values: 'null'}),
    body('datetime')
        .trim()
        .notEmpty()
        .withMessage('data-required')
];

exports.assetsDeleteSchema = [
    param('id')
        .trim()
        .notEmpty()
        .withMessage('data-required')
        .bail()
        .custom((id) => CustomValidator.validateUUID(id))
        .bail()
        .custom(async (id, {req}) => await CustomValidator.validateExistingEntry(id, AssetsRepository, req))
];