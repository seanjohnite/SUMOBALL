/* global */

app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'js/home/home.html',
        controller: 'HomeCtrl'
    });
});

app.controller('HomeCtrl', function ($scope, Socket) {

    Socket.on('connect', function () {
        console.log('connected via socket!')
    });

    $scope.save = function (user) {
        Socket.emit('newUser', user);
    }

    $scope.limits = {
        phones: 0,
        platforms: 0,
        computers: 0
    }

    if (window.mobilecheck()) {
        $scope.mobile = true;
    } else {
        $scope.mobile = false;
    }

});

