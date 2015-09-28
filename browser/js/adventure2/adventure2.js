/* global THREE */

app.config(function ($stateProvider) {
    $stateProvider.state('adventure2', {
        url: '/adventure2',
        templateUrl: '/js/adventure2/adventure2.html',
        controller: function ($scope, Socket) {
            Socket.emit('newGameStarting');

            $scope.threeObj = {
                background: 0xdddddd,
                colors: [0x5F0F40, 0x9A031E, 0xFB8B24, 0xE36414, 0xFB8B24, 0x0F4C5C, 0x3E2B4D],
                renderer: null,
                scene: null,
                camera: null,
                lastEdge: new THREE.Vector3(0, 0, 30),
                firstView: new THREE.Vector3(0, 60, 120),
                platforms: [],
                config: {
                    ortho: false,
                    perspective: true,
                    watch: true
                },
                ball: null,
                lastLength: null
            }

            $scope.win = function () {
                $scope.header = true;
                $scope.$digest();
            }

            $scope.addRenderer = function (renderer) {
                document.getElementById('adventure').appendChild(renderer.domElement);
            }

            var jumpBall = function (ball) {
                // if a jump is registered and ball is touching something (ground or wall or other ball)
                if (ball.ball._physijs.touches.length) {
                    ball.ball.applyCentralImpulse({x:0, y: ball.jump * 600, z: 0});
                }
                ball.jump--;
            }


            var applyTAndJump = function (ball, accel) {
                ball.ball.applyTorque(accel);
                if (ball.jump) jumpBall(ball);
            }

            var watchIt = function (ball, camera) {
                var fV = $scope.threeObj.firstView;
                camera.position.set(fV.x + ball.position.x, fV.y + ball.position.y, fV.z + ball.position.z);
            }

            var render = function () {
                if ($scope.threeObj.ball && $scope.threeObj.accel) applyTAndJump($scope.threeObj.ball, $scope.threeObj.accel);
                if ($scope.threeObj.ball &&
                    $scope.threeObj.config.watch) {
                    watchIt($scope.threeObj.ball.ball, $scope.threeObj.camera);
                }
                $scope.threeObj.scene.simulate();
                $scope.threeObj.renderer.render($scope.threeObj.scene, $scope.threeObj.camera);
                requestAnimationFrame(render);
            };

            $scope.init = function () { // called in scene end
                $scope.threeObj.camera.lookAt($scope.threeObj.scene.position);
                requestAnimationFrame(render);
            }

        }
    });
});


