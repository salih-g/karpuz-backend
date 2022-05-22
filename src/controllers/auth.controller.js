const httpStatus = require('http-status');

const { authService } = require('../services');

const register = async (req, res) => {
	const message = await authService.getMessage();

	res.status(httpStatus.OK).send(message);
};

module.exports = {
	register,
};
