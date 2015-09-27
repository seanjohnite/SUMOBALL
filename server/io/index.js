'use strict';
var socketio = require('socket.io');
var io = null;

module.exports = function (server) {

    if (io) return io;

    io = socketio(server);

    io.on('connection', function (socket) {

        socket.on('newGameStarting', function () {
            socket.broadcast.emit('closeYoSocket');
        })

        socket.on('phoneReadyAdventure', function (phone) {
            socket.broadcast.emit('readyAdventure', socket.id, phone);
        })

        socket.on('platformer', function () {
            socket.broadcast.emit('platformStart');
        })

        socket.on('newChallenger', function (phone) {
            socket.broadcast.emit('newBallReady', socket.id, phone);
        })

        console.log('connected to', socket.id);
        socket.on('changeOrientation', function (newOrientation) {
            socket.broadcast.emit('updateOrientation', socket.id, newOrientation);
        });

        socket.on('changeMotion', function (e) {
            socket.broadcast.emit('jump', socket.id);
        });

    });

    return io;

};
