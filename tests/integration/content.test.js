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

const { Content } = require('../../src/models');

setupTestDB();

describe('Content routes', () => {
	describe('POST /v1/content/create', () => {
		let newPost;
		beforeEach(() => {
			newPost = {
				post: 'test12',
				username: faker.name.findName().toLocaleLowerCase(),
			};
		});

		test('should return 201 and successfully create content with expected body', async () => {
			const res = await request(app)
				.post('/v1/content/create')
				.send(newPost)
				.expect(httpStatus.CREATED);

			expect(res.body).toEqual({
				post: 'test12',
				username: newPost.username,
				comments: [],
				likes: [],
				_id: expect.anything(),
				createdAt: expect.anything(),
				updatedAt: expect.anything(),
			});

			const content = await Content.findById(res.body._id);
			expect(content).toBeDefined();
			expect(content).toMatchObject({
				post: 'test12',
				username: newPost.username,
				comments: [],
				likes: [],
				_id: expect.anything(),
				createdAt: expect.anything(),
				updatedAt: expect.anything(),
			});
		});

		test('should return 400 and doesnt create content without post field ', async () => {
			newPost.post = undefined;
			await request(app)
				.post('/v1/content/create')
				.send(newPost)
				.expect(httpStatus.BAD_REQUEST);
		});

		test('should return 400 and doesnt create content without username field ', async () => {
			newPost.username = undefined;
			await request(app)
				.post('/v1/content/create')
				.send(newPost)
				.expect(httpStatus.BAD_REQUEST);
		});
	});
});
