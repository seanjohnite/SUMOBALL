/* global THREE THREEx Physijs */

app.directive('scene', function () {

    return {
        restrict: 'E',
        link: function (scope) {
            var wWidth = window.innerWidth;
            var wHeight = window.innerHeight;
            scope.threeObj.renderer = new THREE.WebGLRenderer({ antialias: true });
            scope.threeObj.renderer.setClearColor(scope.threeObj.background);
            scope.threeObj.renderer.shadowMap.enabled = true;
            scope.threeObj.renderer.shadowMapSoft = true;
            scope.threeObj.renderer.shadowCameraNear = 3;
            scope.threeObj.renderer.shadowCameraFov = 50;

            scope.threeObj.renderer.shadowMapBias = 0.0039;
            scope.threeObj.renderer.shadowMapDarkness = 1;
            scope.threeObj.renderer.shadowMapWidth = 1024;
            scope.threeObj.renderer.shadowMapHeight = 1024;
            scope.threeObj.renderer.setSize(wWidth, wHeight);
            scope.addRenderer(scope.threeObj.renderer);

            scope.threeObj.scene = new Physijs.Scene;
            scope.threeObj.scene.setGravity(new THREE.Vector3( 0, -50, 0 ));


            var fV = scope.threeObj.firstView;

            if (scope.threeObj.config.ortho) {
                console.log('running ortho')
                var aspectRatio = wWidth / wHeight;
                var height = 100;
                var width = aspectRatio * height;
                scope.threeObj.camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 1, 1000 );
                scope.threeObj.camera.position.set(fV.x, fV.y, fV.z);
            } else if (scope.threeObj.config.perspective) {
                console.log('running perspective')
                scope.threeObj.camera = new THREE.PerspectiveCamera(35, wWidth / wHeight, 1, 1000);
                scope.threeObj.camera.position.set(fV.x, fV.y, fV.z);
            }
            scope.threeObj.camera.lookAt(scope.threeObj.scene.position);

            scope.threeObj.scene.add(scope.threeObj.camera);
            scope.threeObj.renderer.shadowCameraFar = scope.threeObj.camera.far;
            THREEx.WindowResize(scope.threeObj.renderer, scope.threeObj.camera);

            // var pointlight = new THREE.PointLight(0xffffff, 1, 0);
            // scope.threeObj.scene.add(pointlight);



            var spotLight2 = new THREE.SpotLight( 0xffffff );
            spotLight2.position.set( 800, 800, 800 );

            spotLight2.castShadow = true;

            spotLight2.shadowMapWidth = 2056;
            spotLight2.shadowMapHeight = 2056;

            spotLight2.shadowCameraNear = 500;
            spotLight2.shadowCameraFar = 4000;
            spotLight2.shadowCameraFov = 30;

            scope.threeObj.scene.add( spotLight2 );

        }

    };

});
