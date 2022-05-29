const mongoose = require('mongoose');

const commentSchema = mongoose.Schema(
	{
		comment: {
			type: String,
			required: true,
			maxlength: 240,
		},
		commentUser: {
			type: String,
			required: true,
		},
		likes: [],
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
