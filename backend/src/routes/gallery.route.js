const express = require('express');
const router = express.Router();
const galleryController = require('../controllers/gallery.controller');
const {
    galleryFindOneSchema,
    galleryFindAllFilteredSchema,
    galleryCreateSchema
} = require('../middleware/validators/galleryValidator.middleware');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');

router.post('/findOne', galleryFindOneSchema, awaitHandlerFactory(galleryController.findOne));
router.post('/findAllFiltered', galleryFindAllFilteredSchema, awaitHandlerFactory(galleryController.findAllFiltered));
router.post('/create', galleryCreateSchema, awaitHandlerFactory(galleryController.create));

module.exports = router;