const httpStatus = require('http-status');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const ApiError = require('../utils/apiError');

const prisma = new PrismaClient();

const catchAsync = require('../utils/catchAsync');
const { tokenService } = require('../services');
const { User } = require('../models');

const register = catchAsync(async (req, res) => {
	const userBody = req.body;

	//Hash Password
	userBody.password = await bcrypt.hash(userBody.password, 8);

	try {
		const user = await prisma.user.create({
			data: userBody,
		});

		user.token = await tokenService.generateAuthTokens(user);
		user.password = undefined;

		res.status(httpStatus.CREATED).send({ user });
	} catch (error) {
		if (error.code === 'P2002') {
			throw new ApiError(httpStatus.BAD_REQUEST, 'This username was taken');
		}
		throw new ApiError(
			httpStatus.INTERNAL_SERVER_ERROR,
			error.message || error,
		);
	}
});

const login = catchAsync(async (req, res) => {
	const { username, password } = req.body;

	try {
		const user = await prisma.user.findUnique({
			where: {
				username,
			},
		});

		if (!user) {
			throw new ApiError(httpStatus.BAD_REQUEST, 'User can not found');
		}

		if (!bcrypt.compare(password, user.password)) {
			throw new ApiError(
				httpStatus.UNAUTHORIZED,
				'Incorrect username or password',
			);
		}

		user.token = await tokenService.generateAuthTokens(user);
		user.password = undefined;

		res.status(httpStatus.OK).send(user);
	} catch (error) {
		throw new ApiError(
			error.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
			error.message || error,
		);
	}
});

module.exports = {
	register,
	login,
};
