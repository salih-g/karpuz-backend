const request = require('supertest');
const httpStatus = require('http-status');
const { faker } = require('@faker-js/faker');

const app = require('../../src/app');
const setupTestDB = require('../utils/setupTestDB');

const { Content } = require('../../src/models');
const { insertUsers, userOne } = require('../fixtures/user.fixture');
const { userOneAccessToken } = require('../fixtures/token.fixture');

setupTestDB();

describe('Content POST routes', () => {
	describe('POST /v1/content/create', () => {
		let newBody;
		beforeEach(async () => {
			await insertUsers([userOne]);
			newBody = {
				post: 'test12',
				username: faker.name.findName().toLocaleLowerCase(),
			};
		});

		test('should return 201 and successfully create content with expected body', async () => {
			const res = await request(app)
				.post('/v1/content/create')
				.set({ Authorization: `Bearer ${userOneAccessToken}` })
				.send(newBody)
				.expect(httpStatus.CREATED);

			expect(res.body).toEqual({
				post: 'test12',
				username: newBody.username,
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
				username: newBody.username,
				comments: [],
				likes: [],
				_id: expect.anything(),
				createdAt: expect.anything(),
				updatedAt: expect.anything(),
			});
		});

		test('should return 400 and doesnt create content without post field ', async () => {
			newBody.post = undefined;
			await request(app)
				.post('/v1/content/create')
				.set({ Authorization: `Bearer ${userOneAccessToken}` })
				.send(newBody)
				.expect(httpStatus.BAD_REQUEST);
		});

		test('should return 400 and doesnt create content without username field ', async () => {
			newBody.username = undefined;
			await request(app)
				.post('/v1/content/create')
				.set({ Authorization: `Bearer ${userOneAccessToken}` })
				.send(newBody)
				.expect(httpStatus.BAD_REQUEST);
		});
	});

	describe('POST /v1/content/comments/create', () => {});
});

describe('Content PUT routes', () => {
	describe('PUT /v1/content/like', () => {
		let newBody;
		const postBody = {
			post: 'test12',
			username: faker.name.findName().toLocaleLowerCase(),
		};

		beforeEach(async () => {
			await insertUsers([userOne]);
			const response = await request(app)
				.post('/v1/content/create')
				.set({ Authorization: `Bearer ${userOneAccessToken}` })
				.send(postBody)
				.expect(httpStatus.CREATED);
			newBody = {
				contentId: response.body._id,
				username: faker.name.findName().toLocaleLowerCase(),
			};
		});

		test('should return 201 and successfully like/dislike content', async () => {
			//Like
			const like = await request(app)
				.put('/v1/content/like')
				.set({ Authorization: `Bearer ${userOneAccessToken}` })
				.send(newBody)
				.expect(httpStatus.OK);

			expect(like.body).toEqual({
				username: postBody.username,
				post: postBody.post,
				comments: [],
				likes: [newBody.username],
				_id: expect.anything(),
				createdAt: expect.anything(),
				updatedAt: expect.anything(),
			});

			const content = await Content.findById(like.body._id);
			expect(content).toBeDefined();
			expect(content).toMatchObject({
				post: postBody.post,
				username: postBody.username,
				comments: [],
				likes: [newBody.username],
				_id: expect.anything(),
				createdAt: expect.anything(),
				updatedAt: expect.anything(),
			});

			//Dislike
			const dislike = await request(app)
				.put('/v1/content/like')
				.set({ Authorization: `Bearer ${userOneAccessToken}` })
				.send(newBody)
				.expect(httpStatus.OK);

			expect(dislike.body).toEqual({
				username: postBody.username,
				post: postBody.post,
				comments: [],
				likes: [],
				_id: expect.anything(),
				createdAt: expect.anything(),
				updatedAt: expect.anything(),
			});

			const contentDislike = await Content.findById(dislike.body._id);
			expect(contentDislike).toBeDefined();
			expect(contentDislike).toMatchObject({
				post: postBody.post,
				username: postBody.username,
				comments: [],
				likes: [],
				_id: expect.anything(),
				createdAt: expect.anything(),
				updatedAt: expect.anything(),
			});
		});

		test('should return 400 without username', async () => {
			newBody.username = undefined;
			const res = await request(app)
				.put('/v1/content/like')
				.set({ Authorization: `Bearer ${userOneAccessToken}` })
				.send(newBody)
				.expect(httpStatus.BAD_REQUEST);

			expect(res.body.message).toBe('"username" is required');
		});

		test('should return 400 with empty contentId', async () => {
			newBody.contentId = 'undefined';
			const res = await request(app)
				.put('/v1/content/like')
				.set({ Authorization: `Bearer ${userOneAccessToken}` })
				.send(newBody)
				.expect(httpStatus.BAD_REQUEST);
		});
	});
});

describe('Content GET routes', () => {
	describe('POST /v1/content/paginated?page=x&limit=y', () => {
		beforeEach(async () => {
			await insertUsers([userOne]);
			for (let index = 0; index < 10; index++) {
				await request(app)
					.post('/v1/content/create')
					.set({ Authorization: `Bearer ${userOneAccessToken}` })
					.send({
						username: faker.name.findName().toLocaleLowerCase(),
						post: `post ${index + 1}`,
					});
			}
		});
		test('should return 200 and successfully get page 1 and 5 content', async () => {
			const res = await request(app)
				.get('/v1/content/paginated?page=1&limit=5')
				.expect(httpStatus.OK);

			expect(res.body[0].post).toBe('post 10');
			expect(res.body[4].post).toBe('post 6');
			expect(res.body.length).toBe(5);
		});

		test('should return 200 and successfully gets all contents without page and limit', async () => {
			const res = await request(app)
				.get('/v1/content/paginated')
				.expect(httpStatus.OK);

			expect(res.body.length).toBe(10);
		});

		test('should return 200 and successfully gets page 2 contents', async () => {
			const res = await request(app)
				.get('/v1/content/paginated?page=2&limit=5')
				.expect(httpStatus.OK);

			expect(res.body[0].post).toBe('post 5');
			expect(res.body[4].post).toBe('post 1');
		});
	});
});
