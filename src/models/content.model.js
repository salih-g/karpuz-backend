const mongoose = require('mongoose');

const commentSchema = mongoose.Schema(
	{
		comment: {
			type: String,
			required: true,
			maxlength: 240,
		},
		contentId: {
			type: String,
			required: true,
		},
		username: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
		versionKey: false,
	},
);

const contentSchema = mongoose.Schema(
	{
		post: {
			type: String,
			required: true,
			maxlength: 240,
		},
		username: {
			type: String,
			required: true,
		},
		comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
		likes: [],
	},
	{
		timestamps: true,
		versionKey: false,
	},
);

const Content = mongoose.model('Content', contentSchema);
const Comment = mongoose.model('Comment', commentSchema);

module.exports = {
	Content,
	Comment,
};
