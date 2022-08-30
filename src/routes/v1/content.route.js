const express = require('express');

const auth = require('../../middlewares/auth');
const contentController = require('../../controllers/content.controller');

const router = express.Router();

router.post('/create', auth, contentController.createContent);

router.post('/comment/create/', auth, contentController.createComment);

router.put('/likePost', auth, contentController.likePost);
router.put('/likeComment', auth, contentController.likeComment);

router.get('/', contentController.getAllContent);

router.get('/:id', contentController.getContentById);
router.get('/user/:userId', contentController.getContentsWithUsername);

module.exports = router;
