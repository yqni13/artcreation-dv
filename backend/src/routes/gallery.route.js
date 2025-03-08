const express = require('express');
const router = express.Router();
const GalleryController = require('../controllers/gallery.controller');
const {
    galleryFindOneSchema,
    galleryCreateSchema,
    galleryUpdateSchema,
    galleryDeleteSchema
} = require('../middleware/validators/galleryValidator.middleware');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');

router.get('/findOne/:id', galleryFindOneSchema, awaitHandlerFactory(GalleryController.findOne));
router.get('/findAll', awaitHandlerFactory(GalleryController.findAll));
router.post('/create', galleryCreateSchema, awaitHandlerFactory(GalleryController.create));
router.put('/update', galleryUpdateSchema, awaitHandlerFactory(GalleryController.update));
router.delete('/delete/:id', galleryDeleteSchema, awaitHandlerFactory(GalleryController.delete));

module.exports = router;