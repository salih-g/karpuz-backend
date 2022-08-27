const jwt = require('jsonwebtoken');
const moment = require('moment');

const config = require('../config');

const generateToken = (
	userId,
	type = config.tokenTypes.ACCESS,
	secret = config.jwt.accessSecret,
) => {
	const payload = {
		sub: userId,
		iat: moment().unix(),
		type,
	};
	return jwt.sign(payload, secret);
};

const generateAuthTokens = async (user) => {
	return generateToken(user.id);
};

const verifyToken = async (token) => await jwt.verify(token, config.jwt.secret);

module.exports = {
	generateToken,
	generateAuthTokens,
	verifyToken,
};
