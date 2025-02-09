const express = require('express');
const router = express.Router();
const GalleryController = require('../controllers/gallery.controller');
const {
    galleryFindOneSchema,
    galleryFindAllFilteredSchema,
    galleryFindAllSchema,
    galleryCreateSchema,
    galleryUpdateSchema,
    galleryDeleteSchema
} = require('../middleware/validators/galleryValidator.middleware');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');

router.post('/findOne', galleryFindOneSchema, awaitHandlerFactory(GalleryController.findOne));
router.post('/findAllFiltered', galleryFindAllFilteredSchema, awaitHandlerFactory(GalleryController.findAllFiltered));
router.get('/findAll', galleryFindAllSchema, awaitHandlerFactory(GalleryController.findAll));
router.post('/create', galleryCreateSchema, awaitHandlerFactory(GalleryController.create));
router.put('/update', galleryUpdateSchema, awaitHandlerFactory(GalleryController.update));
router.delete('/delete', galleryDeleteSchema, awaitHandlerFactory(GalleryController.delete));

module.exports = router;