/* global THREE Physijs */

app.factory('Box', function () {

    var Box = function (width, height, depth, material, gravity) {
        return new Physijs.BoxMesh(
            new THREE.BoxGeometry(width, height, depth),
            material,
            gravity
        )
    };

    return Box;
})
