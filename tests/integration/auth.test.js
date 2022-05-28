const request = require('supertest');
const httpStatus = require('http-status');
const { faker } = require('@faker-js/faker');

const app = require('../../src/app');
const setupTestDB = require('../utils/setupTestDB');
const { userOne, admin, insertUsers } = require('../fixtures/user.fixture');

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
				password: expect.anything(),
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
				password: expect.anything(),
			});

			expect(res.body.tokens).toEqual({
				access: { token: expect.anything(), expires: expect.anything() },
			});
		});

		test('should return 400 error if username is already used', async () => {
			await insertUsers([userOne]);
			newUser.username = userOne.username;

			await request(app)
				.post('/v1/auth/register')
				.send(newUser)
				.expect(httpStatus.INTERNAL_SERVER_ERROR);
		});
	});
	describe('POST /v1/auth/login', () => {
		// let newUser;
		// beforeEach(() => {
		// 	newUser = {
		// 		username: faker.name.findName().toLowerCase(),
		// 		password: 'password1',
		// 	};
		// });
	});
});
