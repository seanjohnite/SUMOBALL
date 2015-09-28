/* global THREE THREEx Physijs */

app.factory('Three', function (Socket, Box, Sphere, Material, Light, Ball, $rootScope) {
    // config
    var perspectiveOrOrtho = "perspective";
    var keepLooking = false;

    // game is starting, close all prev sockets
    Socket.emit('newGameStarting');

    var mobile = window.mobilecheck()

    var balls = {}

    var initScene, render, renderer, scene, camera, box, ground, mesh;

    var wWidth = window.innerWidth;
    var wHeight = window.innerHeight;

    initScene = function () {
        renderer = new THREE.WebGLRenderer({ antialias: false });
        renderer.shadowMap.enabled = true;
        renderer.shadowMapSoft = true;
        renderer.shadowCameraNear = 3;
        renderer.shadowCameraFov = 50;

        renderer.shadowMapBias = 0.0039;
        renderer.shadowMapDarkness = 1;
        renderer.shadowMapWidth = 1024;
        renderer.shadowMapHeight = 1024;
        renderer.setSize(wWidth, wHeight);
        document.getElementById('game').appendChild(renderer.domElement);

        scene = new Physijs.Scene;
        scene.setGravity(new THREE.Vector3( 0, -80, 0 ))

        if (perspectiveOrOrtho === "ortho") {
            var aspectRatio = wWidth / wHeight;
            var height = 100;
            var width = aspectRatio * height;
            camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 1, 1000 );
            camera.position.set(0, 30, 40);
        }

        if (perspectiveOrOrtho === "perspective") {
            camera = new THREE.PerspectiveCamera(35, wWidth / wHeight, 1, 1000);
            camera.position.set(0, 60, 120);
        }

        camera.lookAt(scene.position);


        scene.add( camera );
        // scene.add(camera);
        renderer.shadowCameraFar = camera.far;

        THREEx.WindowResize(renderer, camera);



        var spotLight2 = new THREE.SpotLight( 0xffffff );
        spotLight2.position.set( 800, 800, 800 );

        spotLight2.castShadow = true;

        spotLight2.shadowMapWidth = 2056;
        spotLight2.shadowMapHeight = 2056;

        spotLight2.shadowCameraNear = 500;
        spotLight2.shadowCameraFar = 4000;
        spotLight2.shadowCameraFov = 30;

        scene.add( spotLight2 );


        box = Box(5, 5, 5, Material(0x71d913, 0.8, 0.8));
        box.castShadow = true;

        var planeGeo = new THREE.CylinderGeometry(40, 40, 3, 32);
        var ground_material = Physijs.createMaterial(
            new THREE.MeshLambertMaterial({ color: 0x888888 }),
            1, // high friction
            .1 // low restitution
        );
        ground = new Physijs.CylinderMesh(
            planeGeo,
            ground_material,
            0 // mass
        );

        // var plane = Box(75, .1, 150, material, 0);
        ground.receiveShadow = true;


        // plane.rotation.x = Math.PI/2;

        ground.position.set(0, -10, 0);
        scene.add(ground);

        box.position.set(-10, 0, 0);
        // box2.position.set(0, 0, 0);
        // box3.position.set(10, 0, 0);
        // sphere.position.set(0, 20, 0);

        box.rotation.y = .6;
        box.rotation.x = .3;

        scene.add(box);
        // scene.add(sphere);
        // scene.add(plane);

        requestAnimationFrame(render);
    };

    var makeBall = function (socketId, phone) {
        if (!phone) {
            phone = {
                name: "RandoPerson",
                face: "/images/gabriel_lebec@2x.jpg"
            }
        }
        var thisSphere = new Ball(phone);
        thisSphere.castShadow = true;
        balls[socketId] = thisSphere;
        thisSphere.socketId = socketId;
        console.log(thisSphere);
        $rootScope.$broadcast('newBall', thisSphere);
        scene.add(thisSphere.ball);
    }

    // a new challenger appears!!
    Socket.on('newBallReady', function (socketId, phone) {
        if (mobile) return;
        console.log('a new challenger appears!')
        makeBall(socketId, phone);
    });

    // good luck with this one, future Sean      (: |
    var resolveGamma = function (ball, gamma) {
        if (!ball.lastGamma) ball.lastGamma = gamma;
        if (!ball.flipped) ball.flipped = 0; // this will be -1, 0, or 1 depending on which way gamma flipped
        var thisGamma = gamma;

        if (gamma - ball.lastGamma > 170 || ball.flipped === 1) {
            gamma -= 180;
            if (ball.flipped !== 1) {
                ball.flipped += 1;

            }
            if (ball.lastGamma - gamma > 170 || ball.flipped === -1) {
                gamma += 180;
                if (ball.flipped !== -1) {
                    ball.flipped -= 1;
                }
            }
        }

        if (ball.lastGamma - gamma > 170 || ball.flipped === -1) {
            gamma += 180;
            if (ball.flipped !== -1) {
                ball.flipped -= 1;

            }
            if (ball.lastGamma + gamma > 350 || ball.flipped === 1) {
                gamma -= 180;
                if (ball.flipped !== 1) {
                    ball.flipped += 1;
                }
            }
        }

        ball.lastGamma = gamma;

        return gamma;
    };

    // a challenger's phone has moved!
    Socket.on('updateOrientation', function (socketId, newOrientation) {
        if (mobile) return;
        if (!balls[socketId]) {
            return;
        }
        var thisBall = balls[socketId]
        newOrientation.gamma = resolveGamma(thisBall, newOrientation.gamma);

        // console.log(thisBall.ball._physijs.linearVelocity.length());

        thisBall.accel = new THREE.Vector3(1600 * newOrientation.beta, 0, 1600 * -newOrientation.gamma);

    });

    Socket.on('jump', function (socketId) {
        if (mobile) return;
        if (!balls[socketId]) return;
        var thisBall = balls[socketId]
        thisBall.jump = true;
    });



    $rootScope.$on('removeBall', function (e, socketId) {
        delete balls[socketId];
    });


    render = function () {
        var keepOne;
        _.forEach(balls, function (ball) {
            var touchingGround = ball.ball._physijs.touches.length;
            if (ball.ball) {
                // ball.ball.applyImpulse(ball.accel, {x: 0, y: 3, z:0});
                ball.ball.applyTorque(ball.accel);

            }
            keepOne = ball;
            if (ball.jump && touchingGround) {
                ball.ball.applyCentralImpulse({x:0, y: ball.jump * 600, z: 0});
                ball.jump = false;
            }
            ball.jump = false;
        });
        scene.simulate();
        if (keepOne && keepLooking) {
            if (perspectiveOrOrtho === "perspective") {
                camera.position.set(0 + keepOne.ball.position.x, 60 + keepOne.ball.position.y, 120 + keepOne.ball.position.z);
                // camera.lookAt(keepOne.ball.position); (same cam position keep looking)
            } else {
                // ortho keep looking
                camera.position.set(0 + keepOne.ball.position.x, 30 + keepOne.ball.position.y, 40 + keepOne.ball.position.z);
            }

        }
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    };

    if (!mobile){
        window.onload = initScene();
        balls = {};
    }
    console.log(scene);

    return scene;

})
