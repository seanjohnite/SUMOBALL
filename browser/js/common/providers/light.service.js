/* global THREE */

app.factory('Light', function () {

    //usage: light = Light(hexColor, intensity)

    var Light = function (hexColor, intensity) {
        return new THREE.PointLight(hexColor, intensity, 0);
    };

    return Light;
})
