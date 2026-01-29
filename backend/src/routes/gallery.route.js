const auth = require('../middleware/auth.middleware');
const express = require('express');
const router = express.Router();
const GalleryController = require('../controllers/gallery.controller');
const {
    galleryFindOneSchema,
    galleryFindByRefNrSchema,
    galleryCreateSchema,
    galleryUpdateSchema,
    galleryDeleteSchema,
    galleryRefNrPreviewSchema
} = require('../middleware/validators/galleryValidator.middleware');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');
const Utils = require('../utils/common.utils');

// findById
router.get(
    '/findOne/:id',
    galleryFindOneSchema,
    awaitHandlerFactory(GalleryController.findOne)
);

// findByRefNr
router.get(
    '/findByRefNr/:refNr',
    galleryFindByRefNrSchema,
    awaitHandlerFactory(GalleryController.findByRefNr)
);

// findAll
router.get(
    '/findAll',
    awaitHandlerFactory(GalleryController.findAll)
);

// create
router.post(
    '/create',
    auth(),
    Utils.parseReqBody,
    galleryCreateSchema,
    awaitHandlerFactory(GalleryController.create)
);

// update
router.put(
    '/update',
    auth(),
    Utils.parseReqBody,
    galleryUpdateSchema,
    awaitHandlerFactory(GalleryController.update)
);

// delete
router.delete(
    '/delete/:id',
    auth(),
    galleryDeleteSchema,
    awaitHandlerFactory(GalleryController.delete)
);

// getRefNrPreview
router.get(
    '/refNrPreview/:artGenre',
    auth(),
    galleryRefNrPreviewSchema,
    awaitHandlerFactory(GalleryController.refNrPreview)
);

module.exports = router;