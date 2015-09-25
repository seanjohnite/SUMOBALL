/* global THREE Physijs */

app.factory('Sphere', function () {

    var Sphere = function (size, material) {
        return new Physijs.SphereMesh(
            new THREE.SphereGeometry(size, 32, 32),
            material
        )
    };

    return Sphere;
})
