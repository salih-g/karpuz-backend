const app = require('./app');
const config = require('./config');
const logger = require('./config/logger');
const prisma = require('./prisma');
const catchAsync = require('./utils/catchAsync');

let server;

server = app.listen(
	config.port,
	catchAsync(async () => {
		await prisma.$connect().then(() => {
			logger.info('Prisma connected.');
		});
		logger.info(`Listening to port ${config.port}`);
	}),
);

const exitHandler = catchAsync(async () => {
	if (server) {
		server.close(async () => {
			await prisma.$disconnect();
			logger.info('Server closed');
			process.exit(1);
		});
	} else {
		await prisma.$disconnect();
		process.exit(1);
	}
});

const unexpectedErrorHandler = (error) => {
	logger.error(error);
	exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
	logger.info('SIGTERM received');
	if (server) {
		server.close();
	}
});
