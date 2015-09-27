'use strict';
var socketio = require('socket.io');
var io = null;
var _ = require('lodash');

module.exports = function (server) {

    if (io) return io;

    io = socketio(server);

    var stages = [];

    io.on('connection', function (socket) {
        console.log('connected to', socket.id);

        socket.on('newGameStarting', function () {
            console.log('received newgame event')
            stages.push(socket.id);
            socket.broadcast.emit('closeYoSocket');
        });

        socket.on('disconnect', function () {
            if (_.includes(stages, socket.id)) {
                _.pull(stages, socket.id); // remove from stages if it's a stage
                // also send an event to disconnect all other clients
                socket.broadcast.emit('closeYoSocket');
            }
        });

        socket.on('phoneReadyAdventure', function (phone) {
            // only send phone events to stages
            _.forEach(stages, function (stageSocketId) {
                io.to(stageSocketId).emit('readyAdventure', socket.id, phone)
            });
            // socket.broadcast.emit('readyAdventure', socket.id, phone);
        })

        socket.on('platformer', function () {
            _.forEach(stages, function (stageSocketId) {
                io.to(stageSocketId).emit('platformStart')
            });
            // socket.broadcast.emit('platformStart');
        })

        socket.on('newChallenger', function (phone) {
            console.log('received newChallenger event')
            _.forEach(stages, function (stageSocketId) {
                io.to(stageSocketId).emit('newBallReady', socket.id, phone)
            });
            // socket.broadcast.emit('newBallReady', socket.id, phone);

        })

        socket.on('changeOrientation', function (newOrientation) {
            _.forEach(stages, function (stageSocketId) {
                io.to(stageSocketId).emit('updateOrientation', socket.id, newOrientation)
            });
            // socket.broadcast.emit('updateOrientation', socket.id, newOrientation);
        });

        socket.on('changeMotion', function () {
            _.forEach(stages, function (stageSocketId) {
                io.to(stageSocketId).emit('jump', socket.id);
            });
            // socket.broadcast.emit('jump', socket.id);
        });

    });

    return io;

};
