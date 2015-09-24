'use strict';
var socketio = require('socket.io');
var io = null;

module.exports = function (server) {

    if (io) return io;

    io = socketio(server);

    io.on('connection', function (socket) {
        console.log('emitting newConnection event')
        socket.broadcast.emit('newConnection', socket.id);

        console.log('connected to', socket.id);
        socket.on('changeOrientation', function (newOrientation) {
            socket.broadcast.emit('updateOrientation', socket.id, newOrientation);
        });
    });

    return io;

};
