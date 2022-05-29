const { Content } = require('../models');

const createContent = async (contentBody) => {
	return Content.create(contentBody);
};

module.exports = {
	createContent,
};
