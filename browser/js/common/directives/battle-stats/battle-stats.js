app.directive('battleStats', function (Images, Socket, $interval, $rootScope) {
    return {
        restrict: 'E',
        templateUrl: '/js/common/directives/battle-stats/battle-stats.html',
        link: function (scope) {
            $interval(function () {
                var currentTime = new Date();
                _.forEach(scope.threeObj.balls, function (ball) {
                    ball.timeIn = currentTime - ball.start;
                });
            }, 1000)
        }
    };
});


