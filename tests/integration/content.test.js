const request = require('supertest');
const httpStatus = require('http-status');
const { faker } = require('@faker-js/faker');

const app = require('../../src/app');
const setupTestDB = require('../utils/setupTestDB');

const { Content } = require('../../src/models');

setupTestDB();

describe('Content routes', () => {
	describe('POST /v1/content/create', () => {
		let newBody;
		beforeEach(() => {
			newBody = {
				post: 'test12',
				username: faker.name.findName().toLocaleLowerCase(),
			};
		});

		test('should return 201 and successfully create content with expected body', async () => {
			const res = await request(app)
				.post('/v1/content/create')
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
				.send(newBody)
				.expect(httpStatus.BAD_REQUEST);
		});

		test('should return 400 and doesnt create content without username field ', async () => {
			newBody.username = undefined;
			await request(app)
				.post('/v1/content/create')
				.send(newBody)
				.expect(httpStatus.BAD_REQUEST);
		});
	});

	describe('PUT /v1/content/like', () => {
		let newBody;
		const postBody = {
			post: 'test12',
			username: faker.name.findName().toLocaleLowerCase(),
		};

		beforeEach(async () => {
			const response = await request(app)
				.post('/v1/content/create')
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
				.send(newBody)
				.expect(httpStatus.BAD_REQUEST);

			expect(res.body.message).toBe('You need username for like/dislike');
		});

		test('should return 400 with empty contentId', async () => {
			newBody.contentId = 'undefined';
			const res = await request(app)
				.put('/v1/content/like')
				.send(newBody)
				.expect(httpStatus.BAD_REQUEST);
		});
	});

	describe('POST /v1/content/comments/create', () => {});
});

// {
// 	"comment": "deneme12",
// 	"contentId": "629373bdd155cf2e3ce18653",
// 	"username": "sudanmerinosu"
// }

// {
// 	"_id": "629373bdd155cf2e3ce18653",
// 	"post": "deneme12",
// 	"username": "sudanmerinosu",
// 	"comments": [
// 		{
// 			"_id": "629373c5d155cf2e3ce18655",
// 			"comment": "deneme12",
// 			"contentId": "629373bdd155cf2e3ce18653",
// 			"username": "sudanmerinosu",
// 			"createdAt": "2022-05-29T13:23:17.169Z",
// 			"updatedAt": "2022-05-29T13:23:17.169Z"
// 		}
// 	],
// 	"likes": [],
// 	"createdAt": "2022-05-29T13:23:09.318Z",
// 	"updatedAt": "2022-05-29T13:23:17.190Z"
// }
