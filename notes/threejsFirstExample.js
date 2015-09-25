var scene = new THREE.Scene();
// PerspectiveCamera(fieldOfView, aspectRatio, nearClippingPane, farClippingPane)
// aspectRatio should always be width/height
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer();
// this renders at full resolution at full height
// could use these values divided by 2 to increase performance
// also could pass false for updateStyle(last argument) setSize(window.innerWidth/2, window.innerHeight/2, false)
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// geometry contains all of the verticies and faces of the cube
var geometry = new THREE.BoxGeometry(1,1,1);
// many kinds of materials, take an object of properties to apply to material
// color only is simple
var material = new THREE.LineBasicMaterial({ color: 0x00ff00 });
// the Mesh applies a material to a geometry, which we can now add to our scene
var cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

function render() {
    cube.rotation.x += 0.1;
    // cube.rotation.y += 0.1;
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}
render();
