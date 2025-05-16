const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const Utils = require('../utils/common.utils');
const NewsController = require('../controllers/news.controller');
const {
    newsFindOneSchema,
    newsCreateSchema,
    newsUpdateSchema,
    newsDeleteSchema
} = require('../middleware/validators/newsValidator.middleware');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');

router.get('/findOneWithGalleryPaths/:id', newsFindOneSchema, awaitHandlerFactory(NewsController.findOneWithGalleryPaths));
router.get('/findAllWithGalleryPaths', awaitHandlerFactory(NewsController.findAllWithGalleryPaths));
router.post('/create', auth(), Utils.parseReqBody, newsCreateSchema, awaitHandlerFactory(NewsController.create));
router.put('/update', auth(), Utils.parseReqBody, newsUpdateSchema, awaitHandlerFactory(NewsController.update));
router.delete('/delete/:id', auth(), newsDeleteSchema, awaitHandlerFactory(NewsController.delete));

router.get('/findOne/:id', newsFindOneSchema, awaitHandlerFactory(NewsController.findOne));
router.get('/findAll', awaitHandlerFactory(NewsController.findAll));

module.exports = router;