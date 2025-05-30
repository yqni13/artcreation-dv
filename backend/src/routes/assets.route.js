const auth = require('../middleware/auth.middleware');
const express = require('express');
const router = express.Router();
const AssetsController = require('../controllers/assets.controller');
const {
    assetsFindOneSchema,
    assetsCreateSchema,
    assetsUpdateSchema,
    assetsDeleteSchema,
} = require('../middleware/validators/assetsValidator.middleware');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');
const Utils = require('../utils/common.utils');

router.get('/findOne/:id', assetsFindOneSchema, awaitHandlerFactory(AssetsController.findOne));
router.get('/findAll', awaitHandlerFactory(AssetsController.findAll));
router.post('/create', auth(), Utils.parseReqBody, assetsCreateSchema, awaitHandlerFactory(AssetsController.create));
router.put('/update', auth(), Utils.parseReqBody, assetsUpdateSchema, awaitHandlerFactory(AssetsController.update));
router.delete('/delete/:id', auth(), assetsDeleteSchema, awaitHandlerFactory(AssetsController.delete));

module.exports = router;