const io = require('socket.io')();

io.on('connection', (socket) => {
	console.log(`${socket.id} connected`);
});

module.exports = { io };
