app.directive('ballLoader', function (Socket, Ball) {
    return {
        restrict: 'E',
        link: function (scope) {
            console.log('got to ball loader')

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
                console.log(thisSphere);
                return thisSphere;
            }

            Socket.on('readyAdventure', function (socketId, phone) {
                var ball = makeBall(socketId, phone);
                scope.threeObj.ball = ball;
                ball.ball.position.set(0, 20, 0);
                scope.threeObj.scene.add(ball.ball);
            });

            Socket.on('updateOrientation', function (socketId, newOrientation) {
                if (!scope.threeObj.ball) {
                    return;
                }
                newOrientation.gamma = resolveGamma(scope.threeObj.ball, newOrientation.gamma);

                scope.threeObj.accel = new THREE.Vector3(1000 * newOrientation.beta, 0, 1000 * -newOrientation.gamma);
            });

            Socket.on('jump', function () {
                console.log('heard a jump')
                if (!scope.threeObj.ball) {
                    return
                }
                var thisBall = scope.threeObj.ball;
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
