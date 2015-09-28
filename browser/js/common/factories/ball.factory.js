app.factory('Ball', function (Sphere, Material) {

    function pickRandomProperty(obj) {
        var result;
        var count = 0;
        for (var prop in obj)
            if (Math.random() < 1/++count)
               result = prop;
        return result;
    }


    var Ball = function (phone) {
        if (!phone) {
            phone = {};
            phone.name = 'Rando Person';
            console.log(phone)
            phone.face = '/images/joe_alves@2x.jpg';
        }


        this.face = phone.face;

        this.name = phone.name;

        this.accel = {
            x: 0,
            y: 0,
            z: 0
        };

        this.ball = Sphere(4, Material(this.color, 1, 0.9, this.face));
        this.ball.castShadow = true;
    }

    return Ball;
})
