const cors = require('cors');
const xss = require('xss-clean');
const helmet = require('helmet');
const express = require('express');
const volleyball = require('volleyball');
const httpStatus = require('http-status');
const compression = require('compression');

const config = require('./config');
const routes = require('./routes/v1');
const ApiError = require('./utils/apiError');
const { authLimiter } = require('./middlewares/rateLimiter');
const { errorHandler } = require('./middlewares/error');

const app = express();

// set security HTTP headers
app.use(helmet());

//http logger
app.use(volleyball);

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options('*', cors());

//limit repeated failed requests to auth endpoints
if (config.env === 'production') {
	app.use('/v1/auth', authLimiter);
}

// v1 api routes
app.use('/v1', routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
	next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// handle error
app.use(errorHandler);

module.exports = app;
