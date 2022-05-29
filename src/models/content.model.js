const mongoose = require('mongoose');

const contentSchema = mongoose.Schema(
	{
		post: {
			type: String,
			required: true,
			maxlength: 240,
		},
		comments: [
			{
				type: mongoose.Schema(
					{
						comment: String,
						commentUser: String,
						maxlength: 240,
						likes: [
							{
								type: mongoose.Schema({
									likedUsername: String,
								}),
							},
						],
					},
					{
						timestamps: true,
						versionKey: false,
					},
				),
			},
		],
	},
	{
		timestamps: true,
		versionKey: false,
	},
);

const Content = mongoose.model('Content', contentSchema);

module.exports = Content;
