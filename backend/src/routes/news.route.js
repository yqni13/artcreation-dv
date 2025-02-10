const express = require('express');
const router = express.Router();
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
router.post('/create', newsCreateSchema, awaitHandlerFactory(NewsController.create));
router.put('/update', newsUpdateSchema, awaitHandlerFactory(NewsController.update));
router.delete('/delete', newsDeleteSchema, awaitHandlerFactory(NewsController.delete));

module.exports = router;