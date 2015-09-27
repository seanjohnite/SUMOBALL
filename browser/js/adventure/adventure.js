/* global THREE */

app.config(function ($stateProvider) {
    $stateProvider.state('adventure', {
        url: '/adventure',
        templateUrl: '/js/adventure/adventure.html',
        controller: function ($scope) {
            $scope.threeObj = {
                renderer: null,
                scene: null,
                camera: null,
                lastEdge: new THREE.Vector3(0, 0, 30),
                firstView: new THREE.Vector3(0, 60, 250),
                platforms: [],
                config: {
                    ortho: false,
                    perspective: true,
                    watch: true
                },
                ball: null
            }


            var applyT = function (ball, accel) {
                ball.applyTorque(accel)
            }

            var watchIt = function (ball, camera) {
                var fV = $scope.threeObj.firstView;
                camera.position.set(fV.x + ball.position.x, fV.y + ball.position.y + 50, fV.z + ball.position.z);
            }

            var render = function () {
                if ($scope.threeObj.ball && $scope.threeObj.accel) applyT($scope.threeObj.ball.ball, $scope.threeObj.accel);
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


