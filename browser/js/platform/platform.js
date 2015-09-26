app.config(function ($stateProvider) {
    $stateProvider.state('platform', {
        url: '/platform',
        templateUrl: '/js/platform/platform.html',
        controller: 'PlatformCtrl',
        resolve: {
            images: function (Images) {
                return Images.getAll();
            }
        }
    });
});

app.controller('PlatformCtrl', function ($scope, images, Socket, $state) {

    $scope.phone = {};

    Socket.on('closeYoSocket', function () {
        Socket.disconnect();
    });

    $scope.start = function () {
        Socket.emit('platformer');

        if (window.DeviceOrientationEvent) {
            window.addEventListener('deviceorientation', function (e) {
                var newPos = {
                    alpha: e.alpha,
                    beta: e.beta,
                    gamma: e.gamma
                };
                Socket.emit('platformMove', newPos);
            });
        }
        // $state.go('home');
    };

})
