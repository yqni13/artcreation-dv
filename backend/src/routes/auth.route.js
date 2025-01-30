const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authSchema } = require('../middleware/validators/authValidator.middleware');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');

router.post('/login', authSchema, awaitHandlerFactory(authController.login));

module.exports = router;