const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { faker } = require('@faker-js/faker');
const { User } = require('../../src/models/');

const password = 'password1';
const salt = bcrypt.genSaltSync(8);
const hashedPassword = bcrypt.hashSync(password, salt);

const userOne = {
	_id: mongoose.Types.ObjectId(),
	username: faker.name.findName().toLocaleLowerCase(),
	password,
	role: 'user',
};

const userTwo = {
	_id: mongoose.Types.ObjectId(),
	username: faker.name.findName().toLocaleLowerCase(),
	password,
	role: 'user',
};

const insertUsers = async (users) => {
	await User.insertMany(
		users.map((user) => ({ ...user, password: hashedPassword })),
	);
};

module.exports = {
	userOne,
	userTwo,
	insertUsers,
};
