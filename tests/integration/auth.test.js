const request = require('supertest');
const moment = require('moment');
const httpStatus = require('http-status');
const { faker } = require('@faker-js/faker');
const httpMocks = require('node-mocks-http');

const app = require('../../src/app');
const config = require('../../src/config');
const auth = require('../../src/middlewares/auth');
const ApiError = require('../../src/utils/ApiError');
const setupTestDB = require('../utils/setupTestDB');
const { tokenService } = require('../../src/services');
const { userOne, insertUsers } = require('../fixtures/user.fixture');
const { userOneAccessToken } = require('../fixtures/token.fixture');

const { User } = require('../../src/models');

setupTestDB();

describe('Auth routes', () => {
	describe('POST /v1/auth/register', () => {
		let newUser;
		beforeEach(() => {
			newUser = {
				username: faker.name.findName().toLocaleLowerCase(),
				password: 'password1',
			};
		});

		test('should return 201 and successfully register user if request data is ok', async () => {
			const res = await request(app)
				.post('/v1/auth/register')
				.send(newUser)
				.expect(httpStatus.CREATED);

			expect(res.body.user).toEqual({
				_id: expect.anything(),
				role: 'user',
				username: newUser.username,
				createdAt: expect.anything(),
				updatedAt: expect.anything(),
			});

			const dbUser = await User.findById(res.body.user._id);
			expect(dbUser).toBeDefined();
			expect(dbUser.password).not.toBe(newUser.password);
			expect(dbUser).toMatchObject({
				_id: expect.anything(),
				role: 'user',
				username: newUser.username,
				createdAt: expect.anything(),
				updatedAt: expect.anything(),
			});

			expect(res.body.tokens).toEqual({
				token: expect.anything(),
			});
		});

		test('should return 400 error if username is already used', async () => {
			await insertUsers([userOne]);
			newUser.username = userOne.username;

			await request(app)
				.post('/v1/auth/register')
				.send(newUser)
				.expect(httpStatus.BAD_REQUEST);
		});
	});
	describe('POST /v1/auth/login', () => {
		let newUser;
		beforeEach(() => {
			newUser = {
				username: faker.name.findName().toLowerCase(),
				password: 'password1',
			};
		});

		test('should return 200 and login user if username and password match', async () => {
			await insertUsers([userOne]);
			const loginCredentials = {
				username: userOne.username,
				password: userOne.password,
			};

			const res = await request(app)
				.post('/v1/auth/login')
				.send(loginCredentials)
				.expect(httpStatus.OK);

			expect(res.body.user).toEqual({
				_id: expect.anything(),
				createdAt: expect.anything(),
				updatedAt: expect.anything(),
				username: userOne.username,
				role: userOne.role,
			});

			expect(res.body.tokens).toEqual({
				token: expect.anything(),
			});
		});

		test('should return 401 error if there are no users with that email', async () => {
			const loginCredentials = {
				username: userOne.username,
				password: userOne.password,
			};

			const res = await request(app)
				.post('/v1/auth/login')
				.send(loginCredentials)
				.expect(httpStatus.UNAUTHORIZED);

			expect(res.body).toEqual({
				code: httpStatus.UNAUTHORIZED,
				message: 'Incorrect username or password',
			});
		});

		test('should return 401 error if password is wrong', async () => {
			await insertUsers([userOne]);
			const loginCredentials = {
				username: userOne.username,
				password: 'wrongPassword1',
			};

			const res = await request(app)
				.post('/v1/auth/login')
				.send(loginCredentials)
				.expect(httpStatus.UNAUTHORIZED);

			expect(res.body).toEqual({
				code: httpStatus.UNAUTHORIZED,
				message: 'Incorrect username or password',
			});
		});
	});
});

describe('Auth middleware', () => {
	test('should call next with no errors if access token is valid', async () => {
		await insertUsers([userOne]);
		const req = httpMocks.createRequest({
			headers: { Authorization: `Bearer ${userOneAccessToken}` },
		});
		const next = jest.fn();

		await auth(req, httpMocks.createResponse(), next);

		expect(next).toHaveBeenCalledWith();
		expect(req.user._id).toEqual(userOne._id);
	});

	test('should call next with no errors if access token is valid', async () => {
		await insertUsers([userOne]);
		const req = httpMocks.createRequest({
			headers: { Authorization: `Bearer ${userOneAccessToken}` },
		});
		const next = jest.fn();

		await auth(req, httpMocks.createResponse(), next);

		expect(next).toHaveBeenCalledWith();
		expect(req.user._id).toEqual(userOne._id);
	});

	test('should call next with unauthorized error if access token is not a valid jwt token', async () => {
		await insertUsers([userOne]);
		const req = httpMocks.createRequest({
			headers: { Authorization: 'Bearer randomToken' },
		});
		const next = jest.fn();

		await auth(req, httpMocks.createResponse(), next);

		expect(next).toHaveBeenCalledWith(expect.any(ApiError));
		expect(next).toHaveBeenCalledWith(
			expect.objectContaining({
				statusCode: httpStatus.UNAUTHORIZED,
				message: 'Please authenticate',
			}),
		);
	});

	test('should call next with unauthorized error if access token is generated with an invalid secret', async () => {
		await insertUsers([userOne]);
		const expires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
		const accessToken = tokenService.generateToken(
			userOne._id,
			expires,
			config.tokenTypes.ACCESS,
			'invalidSecret',
		);
		const req = httpMocks.createRequest({
			headers: { Authorization: `Bearer ${accessToken}` },
		});
		const next = jest.fn();

		await auth(req, httpMocks.createResponse(), next);

		expect(next).toHaveBeenCalledWith(expect.any(ApiError));
		expect(next).toHaveBeenCalledWith(
			expect.objectContaining({
				statusCode: httpStatus.UNAUTHORIZED,
				message: 'Please authenticate',
			}),
		);
	});

	test('should call next with unauthorized error if access token is expired', async () => {
		await insertUsers([userOne]);
		const expires = moment().subtract(1, 'minutes');
		const accessToken = tokenService.generateToken(
			userOne._id,
			expires,
			config.tokenTypes.ACCESS,
		);
		const req = httpMocks.createRequest({
			headers: { Authorization: `Bearer ${accessToken}` },
		});
		const next = jest.fn();

		await auth(req, httpMocks.createResponse(), next);

		expect(next).toHaveBeenCalledWith(expect.any(ApiError));
		expect(next).toHaveBeenCalledWith(
			expect.objectContaining({
				statusCode: httpStatus.UNAUTHORIZED,
				message: 'Please authenticate',
			}),
		);
	});

	test('should call next with unauthorized error if user is not found', async () => {
		const req = httpMocks.createRequest({
			headers: { Authorization: `Bearer ${userOneAccessToken}` },
		});
		const next = jest.fn();

		await auth(req, httpMocks.createResponse(), next);

		expect(next).toHaveBeenCalledWith(expect.any(ApiError));
		expect(next).toHaveBeenCalledWith(
			expect.objectContaining({
				statusCode: httpStatus.UNAUTHORIZED,
				message: 'Please authenticate',
			}),
		);
	});
});
