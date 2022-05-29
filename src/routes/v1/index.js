const express = require('express');
const templateRoute = require('./template.route');
const authRoute = require('./auth.route');
const contentRoute = require('./content.route');

const router = express.Router();

const defaultRoutes = [
	{
		path: '/template',
		route: templateRoute,
	},
	{
		path: '/auth',
		route: authRoute,
	},
	{
		path: '/content',
		route: contentRoute,
	},
];

defaultRoutes.forEach((route) => {
	router.use(route.path, route.route);
});

module.exports = router;
