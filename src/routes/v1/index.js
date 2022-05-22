const express = require('express');
const templateRoute = require('./template.route');
const authRoute = require('./auth.route');

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
];

defaultRoutes.forEach((route) => {
	router.use(route.path, route.route);
});

module.exports = router;
