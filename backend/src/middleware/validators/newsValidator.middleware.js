const { body, param } = require('express-validator');
const CustomValidator = require('../../utils/customValidators.utils');
const NewsRepository = require('../../repositories/news.repository');

exports.newsFindOneSchema = [
    param('id')
        .trim()
        .notEmpty()
        .withMessage('data-required')
        .bail()
        .custom((id) => CustomValidator.validateUUID(id))
];

exports.newsCreateSchema = [
    body('galleryId')
        .custom((foreignKey) => CustomValidator.validateNewsFK(foreignKey)),
    body('imagePath')
        .custom((imagePath, { req }) => CustomValidator.validateNewsImages(imagePath, req.body.galleryId)),
    body('thumbnailPath')
        .custom((thumbnailPath, { req }) => CustomValidator.validateNewsImages(thumbnailPath, req.body.galleryId)),
    body('datetime')
        .trim()
        .notEmpty()
        .withMessage('data-required')
        .custom((datetime) => CustomValidator.validateDateTime(datetime)),
    body('title')
        .trim()
        .notEmpty()
        .withMessage('data-required')
        .bail()
        .isLength({max: 100})
        .withMessage('data-invalid-max#title!100'),
    body('text')
        .trim()
        .notEmpty()
        .withMessage('data-required')
];

exports.newsUpdateSchema = [
    body('id')
            .trim()
            .notEmpty()
            .withMessage('data-required')
            .bail()
            .custom((value) => CustomValidator.validateUUID(value))
            .bail()
            .custom((id, {req}) => CustomValidator.validateExistingEntry(id, NewsRepository, req)),
    body('galleryId')
        .custom((foreignKey) => CustomValidator.validateNewsFK(foreignKey)),
    body('imagePath')
        .custom((imagePath, { req }) => CustomValidator.validateNewsImages(imagePath, req.body.galleryId)),
    body('thumbnailPath')
        .custom((thumbnailPath, { req }) => CustomValidator.validateNewsImages(thumbnailPath, req.body.galleryId)),
    body('datetime')
        .trim()
        .notEmpty()
        .withMessage('data-required')
        .custom((datetime) => CustomValidator.validateDateTime(datetime)),
    body('title')
        .trim()
        .notEmpty()
        .withMessage('data-required')
        .bail()
        .isLength({max: 100})
        .withMessage('data-invalid-max#title!100'),
    body('text')
        .trim()
        .notEmpty()
        .withMessage('data-required')
];

exports.newsDeleteSchema = [
    body('id')
        .trim()
        .notEmpty()
        .withMessage('data-require')
        .bail()
        .custom((id) => CustomValidator.validateUUID(id))
        .bail()
        .custom((id, {req}) => CustomValidator.validateExistingEntry(id, NewsRepository, req))
];