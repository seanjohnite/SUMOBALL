app.directive('ballsLoader', function (Socket, Ball) {
    return {
        restrict: 'E',
        link: function (scope) {

            var makeBall = function (socketId, phone) {
                if (!phone) {
                    phone = {
                        name: "RandoPerson",
                        face: "/images/gabriel_lebec@2x.jpg"
                    }
                }
                var thisSphere = new Ball(phone);
                thisSphere.castShadow = true;
                thisSphere.socketId = socketId;
                thisSphere.start = new Date();
                thisSphere.timeIn = 0;
                console.log(thisSphere);
                return thisSphere;
            }

            Socket.on('newBallReady', function (socketId, phone) {
                console.log('received newBallReady event')
                var ball = makeBall(socketId, phone);
                scope.threeObj.balls[socketId] = ball;
                ball.ball.position.set(0, 20, 0);
                scope.threeObj.scene.add(ball.ball);
            });

            Socket.on('updateOrientation', function (socketId, newOrientation) {
                if (!scope.threeObj.balls[socketId]) {
                    return;
                }
                newOrientation.gamma = resolveGamma(scope.threeObj.balls[socketId], newOrientation.gamma);

                scope.threeObj.balls[socketId].accel = new THREE.Vector3(1600 * newOrientation.beta, 0, 1600 * -newOrientation.gamma);
            });

            Socket.on('jump', function (socketId) {
                if (!scope.threeObj.balls[socketId]) {
                    return;
                }
                var thisBall = scope.threeObj.balls[socketId];
                if (thisBall.jump) thisBall.jump--;
                else thisBall.jump = 10;
            });

            var resolveGamma = function (ball, gamma) {
                if (!ball.lastGamma) ball.lastGamma = gamma;
                if (!ball.flipped) ball.flipped = 0; // this will be -1, 0, or 1 depending on which way gamma flipped
                var thisGamma = gamma;

                if (gamma - ball.lastGamma > 170 || ball.flipped === 1) {
                    gamma -= 180;
                    if (ball.flipped !== 1) {
                        ball.flipped += 1;

                    }
                    if (ball.lastGamma - gamma > 170 || ball.flipped === -1) {
                        gamma += 180;
                        if (ball.flipped !== -1) {
                            ball.flipped -= 1;
                        }
                    }
                }

                if (ball.lastGamma - gamma > 170 || ball.flipped === -1) {
                    gamma += 180;
                    if (ball.flipped !== -1) {
                        ball.flipped -= 1;

                    }
                    if (ball.lastGamma + gamma > 350 || ball.flipped === 1) {
                        gamma -= 180;
                        if (ball.flipped !== 1) {
                            ball.flipped += 1;
                        }
                    }
                }

                ball.lastGamma = gamma;

                return gamma;
            };
        }
    }
})
