const { body, param } = require('express-validator');
const CustomValidator = require('../../utils/customValidators.utils');
const NewsRepository = require('../../repositories/news.repository');
const GalleryRepository = require('../../repositories/gallery.repository');

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
        .custom(async (foreignKey, {req}) => await CustomValidator.validateNewsFK(foreignKey, GalleryRepository, req))
        .bail()
        .custom((_, {req}) => CustomValidator.validateImageFileInput(req)),
    body('imagePath')
        .custom((imagePath, {req}) => CustomValidator.validateNewsImages(imagePath, req.body.galleryId)),
    body('thumbnailPath')
        .custom((thumbnailPath, {req}) => CustomValidator.validateNewsImages(thumbnailPath, req.body.galleryId)),
    body('title')
        .trim()
        .notEmpty()
        .withMessage('data-required')
        .bail()
        .isLength({max: 75})
        .withMessage('data-invalid-max#title!75'),
    body('content')
        .trim()
        .notEmpty()
        .withMessage('data-required')
        .bail()
        .isLength({max: 450})
        .withMessage('data-invalid-max#content!450')
];

exports.newsUpdateSchema = [
    body('id')
        .trim()
        .notEmpty()
        .withMessage('data-required')
        .bail()
        .custom((value) => CustomValidator.validateUUID(value))
        .bail()
        .custom(async (id, {req}) => await CustomValidator.validateExistingEntry(id, NewsRepository, req))
        .bail()
        .custom((_, {req}) => CustomValidator.validateImageFileInput(req)),
    body('galleryId')
        .custom(async (foreignKey, {req}) => await CustomValidator.validateNewsFK(foreignKey, GalleryRepository, req)),
    body('imagePath')
        .custom((imagePath, {req}) => CustomValidator.validateNewsImages(imagePath, req.body.galleryId)),
    body('thumbnailPath')
        .custom((thumbnailPath, {req}) => CustomValidator.validateNewsImages(thumbnailPath, req.body.galleryId)),
    body('title')
        .trim()
        .notEmpty()
        .withMessage('data-required')
        .bail()
        .isLength({max: 75})
        .withMessage('data-invalid-max#title!75'),
    body('content')
        .trim()
        .notEmpty()
        .withMessage('data-required')
        .bail()
        .isLength({max: 450})
        .withMessage('data-invalid-max#content!450')
];

exports.newsDeleteSchema = [
    param('id')
        .trim()
        .notEmpty()
        .withMessage('data-require')
        .bail()
        .custom((id) => CustomValidator.validateUUID(id))
        .bail()
        .custom(async (id, {req}) => await CustomValidator.validateExistingEntry(id, NewsRepository, req))
];