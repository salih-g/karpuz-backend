const httpStatus = require('http-status');
const sanitizeHtml = require('sanitize-html');

const prisma = require('../prisma');
const { urlify } = require('../utils');
const ApiError = require('../utils/apiError');
const catchAsync = require('../utils/catchAsync');

const sanitizeOptions = {
	allowedTags: ['a', 'b'],
	allowedAttributes: {
		a: ['href', 'target', 'style'],
	},
};

const createContent = catchAsync(async (req, res) => {
	const { body: contentBody } = req;

	const urlifyBody = urlify(contentBody.body);
	const cleanBody = sanitizeHtml(urlifyBody, sanitizeOptions);

	try {
		const content = await prisma.post.create({
			data: { body: cleanBody, userId: contentBody.userId },
		});

		res.status(httpStatus.CREATED).send(content);
	} catch (error) {
		throw new ApiError(
			httpStatus.INTERNAL_SERVER_ERROR,
			error.message || error,
		);
	}
});

const likePost = catchAsync(async (req, res, next) => {
	const { postId, userId } = req.body;

	if (!postId) {
		return next(
			new ApiError(httpStatus.BAD_REQUEST, 'You need postId for like/dislike'),
		);
	}

	try {
		const postLikes = await prisma.postLike.findMany({});

		let isPostLiked = false;
		let likedPostId;

		postLikes.forEach((like) => {
			if (like.userId === userId && like.postId === postId) {
				likedPostId = like.id;
				isPostLiked = true;
			}
		});

		if (!isPostLiked) {
			await prisma.postLike.create({
				data: {
					postId,
					userId,
				},
			});
			return res.status(httpStatus.OK).send({ message: 'liked' });
		} else {
			await prisma.postLike.delete({ where: { id: likedPostId } });
			return res.status(httpStatus.OK).send({ message: 'disliked' });
		}
	} catch (error) {
		throw new ApiError(
			httpStatus.INTERNAL_SERVER_ERROR,
			error.message || error,
		);
	}
});

const likeComment = catchAsync(async (req, res, next) => {
	const { commentId, userId } = req.body;

	if (!commentId) {
		return next(
			new ApiError(
				httpStatus.BAD_REQUEST,
				'You need commentId for like/dislike',
			),
		);
	}

	try {
		const like = await prisma.commentLike.findUnique({
			where: {
				id: commentId,
			},
		});

		if (like == null) {
			await prisma.commentLike.create({
				data: { id: commentId, commentId, userId },
			});
			res.status(httpStatus.OK).send({ message: 'liked' });
		} else {
			await prisma.commentLike.delete({ where: { id: commentId } });
			res.status(httpStatus.OK).send({ message: 'disliked' });
		}
	} catch (error) {
		throw new ApiError(
			httpStatus.INTERNAL_SERVER_ERROR,
			error.message || error,
		);
	}
});

const createComment = catchAsync(async (req, res) => {
	const { userId, postId, body } = req.body;

	const urlifyBody = urlify(body);
	const cleanBody = sanitizeHtml(urlifyBody, sanitizeOptions);

	try {
		const comment = await prisma.comment.create({
			data: { postId, userId, cleanBody },
		});

		res.status(httpStatus.CREATED).send(comment);
	} catch (error) {
		throw new ApiError(
			httpStatus.INTERNAL_SERVER_ERROR,
			error.message || error,
		);
	}
});

const getAllContent = catchAsync(async (req, res) => {
	const page = parseInt(req.query.page);
	const limit = parseInt(req.query.limit);
	const startIndex = (page - 1) * limit;
	const endIndex = page * limit;
	const results = {};

	try {
		const contentLength = await prisma.post.count();

		if (endIndex < contentLength) {
			results.next = {
				page: page + 1,
				limit,
			};
		}
		if (startIndex > 0) {
			results.previous = {
				page: page - 1,
				limit,
			};
		}

		const posts = await prisma.post.findMany({
			include: {
				user: {
					select: {
						username: true,
					},
				},
				comments: {
					include: {
						commentLikes: true,
						user: {
							select: { username: true },
						},
					},
				},
				postLikes: true,
			},
			orderBy: {
				createdAt: 'desc',
			},
		});

		res.status(httpStatus.OK).send(posts);
	} catch (error) {
		throw new ApiError(
			httpStatus.INTERNAL_SERVER_ERROR,
			error.message || error,
		);
	}
});

const getContentById = catchAsync(async (req, res) => {
	const { id: postId } = req.params;

	try {
		const contents = await prisma.post.findUnique({
			where: { id: postId },
			include: {
				user: {
					select: {
						username: true,
					},
				},
				comments: {
					include: {
						commentLikes: true,
						user: {
							select: { username: true },
						},
					},
				},
				postLikes: true,
			},
		});
		res.status(httpStatus.OK).send(contents);
	} catch (error) {
		throw new ApiError(
			httpStatus.INTERNAL_SERVER_ERROR,
			error.message || error,
		);
	}
});

const getContentsWithUsername = catchAsync(async (req, res) => {
	const { userId } = req.params;

	const contents = await prisma.user.findUnique({
		where: { id: userId },
		select: {
			id: true,
			username: true,
			role: true,
			posts: {
				include: {
					comments: { include: { commentLikes: true } },
					postLikes: true,
				},
			},
		},
	});
	res.status(httpStatus.OK).send(contents);
});

module.exports = {
	createContent,
	createComment,
	likePost,
	likeComment,
	getAllContent,
	getContentById,
	getContentsWithUsername,
};
