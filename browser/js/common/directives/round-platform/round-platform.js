/* global THREE THREEx Physijs */

app.directive('round-platform', function (Material) {

    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/round-platform/round-platform.html',
        link: function (scope, element, attrs) {
            var planeGeo = new THREE.CylinderGeometry(attrs.width, attrs.width, 5, 32);
            var round = new Physijs.CylinderMesh(
                planeGeo,
                Material(0x666666, 0.8, 0.3),
                0
            )
            round.receiveShadow = true;
            if (attrs.absolute) {
                var position = attrs.absolute.split(",").map(function (chr) {
                    var n = Number(chr);
                    if (n.isNaN()) throw Error('NaN in position');
                    return n;
                });
                round.position.set(...position);
            } else {
                var newPos = scope.lastEdge + new THREE.Vector3(attrs.width / 2, 0 , 0);
                round.position = newPos;
            }

            scope.platforms.push(round);

            scope.scene.add(round);

        }

    };

});
