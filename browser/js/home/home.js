/* global THREE Physijs */

app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'js/home/home.html',
        controller: 'HomeCtrl'
    });
});

app.controller('HomeCtrl', function (Socket){
    Socket.on('connect', function () {
        console.log('connected via socket!')
    });

    var origAccel, accel = {
        x: 0,
        y: 0,
        z: 0
    };

    if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', function (e) {
            if (!origAccel) origAccel = {
                x: e.beta,
                z: e.gamma
            }
            accel.x = -(origAccel.x - e.beta);
            accel.z = (origAccel.z - e.gamma);
            var newPos = {
                alpha: e.alpha,
                beta: e.beta,
                gamma: e.gamma
            };
            Socket.emit('changeOrientation', newPos);
        });
    }
    // threejs things:

    Physijs.scripts.worker = '/physijs/physijs_worker.js';
    Physijs.scripts.ammo = '/ammojs/builds/ammo.js';

    var initScene, render, renderer, scene, camera, box1, sphere;

    console.log("window inner width", window.innerWidth);

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

        var material = Physijs.createMaterial(
            new THREE.MeshLambertMaterial({
                color: 0x888888,
                reflectivity: .7
            }),
            .8, // high friction
            .6  // low restitution
        );

        var lights = [];
        lights[0] = new THREE.PointLight( 0xffffff, 1, 0 );
        lights[1] = new THREE.PointLight( 0xffffff, 1, 0 );
        lights[2] = new THREE.PointLight( 0xffffff, 1, 0 );

        lights[0].position.set( 0, 50, 20 );
        lights[1].position.set( 100, 200, 100 );
        // lights[2].position.set( -100, -200, -100 );

        scene.add( lights[0] );
        scene.add( lights[1] );
        // scene.add( lights[2] );

        //Box
        box1 = new Physijs.BoxMesh(
            new THREE.CubeGeometry(5,5,5),
            material
        );

        sphere = new Physijs.SphereMesh(
            new THREE.SphereGeometry(3, 32, 32),
            material
        );

        var plane = new Physijs.BoxMesh(
            new THREE.BoxGeometry(50, .1, 50),
            material,
            0
        );


        // plane.rotation.x = Math.PI/2;

        plane.position.set(0, -10, 0);

        box1.position.set(0, 0, 0);
        sphere.position.set(0, 20, 0);

        box1.rotation.y = .6;
        box1.rotation.x = .3;

        scene.add(box1);
        scene.add(sphere);
        scene.add(plane);

        requestAnimationFrame(render);
    };

    render = function () {
        console.log(accel);
        sphere.applyImpulse(accel, {x: 0, y:0, z:0})
        scene.simulate();
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    };

    window.onload = initScene();


})
