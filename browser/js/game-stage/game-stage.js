app.config(function ($stateProvider) {
    $stateProvider.state('gameStage', {
        url: '/game-stage',
        templateUrl: '/js/game-stage/game-stage.html',
        controller: function ($scope, Images, Socket, Three, $interval) {
            $scope.balls = {};
            $scope.$on('newBall', function (e, ball) {
                $scope.balls[ball.socketId] = {
                    ball: ball.ball,
                    socketId: ball.socketId,
                    photo: Images[ball.face],
                    name: ball.name,
                    start: new Date(),
                    timeIn: 0
                };
                console.log($scope.balls);
                $scope.$digest();
            });
            $scope.currentTime = new Date();
            $interval(function () {
                $scope.currentTime = new Date();
                _.forEach($scope.balls, function (ball) {
                    ball.timeIn = $scope.currentTime - ball.start;
                    console.log(ball.ball.position.y, ball.socketId);
                    if (ball.ball.position.y < -5) {
                        delete $scope.balls[ball.socketId];
                    }
                    console.log($scope.balls);
                });
            }, 1000)
        }
    });
});


