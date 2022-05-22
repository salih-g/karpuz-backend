const express = require('express');
const templateRoute = require('./template.route');

const router = express.Router();

const defaultRoutes = [
	{
		path: '/template',
		route: templateRoute,
	},
];

defaultRoutes.forEach((route) => {
	router.use(route.path, route.route);
});

module.exports = router;
