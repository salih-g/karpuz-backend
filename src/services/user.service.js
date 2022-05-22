const httpStatus = require('http-status');
const { User } = require('../models');

const createUser = async (userBody) => {
	try {
		return User.create(userBody);
	} catch (err) {}
};

module.exports = {
	createUser,
};
