const httpStatus = require('http-status');

const { contentService } = require('../services');
const ApiError = require('../utils/apiError');
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

const getPaginated = catchAsync(async (req, res) => {
	const page = parseInt(req.query.page);
	const limit = parseInt(req.query.limit);
	const contents = await contentService.getPaginatedContents(page, limit);
	res.status(httpStatus.OK).send(contents);
});

module.exports = {
	createContent,
	createComment,
	likeContent,
	getPaginated,
};
