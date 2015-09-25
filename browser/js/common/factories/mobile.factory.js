app.factory('Mobile', function (Socket, $modal) {

    var Mobile = {};

    if (window.DeviceOrientationEvent && window.mobilecheck()) {

        Mobile.isMobile = true;

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
        Mobile.isMobile = false;// not a mobile phone or no gyroscope support
    }

    return Mobile;
});
