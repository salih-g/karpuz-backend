const Joi = require('joi');

const createContent = {
	body: Joi.object().keys({
		userId: Joi.string().required(),
		body: Joi.string().required(),
	}),
};

const createComment = {
	body: Joi.object().keys({
		userId: Joi.string().required(),
		postId: Joi.string().required(),
		body: Joi.string().required(),
	}),
};

module.exports = {
	createContent,
	createComment,
};
