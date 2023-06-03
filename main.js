import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module'
import { GUI } from 'dat.gui'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';  
// import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'

const scene = new THREE.Scene()

const light = new THREE.AmbientLight(0xffffff);
scene.add(light);

let light2 = new THREE.DirectionalLight(0xffffff, 1);
light2.position.set(100, 100, 100);
light2.target.position.set(0, 0, 0);
light2.castShadow = true;
light2.shadow.bias = -0.01;
light2.shadow.mapSize.width = 2048;
light2.shadow.mapSize.height = 2048;
light2.shadow.camera.near = 1.0;
light2.shadow.camera.far = 500;
light2.shadow.camera.left = 200;
light2.shadow.camera.right = -200;
light2.shadow.camera.top = 200;
light2.shadow.camera.bottom = -200;
scene.add(light2);

var camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.z = -10;
camera.position.y = 5;

const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

const geometry = new THREE.BoxGeometry()
const material = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    wireframe: true,
})

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}

const stats = new Stats()
document.body.appendChild(stats.dom)

const loader = new GLTFLoader();
var karetka;
loader.load('./assets/free_ambulance/scene.gltf', function (gltf) {
    karetka = gltf.scene;
    karetka.castShadow = true;
		scene.add(karetka);
		// gltf.animations; // Array<THREE.AnimationClip>
		// gltf.scene; // THREE.Group
		// gltf.scenes; // Array<THREE.Group>
		// gltf.cameras; // Array<THREE.Camera>
		// gltf.asset; // Object
	}
);

const plane = new THREE.Mesh(
new THREE.PlaneGeometry(500, 500, 10, 10),
new THREE.MeshStandardMaterial({
    color: '#484f51'
  }));
plane.castShadow = false;
plane.receiveShadow = true;
plane.rotation.x = -Math.PI / 2;
scene.add(plane);


const gui = new GUI()
const cameraFolder = gui.addFolder('Kamera (Persp)')
cameraFolder.add(camera.position, 'x', -20, 20)
cameraFolder.add(camera.position, 'y', -20, 20)
cameraFolder.add(camera.position, 'z', -20, 20)
// cameraFolder.open()

var cameraType = {
  perspective: function() {
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = -10;
    camera.position.y = 5;
    controls.object = camera;
    controls.update();
  },
  orthographic: function() {
    var width = window.innerWidth / 10;
    var height = window.innerHeight / 10;
    camera = new THREE.OrthographicCamera(-width, width, height, -height, 0.1, 1000);
    camera.position.z = -10;
    camera.position.y = 5;
    controls.object = camera;
    controls.update();
  }
};
const typeFolder = gui.addFolder('Typ')
typeFolder.add(cameraType, 'perspective').name('Perspective');
typeFolder.add(cameraType, 'orthographic').name('Orthographic');
typeFolder.open()

const lightFolder = gui.addFolder('Swiatlo')
var lightingEnabled = true;
lightFolder.add({ enableLighting: lightingEnabled }, 'enableLighting').onChange(function(value) {
  lightingEnabled = value;
  updateLighting();
}).name('Osw. Ambient');
lightFolder.open();

var lightingEnabled2 = true;
gui.add({ enableLighting: lightingEnabled }, 'enableLighting').onChange(function(value) {
  lightingEnabled2 = value;
  updateLighting2();
}).name('Osw. Kier');


window.addEventListener('keydown', (event) =>{
  switch(event.code) {
    case 'KeyW':
      karetka.position.z += 0.1;
      break;
    case 'KeyS':
      karetka.position.z -= 0.1;
      break;
    case 'KeyA':
      karetka.position.x += 0.1;
      break;
    case 'KeyD':
      karetka.position.x -= 0.1;
      break;
    case 'KeyQ':
      karetka.rotation.y += 0.1;
      break;
    case 'KeyE':
      karetka.rotation.y -= 0.1;
      break;
  };
});

function updateLighting() {
  if (lightingEnabled) {
    scene.add(light);
  } else {
    scene.remove(light);
  }
}

function updateLighting2() {
  if (lightingEnabled2) {
    scene.add(light2);
  } else {
    scene.remove(light2);
  }
}

function animate() {
    requestAnimationFrame(animate)
    // karetka.rotation.x += 0.01
    render()

    stats.update()
}

function render() {
    renderer.render(scene, camera)
}

animate()