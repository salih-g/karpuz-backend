const express = require('express');

const validate = require('../../middlewares/validate');
const authController = require('../../controllers/auth.controller');
const { authValidation } = require('../../utils/validations');

const router = express.Router();

router.post(
	'/register',
	validate(authValidation.register),
	authController.register,
);

router.post('/login', validate(authValidation.login), authController.login);

module.exports = router;
