/* global THREE Physijs */

app.factory('Material', function () {

    //usage: material = Material(hexColor, friction, restitution)

    var Material = function (hexColor, friction, restitution) {
        return Physijs.createMaterial(
            new THREE.MeshLambertMaterial({
                color: hexColor,
                reflectivity: .7
            }),
            friction, // .8 is high friction
            restitution  // .3 is low restitution
        );
    };

    return Material;
})
