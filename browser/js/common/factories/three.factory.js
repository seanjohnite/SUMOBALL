/* global THREE Physijs */

app.factory('Three', function (Socket, Box, Sphere, Material, Light, Ball) {
    var origAccel, accel = {
        x: 0,
        y: 0,
        z: 0
    };

    if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', function (e) {
            var newPos = {
                alpha: e.alpha,
                beta: e.beta,
                gamma: e.gamma
            };
            Socket.emit('changeOrientation', newPos);
        });
    }

    var balls = {}

    var initScene, render, renderer, scene, camera, box, sphere;

    var width = window.innerWidth;
    var height = window.innerHeight - 97;

    initScene = function () {
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(width, height);
        document.getElementById('home').appendChild(renderer.domElement);

        scene = new Physijs.Scene;
        scene.setGravity(0, -30, 0);

        camera = new THREE.PerspectiveCamera(35, width / height, 1, 1000);

        camera.position.set(100, 100, 0);
        camera.lookAt(scene.position);
        scene.add(camera);

        var material = Material(0x888888, 0.8, 0.6);

        // making and adding lights
        var positions = [[0, 50, 20], [100, 200, 100]]

        _.range(2)
            .map( () => Light(0xffffff, 1) )
            .map( (light, index) => {
                light.position.set(...positions[index])
                return light;
            })
            .forEach( light => scene.add(light));


        box = Box(5, 5, 5, material);

        // sphere = Sphere(3, material);

        var plane = Box(50, .1, 50, material, 0);


        // plane.rotation.x = Math.PI/2;

        plane.position.set(0, -10, 0);

        box.position.set(0, 0, 0);
        // sphere.position.set(0, 20, 0);

        box.rotation.y = .6;
        box.rotation.x = .3;

        scene.add(box);
        // scene.add(sphere);
        scene.add(plane);

        requestAnimationFrame(render);
    };

    // a new challenger appears!!
    Socket.on('newConnection', function (socketId) {
        console.log('a new challenger appears!')
        var thisSphere = new Ball();
        balls[socketId] = thisSphere;
        scene.add(thisSphere.ball);
    });

    // a challenger's phone has moved!
    Socket.on('updateOrientation', function (socketId, newOrientation) {
        console.log(newOrientation);
        var thisBall = balls[socketId];
        if (!thisBall.origAccel) thisBall.origAccel = {
                x: newOrientation.beta,
                z: newOrientation.gamma
            }
        thisBall.accel.x = -(origAccel.x - newOrientation.beta);
        thisBall.accel.z = (origAccel.z - newOrientation.gamma);
    });

    render = function () {
        _.forEach(balls, function (ball) {
            ball.ball.applyCentralImpulse(ball.accel)
        });
        scene.simulate();
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    };

    if (!window.mobilecheck()){
        window.onload = initScene();
    } else {

    }

    return {}

})
