const Joi = require('joi');

const createContent = {
	body: Joi.object().keys({
		username: Joi.string().required(),
		post: Joi.string().required(),
	}),
};

const likeContent = {
	body: Joi.object().keys({
		username: Joi.string().required(),
		contentId: Joi.string().required(),
	}),
};

const createComment = {
	body: Joi.object().keys({
		username: Joi.string().required(),
		contentId: Joi.string().required(),
		comment: Joi.string().required(),
	}),
};

module.exports = {
	createContent,
	likeContent,
	createComment,
};
