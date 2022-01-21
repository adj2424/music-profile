import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';




// setup
const windowSize = {
  width: window.innerWidth,
  height: window.innerHeight
};

const scene = new THREE.Scene();

//camera group
const cameraGroup = new THREE.Group();
scene.add(cameraGroup);

const camera = new THREE.PerspectiveCamera(75, windowSize.width / windowSize.height, 0.1, 1000);
cameraGroup.add(camera);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg')!,
});


renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(windowSize.width, windowSize.height);
camera.position.setZ(5);
renderer.render(scene, camera);

//add background
const background = new THREE.TextureLoader().load('/background.jpg');
scene.background = background;

//add background stars
function genStar() {
  const geometryStar = new THREE.TorusKnotGeometry(1, .1, 30, 10);
  const materialStar = new THREE.MeshBasicMaterial({
    wireframe: true,
    color: 0x0000ff
  });
  const star = new THREE.Mesh(geometryStar, materialStar);
  const x = (Math.random() * (100 + 100)) - 100;
  const y = -(Math.random() * (100 + 100));
  const z = (Math.random() * (100 + 100)) - 100;

  star.position.set(x, y, z);
  return star;


}
const starGroup = new THREE.Group();
for (let i = 0; i < 100; i++) {
  let star = genStar();
  starGroup.add(star);
}
scene.add(starGroup);

//add light source
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight);

const objDistance = 10.5;
const headerDistance = 11.5;

// torus
const geometry = new THREE.TorusGeometry(1, .5, 16, 100);
const material = new THREE.MeshToonMaterial({
  color: 0xff0000,
  wireframe: true
});
const torus0 = new THREE.Mesh(geometry, material);
const torus1 = new THREE.Mesh(geometry, material);
const torus2 = new THREE.Mesh(geometry, material);
const torus3 = new THREE.Mesh(geometry, material);
const torus4 = new THREE.Mesh(geometry, material);

//add object to scene
torus0.position.set(0, -(objDistance * 0 + headerDistance), 0);
torus1.position.set(0, -(objDistance * 1 + headerDistance), 0);
torus2.position.set(0, -(objDistance * 2 + headerDistance), 0);
torus3.position.set(0, -(objDistance * 3 + headerDistance), 0);
torus4.position.set(0, -(objDistance * 4 + headerDistance)+.2, 0);

const torusGroup = new THREE.Group();
torusGroup.add(torus0, torus1, torus2, torus3, torus4);
scene.add(torusGroup);

//pfp cube
const geometryCube = new THREE.BoxGeometry(10, 10, 10);
const pfpTexture = new THREE.TextureLoader().load('/pfp.jpg');
const geometryMesh = new THREE.MeshBasicMaterial({
  map: pfpTexture
});
const pfpCube = new THREE.Mesh(geometryCube, geometryMesh);
pfpCube.position.x = 10;
pfpCube.position.y = 10;
//scene.add(pfpCube); 


//helpers
const gridHelper = new THREE.GridHelper(500);
//const controls = new OrbitControls(camera, renderer.domElement);
scene.add(gridHelper);

//scroll animation
let scrollY = window.scrollY;
window.addEventListener("scroll", () => {
  scrollY = window.scrollY;
});

//cursor parallax
const cursor = {
  x: 0,
  y: 0
};
window.addEventListener("mousemove", (event) => {
  cursor.x = event.clientX / window.innerWidth - 0.5; //range of -.5, 5
  cursor.y = event.clientY / window.innerHeight - 0.5; //range of -.5, 5
  console.log(cursor);
});

//resize window 
window.addEventListener("resize", () => {
  windowSize.width = window.innerWidth;
  windowSize.height = window.innerHeight;

  camera.aspect = windowSize.width / windowSize.height;
  camera.updateProjectionMatrix();

  renderer.setSize(windowSize.width, windowSize.height);
  renderer.setPixelRatio(window.devicePixelRatio);
  //renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

//animate
const clock = new THREE.Clock();

const tick = () => {
  requestAnimationFrame(tick);
  const delta = clock.getDelta();

  //controls.update();

  //all background stars rotating
  for (const star of starGroup.children) {
    star.rotation.x += delta * 0.4; //use delta for consistent frame animation
    star.rotation.y += delta * 0.3; 
    star.rotation.z += delta * 1;
  }
  // animate torus 
  for (const torus of torusGroup.children) {
    torus.rotation.x += delta * 0.3;
    torus.rotation.y += delta * 0.1;
    torus.rotation.z += delta * 0.5;
  }

  //animate camera scroll
  camera.position.y = -scrollY / windowSize.height * 8;

  //animate cursor parallax
  const parallaxX = -cursor.x;
  const parallaxY = cursor.y;
  cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * delta * 30; //created camera group to get parallax and scroll working
  cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * delta * 10; //idk y it works xd

  renderer.render(scene, camera);
};
tick();
