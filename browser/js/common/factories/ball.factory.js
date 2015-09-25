app.factory('Ball', function (Sphere, Material, Images) {

    function pickRandomProperty(obj) {
        var result;
        var count = 0;
        for (var prop in obj)
            if (Math.random() < 1/++count)
               result = prop;
        return result;
    }

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

        var person = pickRandomProperty(Images);

        var colors = [0x483d8b, 0xff8c00, 0xffd700, 0xb1fb17, 0x853d8b];

        this.color = colors[Math.floor(Math.random() * colors.length)];

        angular.extend(this, props);
        console.log(Images.gabe);

        this.ball = Sphere(3, Material(this.color, 0.9, 0.3, Images[person]));
        this.ball.castShadow = true;
    }

    return Ball;
})
