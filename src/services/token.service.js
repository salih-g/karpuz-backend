const jwt = require('jsonwebtoken');
const moment = require('moment');

const config = require('../config');

const generateToken = (
	userId,
	type = config.tokenTypes.ACCESS,
	secret = config.jwt.secret,
) => {
	const payload = {
		sub: userId,
		iat: moment().unix(),
		type,
	};
	return jwt.sign(payload, secret);
};

const generateAuthTokens = async (user) => {
	const accessToken = generateToken(user.id);

	return {
		token: accessToken,
	};
};

const verifyToken = async (token) => await jwt.verify(token, config.jwt.secret);

module.exports = {
	generateToken,
	generateAuthTokens,
	verifyToken,
};
