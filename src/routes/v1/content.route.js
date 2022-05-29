const express = require('express');

const contentController = require('../../controllers/content.controller');

const router = express.Router();

router.get('/', contentController.hello);

module.exports = router;
