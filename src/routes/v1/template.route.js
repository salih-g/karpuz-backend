const express = require('express');

const auth = require('../../middlewares/auth');
const templateController = require('../../controllers/template.controller');

const router = express.Router();

router.get('/', auth, templateController.hello);

module.exports = router;
