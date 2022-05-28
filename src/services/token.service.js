const jwt = require('jsonwebtoken');
const moment = require('moment');

const config = require('../config');

const generateToken = (
	userId,
	expires,
	type = config.tokenTypes.ACCESS,
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

const verifyToken = async (token) => await jwt.verify(token, config.jwt.secret);

module.exports = {
	generateToken,
	generateAuthTokens,
	verifyToken,
};
