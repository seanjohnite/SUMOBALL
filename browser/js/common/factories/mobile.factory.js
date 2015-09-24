app.factory('Mobile', function (Socket, $modal) {



    if (window.DeviceOrientationEvent && window.mobilecheck()) {
        // var count = 0;
        window.addEventListener('deviceorientation', function (e) {
            var newPos = {
                alpha: e.alpha,
                beta: e.beta,
                gamma: e.gamma
            };

            Socket.emit('changeOrientation', newPos);

        });
    } else {
        // not a mobile phone or no gyroscope support
    }
});
