const httpStatus = require('http-status');
const { User } = require('../models');

const createUser = async (userBody) => {
	return User.create(userBody);
};

const getUserByUsername = async (username) => {
	return User.findOne({ username });
};

module.exports = {
	createUser,
	getUserByUsername,
};
