const { body } = require('express-validator');
const CustomValidator = require('../../utils/customValidators.utils');

exports.newsFindOneSchema = [
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

exports.newsFindAllSchema = [
    // body('accessToken')
    //     .trim()
    //     .notEmpty()
    //     .withMessage('backend-required')
    //     .bail()
    //     .isJWT()
    //     .withMessage('backend-invalid-jwt'),
];

exports.newsCreateSchema = [
    // body('accessToken')
    //     .trim()
    //     .notEmpty()
    //     .withMessage('backend-required')
    //     .bail()
    //     .isJWT()
    //     .withMessage('backend-invalid-jwt'),
    body('galleryId')
        .custom((foreignKey) => CustomValidator.validateNewsFK(foreignKey)),
    body('imagePath')
        .custom((imagePath, { req }) => CustomValidator.validateNewsImages(imagePath, req.body.galleryId)),
    body('thumbnailPath')
        .custom((thumbnailPath, { req }) => CustomValidator.validateNewsImages(thumbnailPath, req.body.galleryId)),
    body('datetime')
        .trim()
        .notEmpty()
        .withMessage('backend-require')
        .custom((datetime) => CustomValidator.validateDateTime(datetime)),
    body('title')
        .trim()
        .notEmpty()
        .withMessage('backend-require')
        .bail()
        .isLength({max: 100})
        .withMessage('backend-title-length'),
    body('text')
        .trim()
        .notEmpty()
        .withMessage('backend-require')
];

exports.newsUpdateSchema = [
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
    body('galleryId')
        .custom((foreignKey) => CustomValidator.validateNewsFK(foreignKey)),
    body('imagePath')
        .custom((imagePath, { req }) => CustomValidator.validateNewsImages(imagePath, req.body.galleryId)),
    body('thumbnailPath')
        .custom((thumbnailPath, { req }) => CustomValidator.validateNewsImages(thumbnailPath, req.body.galleryId)),
    body('datetime')
        .trim()
        .notEmpty()
        .withMessage('backend-require')
        .custom((datetime) => CustomValidator.validateDateTime(datetime)),
    body('title')
        .trim()
        .notEmpty()
        .withMessage('backend-require')
        .bail()
        .isLength({max: 100})
        .withMessage('backend-title-length'),
    body('text')
        .trim()
        .notEmpty()
        .withMessage('backend-require')
];

exports.newsDeleteSchema = [
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