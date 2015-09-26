app.factory('Images', function ($http) {
    return {
        getAll: function () {
            return $http.get('/api/images')
            .then(function (response) {
                return response.data;
            });
        }
    }
})
