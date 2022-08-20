const express = require('express');

const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { contentValidation } = require('../../utils/validations');
const contentController = require('../../controllers/content.controller');

const router = express.Router();

router.post(
	'/create',
	auth,
	validate(contentValidation.createContent),
	contentController.createContent,
);

router.post(
	'/comment/create/',
	auth,
	validate(contentValidation.createComment),
	contentController.createComment,
);

router.put(
	'/like',
	auth,
	validate(contentValidation.likeContent),
	contentController.likeContent,
);

router.get('/paginated', contentController.getPaginated);

router.get('/:id', contentController.getContentById);
router.get('/user/:username', contentController.getContentsWithUsername);

module.exports = router;
