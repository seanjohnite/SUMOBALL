/* global THREE THREEx Physijs */

app.factory('Three', function (Socket, Box, Sphere, Material, Light, Ball, $rootScope) {

    var mobile = window.mobilecheck()

    var balls = {}

    var initScene, render, renderer, scene, camera, box, sphere;

    var width = window.innerWidth;
    var height = window.innerHeight;

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
        renderer.setSize(width, height);
        document.getElementById('game').appendChild(renderer.domElement);

        scene = new Physijs.Scene;
        scene.setGravity(new THREE.Vector3( 0, -50, 0 ))

        camera = new THREE.PerspectiveCamera(35, width / height, 1, 1000);

        camera.position.set(120, 60, 0);
        camera.lookAt(scene.position);
        scene.add(camera);
        renderer.shadowCameraFar = camera.far;

        THREEx.WindowResize(renderer, camera);

        // var material = Material(0x666666, 0.8, 0.3);

        // making and adding lights
        // var positions = [[0, 50, 20], [100, 200, 100]]

        // _.range(2)
        //     .map( () => Light(0xffffff, 1) )
        //     .map( (light, index) => {
        //         light.position.set(...positions[index])
        //         return light;
        //     })
        //     .forEach( light => scene.add(light));

        // var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
        // directionalLight.position.set(0,1,0);
        // directionalLight.castShadow = true;
        // scene.add(directionalLight);

        // var spotLight = new THREE.SpotLight( 0xffffff );
        // spotLight.position.set( 100, 1000, 100 );

        // spotLight.castShadow = true;

        // spotLight.shadowMapWidth = 2056;
        // spotLight.shadowMapHeight = 2056;

        // spotLight.shadowCameraNear = 500;
        // spotLight.shadowCameraFar = 4000;
        // spotLight.shadowCameraFov = 30;

        // scene.add( spotLight );

        var spotLight2 = new THREE.SpotLight( 0xffffff );
        spotLight2.position.set( 800, 800, 800 );

        spotLight2.castShadow = true;

        spotLight2.shadowMapWidth = 2056;
        spotLight2.shadowMapHeight = 2056;

        spotLight2.shadowCameraNear = 500;
        spotLight2.shadowCameraFar = 4000;
        spotLight2.shadowCameraFov = 30;

        scene.add( spotLight2 );


        box = Box(5, 5, 5, Material(0x71d913, 0.8, 0.6));
        box.castShadow = true;

        var planeGeo = new THREE.CylinderGeometry(40, 40, 10, 32);

        var plane = new Physijs.CylinderMesh(
            planeGeo,
            Material(0x666666, 0.8, 0.3),
            0
        )

        // var plane = Box(75, .1, 150, material, 0);
        plane.receiveShadow = true;


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

    var makeBall = function (socketId, phone) {
        if (!phone) {
            phone = {
                name: "RandoPerson",
                face: "gabe"
            }
        }
        var thisSphere = new Ball(phone);
        thisSphere.castShadow = true;
        balls[socketId] = thisSphere;
        thisSphere.socketId = socketId;
        $rootScope.$broadcast('newBall', thisSphere);
        scene.add(thisSphere.ball);
    }

    // a new challenger appears!!
    Socket.on('newBallReady', function (socketId, phone) {
        if (mobile) return;
        console.log('a new challenger appears!')
        makeBall(socketId, phone);
    });

    // a challenger's phone has moved!
    Socket.on('updateOrientation', function (socketId, newOrientation) {
        if (mobile) return;
        if (!balls[socketId]) {
            makeBall(socketId)
        }
        var thisBall = balls[socketId]

        thisBall.accel.x = 2 * newOrientation.beta;
        thisBall.accel.z = 2 * -newOrientation.gamma;
    });

    Socket.on('jump', function (socketId) {
        if (mobile) return;
        if (!balls[socketId]) {
            makeBall(socketId)
        }
        var thisBall = balls[socketId]

        thisBall.jump = true;
    });

    render = function () {
        _.forEach(balls, function (ball) {
            ball.ball.applyCentralImpulse(ball.accel);

            if (ball.jump && ball.ball.position.y < 0) {

                console.log('jumping! this is ball:', ball)
                ball.ball.applyCentralImpulse({x:0, y: 2000, z: 0});
                ball.jump = false;
            }
        });
        scene.simulate();
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    };

    if (!mobile){
        window.onload = initScene();
        balls = {};
    }

    return {}

})
