const express = require('express');

const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { contentValidation } = require('../../validations');
const contentController = require('../../controllers/content.controller');

const router = express.Router();

router.post(
	'/create',
	auth,
	validate(contentValidation.createComment),
	contentController.createContent,
);
router.put(
	'/like',
	auth,
	validate(contentValidation.likeContent),
	contentController.likeContent,
);
router.post(
	'/comment/create/',
	auth,
	validate(contentValidation.createComment),
	contentController.createComment,
);

module.exports = router;
