const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { roles } = require('../config/roles');

const userSchema = mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			minlength: 3,
			maxlength: 10,
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

userSchema.methods.isPasswordMatch = async function (password) {
	const user = this;
	return bcrypt.compare(password, user.password);
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
