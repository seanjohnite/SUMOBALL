/* global THREE Physijs */

app.factory('Cylinder', function () {

    var Cylinder = function (baseRad, height, material) {
        return new Physijs.CylinderMesh(
            new THREE.CylinderGeometry(baseRad, baseRad, height, 28),
            material
        )
    };

    return Cylinder;
})
