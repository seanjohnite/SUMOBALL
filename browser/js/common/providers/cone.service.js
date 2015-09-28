/* global THREE Physijs */

app.factory('Cone', function () {

    var Cone = function (baseRad, height, material) {
        return new Physijs.ConeMesh(
            new THREE.CylinderGeometry(0, baseRad, height, 28),
            material
        )
    };

    return Cone;
})
