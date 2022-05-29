const httpStatus = require('http-status');

const { templateService } = require('../services');

const hello = async (req, res) => {
	const message = await templateService.getMessage();

	res.status(httpStatus.OK).send(message);
};

module.exports = {
	hello,
};
