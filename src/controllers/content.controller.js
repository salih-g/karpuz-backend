const httpStatus = require('http-status');

const { contentService } = require('../services');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');

const createContent = catchAsync(async (req, res) => {
	const { body: contentBody } = req;

	const content = await contentService.createContent(contentBody);

	res.status(httpStatus.CREATED).send(content);
});

const likeContent = catchAsync(async (req, res, next) => {
	const { body: likeBody } = req;

	if (!likeBody.username) {
		return next(
			new ApiError(
				httpStatus.BAD_REQUEST,
				'You need username for like/dislike',
			),
		);
	}

	const content = await contentService.likeContent(likeBody);

	res.status(httpStatus.OK).send(content);
});

const createComment = catchAsync(async (req, res) => {
	const { body: commentBody } = req;

	const content = await contentService.createComment(commentBody);

	res.status(httpStatus.CREATED).send(content);
});

module.exports = {
	createContent,
	createComment,
	likeContent,
};
