'use strict';
var socketio = require('socket.io');
var io = null;

module.exports = function (server) {

    if (io) return io;

    io = socketio(server);

    io.on('connection', function (socket) {
        console.log('connected to', socket.id);
        socket.on('changeOrientation', function (e) {
            // console.log(e)
        })
    });

    return io;

};
