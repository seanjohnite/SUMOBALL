app.config(function ($stateProvider) {
    $stateProvider.state('adventure', {
        url: '/adventure',
        templateUrl: '/js/adventure/adventure.html',
        controller: function ($scope, Images, Socket, Three, $interval, $rootScope) {
            $scope.renderer;
            $scope.scene;
            $scope.lastEdge = ;

            $scope.init = function () {

            }
        }
    });
});


