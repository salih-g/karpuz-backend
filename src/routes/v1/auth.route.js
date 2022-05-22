const express = require('express');

const validate = require('../../middlewares/validate');
const authController = require('../../controllers/auth.controller');
const { authValidation } = require('../../validations');

const router = express.Router();

router.post(
	'/register',
	validate(authValidation.register),
	authController.register,
);

module.exports = router;
