const { Types } = require('mongoose');
const { Content, Comment } = require('../models');

const createContent = async (contentBody) => {
	return await Content.create(contentBody);
};

const likeContent = async (likeBody) => {
	const content = await Content.findById(likeBody.contentId);

	if (!content.likes.includes(likeBody.username)) {
		await content.updateOne({ $push: { likes: likeBody.username } });
		return await Content.findById(likeBody.contentId).populate({
			path: 'comments',
			sort: { createdAt: 1 },
		});
	} else {
		await content.updateOne({ $pull: { likes: likeBody.username } });
		return await Content.findById(likeBody.contentId).populate({
			path: 'comments',
			sort: { createdAt: 1 },
		});
	}
};

const createComment = async (commentBody) => {
	const newComment = new Comment({ _id: new Types.ObjectId(), ...commentBody });

	const comment = await newComment.save();

	await Content.findByIdAndUpdate(commentBody.contentId, {
		$push: { comments: comment },
	});
	return await Content.findById(commentBody.contentId).populate({
		path: 'comments',
		sort: { createdAt: 1 },
	});
};

const getPaginatedContents = async (page, limit) => {
	const startIndex = (page - 1) * limit;
	const endIndex = page * limit;
	const results = {};

	const contentLength = await Content.countDocuments();

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

	return await Content.find()
		.sort({ createdAt: -1 })
		.populate({
			path: 'comments',
			sort: { createdAt: 1 },
		})
		.limit(limit)
		.skip(startIndex);
};

const getContentById = async (contentId) => {
	return await Content.findById(contentId).populate({
		path: 'comments',
		sort: { createdAt: 1 },
	});
};
module.exports = {
	createContent,
	createComment,
	likeContent,
	getPaginatedContents,
	getContentById,
};
