app.config(function ($stateProvider) {
    $stateProvider.state('adventure', {
        url: '/adventure',
        templateUrl: '/js/adventure/adventure.html',
        controller: function ($scope, Images, Socket, $rootScope) {
            $scope.renderer;
            $scope.scene;
            $scope.lastEdge = new THREE.Vector3(-3,0,0);
            $scope.config = {
                ortho: true,
                perspective: false,
                watch: true
            };

            $scope.platforms = [];

            $scope.camera;

            $scope.ball;

            var render = function () {
                var keepOne;
                if ($scope.ball) applyAccel($scope.ball);
                if ($scope.config.watch) watchIt($scope.ball);
                $scope.scene.simulate();
                $scope.renderer.render($scope.scene, $scope.camera);
                requestAnimationFrame(render);
            };

            $scope.init = function () {
                requestAnimationFrame(render);
            }

            var applyAccel = function (ball, accel) {
                if (ball && ball.position.y < 1) // check for contact/low enough
                    ball.applyImpulse(accel, {}) //ball._physijs.radius
            }

                // if (keepOne && keepLooking) {
                //     if (perspectiveOrOrtho === "perspective") {
                //         camera.position.set(0 + keepOne.ball.position.x, 60 + keepOne.ball.position.y, 120 + keepOne.ball.position.z);
                //         // camera.lookAt(keepOne.ball.position); (same cam position keep looking)
                //     } else {
                //         // ortho keep looking
                //         camera.position.set(0 + keepOne.ball.position.x, 30 + keepOne.ball.position.y, 40 + keepOne.ball.position.z);
                //     }

                // }
                // _.forEach(balls, function (ball) {
                //     if (ball.ball && ball.ball.position.y < 0) {
                //         ball.ball.applyImpulse(ball.accel, {x: 0, y: 3, z:0});
                //     }
                //     keepOne = ball;
                //     if (ball.jump && ball.ball.position.y < 0) {
                //         ball.ball.applyCentralImpulse({x:0, y: ball.jump * 300, z: 0});
                //         ball.jump--;
                //     }
                // });


        }
    });
});


