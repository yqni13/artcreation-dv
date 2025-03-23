const auth = require('../middleware/auth.middleware');
const express = require('express');
const router = express.Router();
const GalleryController = require('../controllers/gallery.controller');
const {
    galleryFindOneSchema,
    galleryCreateSchema,
    galleryUpdateSchema,
    galleryDeleteSchema,
    galleryRefNrPreviewSchema
} = require('../middleware/validators/galleryValidator.middleware');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');
const Utils = require('../utils/common.utils');

router.get('/findOne/:id', galleryFindOneSchema, awaitHandlerFactory(GalleryController.findOne));
router.get('/findAll', awaitHandlerFactory(GalleryController.findAll));
router.post('/create', auth(), Utils.parseReqBody, galleryCreateSchema, awaitHandlerFactory(GalleryController.create));
router.put('/update', auth(), Utils.parseReqBody, galleryUpdateSchema, awaitHandlerFactory(GalleryController.update));
router.delete('/delete/:id', auth(), galleryDeleteSchema, awaitHandlerFactory(GalleryController.delete));
router.get('/refNrPreview/:artGenre', auth(), galleryRefNrPreviewSchema, awaitHandlerFactory(GalleryController.refNrPreview));

module.exports = router;