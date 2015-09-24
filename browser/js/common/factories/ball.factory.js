app.factory('Ball', function (Sphere, Material) {
    var Ball = function (props) {
        this.position = {
            x: 0,
            y: 0,
            z: 0
        };

        this.accel = {
            x: 0,
            y: 0,
            z: 0
        };

        this.color = 0xCC00FF;

        angular.extend(this, props);

        this.ball = Sphere(5, Material(this.color, 0.8, 0.6));
    }

    return Ball;
})
