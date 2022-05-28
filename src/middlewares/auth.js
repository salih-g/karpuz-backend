const httpStatus = require('http-status');

const { verifyToken } = require('../services/token.service');
const ApiError = require('../utils/ApiError');

const { User } = require('../models/index');

const auth = async (req, res, next) => {
	let token;

	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer')
	) {
		token = req.headers.authorization.split(' ')[1];
	}

	if (!token) {
		return next(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
	}

	try {
		const { sub } = await verifyToken(token);

		const user = await User.findById(sub);

		if (!user)
			return next(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));

		req.user = user;
		next();
	} catch (err) {
		return next(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
	}
};

module.exports = auth;
