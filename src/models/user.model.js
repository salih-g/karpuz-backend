const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const ApiError = require('../utils/apiError');
const httpStatus = require('http-status');

const userSchema = mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			minlength: 3,
			maxlength: 20,
		},

		password: {
			type: String,
			required: true,
		},
		role: {
			type: String,
			default: 'user',
		},
	},
	{
		timestamps: true,
		versionKey: false,
	},
);

userSchema.post('save', function (error, _, next) {
	if (error.code === 11000) {
		next(new ApiError(httpStatus.BAD_REQUEST, 'This username was taken'));
	} else {
		next();
	}
});

userSchema.methods.isPasswordMatch = async function (password) {
	const user = this;
};

userSchema.pre('save', async function (next) {
	const user = this;
	if (user.isModified('password')) {
		user.password = await bcrypt.hash(user.password, 8);
	}
	next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
