require('dotenv').config();

module.exports = {
	env: process.env.NODE_ENV,
	port: process.env.PORT || 8081,
	jwt: {
		accessSecret: process.env.JWT_ACCESS_SECRET,
		refreshSecret: process.env.JWT_REFRESH_SECRET,
		accessExpirationTime: process.env.JWT_ACCESS_EXPIRATION_TIME || '5m',
		refreshExpirationTime: process.env.JWT_REFRESH_EXPIRATION_TIME || '30d',
	},
	tokenTypes: {
		ACCESS: 'access',
		REFRESH: 'refresh',
	},
};
