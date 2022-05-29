const express = require('express');

const contentController = require('../../controllers/content.controller');

const router = express.Router();

router.post('/create', contentController.createContent);
router.post('/comment/create/', contentController.createComment);

module.exports = router;
