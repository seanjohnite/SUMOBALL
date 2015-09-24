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
        var colors = [0x483d8b, 0xff8c00, 0xffd700, 0xb1fb17, 0x853d8b];

        this.color = colors[Math.floor(Math.random() * colors.length)];
        angular.extend(this, props);

        this.ball = Sphere(3, Material(this.color, 0.8, 0.6));
    }

    return Ball;
})
