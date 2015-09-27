app.factory('Ball', function (Sphere, Material, Images) {

    function pickRandomProperty(obj) {
        var result;
        var count = 0;
        for (var prop in obj)
            if (Math.random() < 1/++count)
               result = prop;
        return result;
    }

    var randos = 1;

    var Ball = function (phone) {
        if (!phone) {
            phone.name = `Rando Person ${randos}`;
            phone.face = pickRandomProperty(Images);
        }

        this.face = phone.face;

        this.name = phone.name;

        this.accel = {
            x: 0,
            y: 0,
            z: 0
        };

        this.ball = Sphere(4, Material(this.color, 1, 0.8, this.face));
        this.ball.castShadow = true;
    }

    return Ball;
})
