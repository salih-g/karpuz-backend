const request = require('supertest');
const { faker } = require('@faker-js/faker');

const setupTestDB = require('../utils/setupTestDB');

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
	});
	describe('POST /v1/auth/login', () => {
		let newUser;
		beforeEach(() => {
			newUser = {
				username: faker.name.findName().toLowerCase(),
				password: 'password1',
			};
		});
	});
});
