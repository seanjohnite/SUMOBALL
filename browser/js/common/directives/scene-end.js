app.directive('sceneEnd', function () {
    return {
        restrict: 'E',
        link: function (scope) {
            scope.init();
        }
    }
})
