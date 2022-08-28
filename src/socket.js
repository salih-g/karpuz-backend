const io = require('socket.io')();

io.on('connection', (socket) => {
	console.log(`${socket.id} connected`);
	socket.on('creating_post', () => {
		console.log('fetch_all_posts');
		socket.broadcast.emit('fetch_all_posts');
	});
});

module.exports = { io };
