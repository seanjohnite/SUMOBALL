/* global */

app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'js/home/home.html',
        controller: 'HomeCtrl'
    });
});

app.controller('HomeCtrl', function ($scope, Socket, Three, Mobile) {

    Socket.on('connect', function () {
        console.log('connected via socket!')
    });

    if (window.mobilecheck()) {
        $scope.mobile = true;
    } else {
        $scope.mobile = false;
    }

});

