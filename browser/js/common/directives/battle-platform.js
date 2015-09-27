/* global THREE Physijs */

app.directive('battlePlatform', function (Material) {

    return {
        restrict: 'E',
        link: function (scope, element, attrs) {
            var color = scope.threeObj.colors[Math.floor(Math.random() * scope.threeObj.colors.length)]
            console.log(`adding battle platform type ${attrs.type}`);

            var discRad = Number(attrs.width);
            var planeGeo = new THREE.CylinderGeometry(discRad, discRad, 5, 32);
            var round = new Physijs.CylinderMesh(
                planeGeo,
                Material(color, .9, .01),
                0
            )
            round.receiveShadow = true;
            round.position.set(0, -5, 0);

            scope.threeObj.platforms.push(round);

            scope.threeObj.scene.add(round);


        }

    };

});
