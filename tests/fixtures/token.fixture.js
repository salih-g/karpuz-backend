const moment = require('moment');
const config = require('../../src/config');
const tokenService = require('../../src/services/token.service');
const { userOne } = require('./user.fixture');

const userOneAccessToken = tokenService.generateToken(
	userOne._id,
	config.tokenTypes.ACCESS,
);

module.exports = {
	userOneAccessToken,
};
