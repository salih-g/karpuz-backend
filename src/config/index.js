require('dotenv').config();

module.exports = {
	env: process.env.NODE_ENV,
	port: process.env.PORT || 8081,
	mongoose: {
		url: process.env.MONGO_URL,
		options: {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		},
	},
	jwt: {
		secret: process.env.JWT_SECRET,
		accessExpirationMinutes: process.env.JWT_ACCESS_EXPIRATION_MINUTES,
	},
	tokenTypes: {
		ACCESS: 'access',
	},
};
