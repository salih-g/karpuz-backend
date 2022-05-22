const express = require('express');

const templateController = require('../../controllers/template.controller');

const router = express.Router();

router.get('/', templateController.hello);

module.exports = router;
