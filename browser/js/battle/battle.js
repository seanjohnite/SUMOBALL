/* global THREE */

app.config(function ($stateProvider) {
    $stateProvider.state('battle', {
        url: '/battle',
        templateUrl: '/js/battle/battle.html',
        controller: function ($scope, Socket) {
            Socket.emit('newGameStarting');

            $scope.threeObj = {
                background: 0x666666,
                colors: [0x5F0F40, 0x9A031E, 0xFB8B24, 0xE36414, 0xFB8B24, 0x0F4C5C, 0x3E2B4D, 0x5438DC],
                renderer: null,
                scene: null,
                camera: null,
                lastEdge: new THREE.Vector3(0, 0, 0),
                firstView: new THREE.Vector3(0, 60, 120),
                platforms: [],
                config: {
                    ortho: false,
                    perspective: true,
                    watch: false
                },
                balls: {}
            }

            $scope.addRenderer = function (renderer) {
                document.getElementById('battle').appendChild(renderer.domElement);
            }

            var applyT = function (ball, accel) {
                ball.ball.applyTorque(ball.accel)
            }

            var watchIt = function (ball, camera) {
                var fV = $scope.threeObj.firstView;
                camera.position.set(fV.x + ball.position.x, fV.y + ball.position.y + 50, fV.z + ball.position.z);
            }

            var deleteBall = function (ball) {
                delete $scope.threeObj.balls[ball.socketId];
                $scope.threeObj.scene.remove(ball.ball);
            }

            var jumpBall = function (ball) {
                // if a jump is registered and ball is touching something (ground or wall or other ball)
                if (ball.ball._physijs.touches.length) {
                    ball.ball.applyCentralImpulse({x:0, y: ball.jump * 600, z: 0});
                }
                ball.jump--;
            }

            var applyAllTorqueJumpsRemove = function (balls) {
                _.forEach(balls, function (ball) {
                    if (ball.ball.position.y < -20) {
                        return deleteBall(ball);
                    }
                    applyT(ball);

                    if (ball.jump) jumpBall(ball);
                })
            }

            var render = function () {
                applyAllTorqueJumpsRemove($scope.threeObj.balls)
                if ($scope.threeObj.config.watch) watchIt($scope.threeObj.balls[0].ball, $scope.threeObj.camera);
                $scope.threeObj.scene.simulate();
                $scope.threeObj.renderer.render($scope.threeObj.scene, $scope.threeObj.camera);
                requestAnimationFrame(render);
            };

            $scope.init = function () { // called in scene end
                console.log($scope.threeObj);
                $scope.threeObj.camera.lookAt($scope.threeObj.scene.position);
                requestAnimationFrame(render);
            }

        }
    });
});


