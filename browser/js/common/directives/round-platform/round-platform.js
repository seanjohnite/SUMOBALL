/* global THREE Physijs */

app.directive('roundPlatform', function (Material) {

    return {
        restrict: 'E',
        link: function (scope, element, attrs) {
            console.log("adding round platform")
            var discRad = Number(attrs.width);
            var planeGeo = new THREE.CylinderGeometry(discRad, discRad, 5, 32);
            var round = new Physijs.CylinderMesh(
                planeGeo,
                Material(0xffffff, 0.8, 0.3),
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
                var lst = scope.threeObj.lastEdge;
                round.position.set(lst.x, lst.y, lst.z - discRad * 2);
                scope.threeObj.lastEdge = round.position;
            }

            scope.threeObj.platforms.push(round);

            scope.threeObj.scene.add(round);


        }

    };

});
