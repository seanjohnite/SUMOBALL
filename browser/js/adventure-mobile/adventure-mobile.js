app.config(function ($stateProvider) {
    $stateProvider.state('adventure-mobile', {
        url: '/adventure-mobile',
        templateUrl: '/js/adventure-mobile/adventure-mobile.html',
        controller: 'AdvMobileCtrl',
        resolve: {
            images: function (Images) {
                return Images.getAll();
            }
        }
    });
});

app.controller('AdvMobileCtrl', function ($scope, images, Socket, $state, Upload, Images) {
    $scope.images = images;
    // upload later on form submit or something similar
    $scope.submit = function() {
      if ($scope.file && !$scope.file.$error) {
        $scope.upload($scope.file);
      }
    };

    // upload on file select or drop
    $scope.upload = function (file) {
        Upload.upload({
            url: 'api/images',
            fields: {'name': $scope.imageName},
            file: file
        }).progress(function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
        }).success(function (data, status, headers, config) {
            console.log('file ' + config.file.name + ' uploaded. Response: ' + data);
            Images.getAll().then(function (images) {
                $scope.images = images;
                $scope.phone.name = $scope.imageName;
                $scope.phone.face = data.route;
            });
        }).error(function (data, status, headers, config) {
            console.log('error status: ' + status);
        })
    };


    $scope.phone = {};

    Socket.on('closeYoSocket', function () {
        Socket.disconnect();
    });

    $scope.ready = function (phone) {
        console.log('ready', phone)

        Socket.emit('phoneReadyAdventure', phone)

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

});


