const SocketIO = require('socket.io');

const usersOnline = {};

module.exports = server => {
  const io = SocketIO(server);

  io.on('connection', socket => {

    socket.on('chat:login', username => {
      usersOnline[username] = socket.id;
      socket.username = username;
    });

    socket.on('chat:message', data => {
      const { username: receiver } = data;
      const socketID = usersOnline[receiver];
      io.to(socketID).emit('chat:message', data);
    });

    socket.on('chat:typing', receiver => {
      const socketID = usersOnline[receiver];
      io.to(socketID).emit('chat:typing', socket.username);
    });

    socket.on('chat:stopTyping', receiver => {
      const socketID = usersOnline[receiver];
      io.to(socketID).emit('stop:typing');
    });

    socket.on('disconnect', () => {
      socket.broadcast.emit('chat:disconnect', socket.username);
    });
  }); 
};
