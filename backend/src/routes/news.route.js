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

router.get('/findOne/:id', newsFindOneSchema, awaitHandlerFactory(NewsController.findOne));
router.get('/findAll', awaitHandlerFactory(NewsController.findAll));
router.post('/create', auth(), Utils.parseReqBody, newsCreateSchema, awaitHandlerFactory(NewsController.create));
router.put('/update', auth(), Utils.parseReqBody, newsUpdateSchema, awaitHandlerFactory(NewsController.update));
router.delete('/delete', auth(), newsDeleteSchema, awaitHandlerFactory(NewsController.delete));

module.exports = router;