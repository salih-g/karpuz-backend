const moment = require('moment');
const config = require('../../src/config');
const tokenService = require('../../src/services/token.service');
const { userOne } = require('./user.fixture');

const accessTokenExpires = moment().add(
	config.jwt.accessExpirationMinutes,
	'minutes',
);
const userOneAccessToken = tokenService.generateToken(
	userOne._id,
	accessTokenExpires,
	config.tokenTypes.ACCESS,
);

module.exports = {
	userOneAccessToken,
};
