const express = require('express');
const router = express.Router();
const galleryController = require('../controllers/gallery.controller');
const {
    galleryFindOneSchema,
    galleryFindAllFilteredSchema,
    galleryFindAllSchema,
    galleryCreateSchema,
    galleryUpdateSchema
} = require('../middleware/validators/galleryValidator.middleware');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');

router.post('/findOne', galleryFindOneSchema, awaitHandlerFactory(galleryController.findOne));
router.post('/findAllFiltered', galleryFindAllFilteredSchema, awaitHandlerFactory(galleryController.findAllFiltered));
router.get('/findAll', galleryFindAllSchema, awaitHandlerFactory(galleryController.findAll));
router.post('/create', galleryCreateSchema, awaitHandlerFactory(galleryController.create));
router.put('/update', galleryUpdateSchema, awaitHandlerFactory(galleryController.update));

module.exports = router;