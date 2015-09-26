/* global THREE THREEx Physijs */

app.directive('scene', function () {

    return {
        restrict: 'E',
        link: function (scope) {
            var wWidth = window.innerWidth;
            var wHeight = window.innerHeight;
            scope.renderer = new THREE.WebGLRenderer({ antialias: false });
            scope.renderer.shadowMap.enabled = true;
            scope.renderer.shadowMapSoft = true;
            scope.renderer.shadowCameraNear = 3;
            scope.renderer.shadowCameraFov = 50;

            scope.renderer.shadowMapBias = 0.0039;
            scope.renderer.shadowMapDarkness = 1;
            scope.renderer.shadowMapWidth = 1024;
            scope.renderer.shadowMapHeight = 1024;
            scope.renderer.setSize(wWidth, wHeight);

            scope.scene = new Physijs.Scene;
            scope.scene.setGravity(new THREE.Vector3( 0, -50, 0 ));

            if (scope.config.ortho) {
                var aspectRatio = wWidth / wHeight;
                var height = 100;
                var width = aspectRatio * height;
                scope.camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 1, 1000 );
                scope.camera.position.set(0, 30, 40);
            } else if (scope.config.perspective) {
                scope.camera = new THREE.PerspectiveCamera(35, wWidth / wHeight, 1, 1000);
                scope.camera.position.set(0, 60, 120);
            }

            scope.scene.add(scope.camera);
            scope.renderer.shadowCameraFar = scope.camera.far;
            THREEx.WindowResize(scope.renderer, scope.camera);

            var spotLight2 = new THREE.SpotLight( 0xffffff );
            spotLight2.position.set( 800, 800, 800 );

            spotLight2.castShadow = true;

            spotLight2.shadowMapWidth = 2056;
            spotLight2.shadowMapHeight = 2056;

            spotLight2.shadowCameraNear = 500;
            spotLight2.shadowCameraFar = 4000;
            spotLight2.shadowCameraFov = 30;

            scope.scene.add( spotLight2 );


        }

    };

});
