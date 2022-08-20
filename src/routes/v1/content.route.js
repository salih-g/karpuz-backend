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

router.put('/likePost', auth, contentController.likePost);
router.put('/likeComment', auth, contentController.likeComment);

router.get('/', contentController.getAllContent);
router.get('/test', contentController.test);

router.get('/:id', contentController.getContentById);
router.get('/user/:userId', contentController.getContentsWithUsername);

module.exports = router;
