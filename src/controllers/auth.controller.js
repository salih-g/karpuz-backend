const httpStatus = require('http-status');

const catchAsync = require('../utils/catchAsync');
const { userService, tokenService, authService } = require('../services');

const register = catchAsync(async (req, res) => {
	const user = await userService.createUser(req.body);
	const tokens = await tokenService.generateAuthTokens(user);

	res.status(httpStatus.CREATED).send({ user, tokens });
});

const login = catchAsync(async (req, res) => {
	const { username, password } = req.body;
	const user = await authService.login(username, password);
	const tokens = await tokenService.generateAuthTokens(user);
	res.send({ user, tokens });
});

module.exports = {
	register,
	login,
};
