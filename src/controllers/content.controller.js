const httpStatus = require('http-status');
const { PrismaClient } = require('@prisma/client');

const { contentService } = require('../services');
const ApiError = require('../utils/apiError');
const catchAsync = require('../utils/catchAsync');
const prisma = new PrismaClient();

const createContent = catchAsync(async (req, res) => {
	const { body: contentBody } = req;

	try {
		const content = await prisma.post.create({
			data: { body: contentBody.body, userId: contentBody.userId },
		});

		res.status(httpStatus.CREATED).send(content);
	} catch (error) {
		throw new ApiError(
			httpStatus.INTERNAL_SERVER_ERROR,
			error.message || error,
		);
	}
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

const getContentById = catchAsync(async (req, res) => {
	const { id: contentId } = req.params;

	const contents = await contentService.getContentById(contentId);
	res.status(httpStatus.OK).send(contents);
});

const getContentsWithUsername = catchAsync(async (req, res) => {
	const { username } = req.params;

	const contents = await contentService.getContentsWithUsername(username);
	res.status(httpStatus.OK).send(contents);
});

const test = catchAsync(async (req, res) => {
	const resp = await prisma.user.findMany({
		select: {
			username: true,
			likes: true,
			posts: true,
			comments: true,
		},
	});
	res.send({ resp });
});

module.exports = {
	createContent,
	createComment,
	likeContent,
	getPaginated,
	getContentById,
	getContentsWithUsername,
	test,
};
