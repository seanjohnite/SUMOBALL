/* global THREE Physijs */

app.directive('roundPlatform', function (Material) {

    return {
        restrict: 'E',
        link: function (scope, element, attrs) {
            var color = scope.threeObj.colors[Math.floor(Math.random() * scope.threeObj.colors.length)]
            var discRad = Number(attrs.width);
            if (attrs.hasOwnProperty('win')) {
                console.log('win detected');
                color = 0x61B329;
            }
            var planeGeo = new THREE.CylinderGeometry(discRad, discRad, 5, 32);
            var round = new Physijs.CylinderMesh(
                planeGeo,
                Material(color, 0.8, 0.3),
                0
            )
            round.receiveShadow = true;

            if (!scope.threeObj.lastLength) {
                console.log('adding first one')
                round.position.set(0, -10, 0);
                scope.threeObj.lastLength = discRad;
            } else {
                round.position.set(0, -10, -(scope.threeObj.lastLength + discRad));
                scope.threeObj.lastLength += discRad * 2;
            }

            scope.threeObj.platforms.push(round);

            if (attrs.hasOwnProperty('win')) {
                round.addEventListener('collision', function () {
                    console.log('win')
                    scope.win()
                });
            }

            scope.threeObj.scene.add(round);




        }

    };

});
