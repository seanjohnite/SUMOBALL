/* global THREE Physijs */

app.factory('Material', function () {

    //usage: material = Material(hexColor, friction, restitution)

    var Material = function (hexColor, friction, restitution, imgFile) {
        var material;
        if (imgFile) {
            material = new THREE.MeshLambertMaterial({
                reflectivity: .5,
                map: new THREE.ImageUtils.loadTexture(imgFile)
            })
        } else {
            material = new THREE.MeshLambertMaterial({
                color: hexColor,
                reflectivity: .7,
            });
        }
        return Physijs.createMaterial(
            material,
            friction, // .8 is high friction
            restitution  // .3 is low restitution
        );
    };

    return Material;
})
