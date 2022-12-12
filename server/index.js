const cors = require('cors');
const io = require('socket.io')((8000),{
    cors: { origin: '*',  } });
const users = {};

io.on('connection', socket =>{

    // If any new user joins, assign it socket id and broadcast this to other users connected!
    socket.on('new_user_joined', u_name =>{ 
        users[socket.id] = u_name;
        socket.broadcast.emit('user_joined', u_name);
    });

    // If someone sends a message, broadcast it to other people
    socket.on('msg_send', message =>{
        socket.broadcast.emit('msg_receive', {message: message, u_name: users[socket.id]})
    });

    // If someone leaves the chat, let others know 
    socket.on('disconnect', message =>{
        socket.broadcast.emit('user_left', users[socket.id]);
        delete users[socket.id];
    });

})