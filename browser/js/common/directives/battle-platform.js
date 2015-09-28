/* global THREE Physijs */

app.directive('battlePlatform', function (Material, Box) {

    return {
        restrict: 'E',
        link: function (scope, element, attrs) {
            var color = scope.threeObj.colors[Math.floor(Math.random() * scope.threeObj.colors.length)]
            console.log(`adding battle platform type ${attrs.type}`);
            var platform;
            var big = Number(attrs.width);
            if (attrs.type === "round") {
                var planeGeo = new THREE.CylinderGeometry(big, big, 5, 32);
                platform = new Physijs.CylinderMesh(
                    planeGeo,
                    Material(color, .9, .01),
                    0
                )
            } else if (attrs.type === "square") {
                platform = Box(big * 2, 5, big * 2, Material(color, 0.9, 0.01), 0)
            } else if (attrs.type === "cone") {
                var cyl = new THREE.CylinderGeometry(0, big, 5, 32);
                platform = new Physijs.ConeMesh(
                    cyl,
                    Material(color, .9, .01),
                    0
                )
            }
            platform.receiveShadow = true;
            platform.position.set(0, -5, 0);

            scope.threeObj.platforms.push(platform);

            scope.threeObj.scene.add(platform);


        }

    };

});
