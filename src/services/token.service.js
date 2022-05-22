const jwt = require('jsonwebtoken');
const moment = require('moment');
// const httpStatus = require('http-status');
const config = require('../config/');
// const userService = require('./user.service');
// const { Token } = require('../models');
// const ApiError = require('../utils/ApiError');

const generateToken = (
	userId,
	expires,
	type = 'access',
	secret = config.jwt.secret,
) => {
	const payload = {
		sub: userId,
		iat: moment().unix(),
		exp: expires.unix(),
		type,
	};
	return jwt.sign(payload, secret);
};

const generateAuthTokens = async (user) => {
	const accessTokenExpires = moment().add(
		config.jwt.accessExpirationMinutes,
		'minutes',
	);
	const accessToken = generateToken(user.id, accessTokenExpires);

	return {
		access: {
			token: accessToken,
			expires: accessTokenExpires.toDate(),
		},
	};
};

module.exports = {
	generateToken,
	generateAuthTokens,
};
