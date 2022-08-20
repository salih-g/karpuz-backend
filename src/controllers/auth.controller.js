const httpStatus = require('http-status');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const ApiError = require('../utils/apiError');

const prisma = new PrismaClient();

const catchAsync = require('../utils/catchAsync');
const { tokenService, authService } = require('../services');

const register = catchAsync(async (req, res) => {
	const userBody = req.body;
	userBody.password = await bcrypt.hash(userBody.password, 8);

	try {
		const user = await prisma.user.create({
			data: userBody,
		});

		user.token = await tokenService.generateAuthTokens(user);
		res.status(httpStatus.CREATED).send({ user });
	} catch (error) {
		if (error.code === 'P2002') {
			throw new ApiError(httpStatus.BAD_REQUEST, 'This username was taken');
		}
	}
});

const login = catchAsync(async (req, res) => {
	const { username, password } = req.body;
	const user = await authService.login(username, password);
	const tokens = await tokenService.generateAuthTokens(user);

	user.password = undefined;
	res.send({ user, tokens });
});

module.exports = {
	register,
	login,
};
