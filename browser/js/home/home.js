/* global */

app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'js/home/home.html',
        controller: 'HomeCtrl'
    });
});

app.controller('HomeCtrl', function ($scope, Socket, Three, Mobile, $modal) {

    Socket.on('connect', function () {
        console.log('connected via socket!')
    });

    $scope.save = function (user) {
        Socket.emit('newUser', user);
    }

    // if (Mobile.isMobile) {
    //     var modalInstance = $modal.open({
    //         animation: false,
    //         templateUrl: '/js/common/modals/start.modal.html',
    //         size: 'sm'
    //     });

    //     modalInstance.result
    //     .then(function () {

    //     });
    // }


    if (window.mobilecheck()) {
        $scope.mobile = true;
    } else {
        $scope.mobile = false;
    }

});

