app.config(function ($stateProvider) {
    $stateProvider.state('mobile', {
        url: '/mobile',
        templateUrl: '/js/mobile/mobile.html',
        controller: 'MobileCtrl'
    });
});

app.controller('MobileCtrl', function ($scope, Images, Socket, $state) {
    $scope.phone = {};
    $scope.images = Object.keys(Images);

    $scope.ready = function (phone) {
        Socket.emit('newChallenger', phone)

        if (window.DeviceOrientationEvent) {
            window.addEventListener('deviceorientation', function (e) {
                var newPos = {
                    alpha: e.alpha,
                    beta: e.beta,
                    gamma: e.gamma
                };
                Socket.emit('changeOrientation', newPos);
            });
        }
        if (window.DeviceMotionEvent) {

            var prev = 0;
            var thisOne = 0;

            window.addEventListener('devicemotion', function (e) {
                thisOne = e.acceleration.z;
                if (Math.abs(thisOne - prev) > 20) {
                    Socket.emit('changeMotion', `large motion detected! ${Math.abs(thisOne - prev)}`);
                }
                prev = thisOne;
            });
        }
        // $state.go('home');
    };

})
