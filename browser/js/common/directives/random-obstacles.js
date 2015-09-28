
app.directive('randomObstacles', function (Material, Box, Sphere, Cone, Cylinder) {

    return {
        restrict: 'E',
        link: function (scope, element, attrs) {
            var number = Number(attrs.number);


            var getRandColor = function () {
                return scope.threeObj.colors[Math.floor(Math.random() * scope.threeObj.colors.length)];
            };

            var choices = {
                box: function () {
                    return Box(5, 5, 5, Material(getRandColor(), 0.5, 0.8));
                },
                sphere: function () {
                    return Sphere(3, Material(getRandColor(), 0.5, 0.8));
                },
                cone: function () {
                    return Cone(3, 4, Material(getRandColor(), 0.5, 0.8));
                },
                cylinder: function () {
                    return Cylinder(3, 4, Material(getRandColor(), 0.5, 0.8));
                }
            };

            var chooseRandomObject = function () {
                var keys = Object.keys(choices);
                var randomKey = keys[Math.floor(Math.random() * keys.length)]
                return choices[randomKey]();
            }

            var randNum = function (min, max) {
                return Math.floor(Math.random() * (max - min)) + min;
            }

            for (let i = 0; i < number; i++) {
                var object = chooseRandomObject();
                object.castShadow = true;
                object.position.set(randNum(0, 20), 20, randNum(0, 20))
                scope.threeObj.scene.add(object);
            }


        }

    };

});
