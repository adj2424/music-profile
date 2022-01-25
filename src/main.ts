import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

/**
 * Set up
 */
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
  antialias: true
});

//all child objects where it will be animated through tick method
let updatables: any = [];

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(windowSize.width, windowSize.height);
camera.position.setZ(5);
renderer.render(scene, camera);

/**
 * Background
 */
const background = new THREE.TextureLoader().load('/background.jpg');
scene.background = background;

//add background stars
function genStars(num: number) {
  for (let i = 0; i < num; i++){
    const geometryStar = new THREE.TorusKnotGeometry(1, .1, 30, 10);
    const materialStar = new THREE.MeshBasicMaterial({
      wireframe: true,
      color: 0x0000ff
    });
    const star = new THREE.Mesh(geometryStar, materialStar);
    const x = (Math.random() * (100 + 100)) - 100;
    const y = -(Math.random() * (100 + 100));
    const z = (Math.random() * (100 + 100)) - 100;
    updatables.push(star);
    star.position.set(x, y, z);
    star.tick = (delta: number) => {
      star.rotation.x += 1 * delta;
    };
    scene.add(star);
  }
}
genStars(100);

/**
 * Light Source
 */
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight);

/**
 * Torus
 */
const geometry = new THREE.TorusGeometry(1, .5, 16, 100);
const material = new THREE.MeshToonMaterial({
  color: 0xff0000,
  wireframe: true
});
const torus0 = new THREE.Mesh(geometry, material);
torus0.position.set(0, -5, 0);
updatables.push(torus0);
scene.add(torus0);
torus0.tick = (delta: number) => {
  torus0.rotation.x += 1 * delta;
  torus0.rotation.y += 0.4 * delta;
  torus0.rotation.z += 2 * delta;
};

/**
 * pfp cube
 */
const geometryCube = new THREE.BoxGeometry(10, 10, 10);
const pfpTexture = new THREE.TextureLoader().load('/pfp.jpg');
const geometryMesh = new THREE.MeshBasicMaterial({
  map: pfpTexture
});
const pfpCube = new THREE.Mesh(geometryCube, geometryMesh);
pfpCube.position.x = 10;
pfpCube.position.y = 10;
//scene.add(pfpCube); 

/**
 * helpers
 */
const gridHelper = new THREE.GridHelper(500);
//const controls = new OrbitControls(camera, renderer.domElement);
scene.add(gridHelper);

/**
 * scroll animation
 */
let scrollY = window.scrollY;
window.addEventListener('scroll', () => {
  scrollY = window.scrollY;
});

/**
 * cursor parallax
 */
const cursor = {
  x: 0,
  y: 0
};
window.addEventListener('mousemove', (event) => {
  cursor.x = event.clientX / window.innerWidth - 0.5; //range of -.5, 5
  cursor.y = event.clientY / window.innerHeight - 0.5; //range of -.5, 5
});

/**
 * resize window
 */
window.addEventListener('resize', () => {
  windowSize.width = window.innerWidth;
  windowSize.height = window.innerHeight;

  camera.aspect = windowSize.width / windowSize.height;
  camera.updateProjectionMatrix();

  renderer.setSize(windowSize.width, windowSize.height);
  renderer.setPixelRatio(window.devicePixelRatio);
  //renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});


/**
 * Animation
 */
const clock = new THREE.Clock;
function tick(delta: number) {
  for (const obj of updatables) {
    //calls child tick method
    obj.tick(delta);
  }
}
renderer.setAnimationLoop(() => {
  //delta for consistency
  const delta = clock.getDelta();
  tick(delta);
  //animate camera scroll
  const SCROLL_SENS = 8
  camera.position.y = -scrollY / windowSize.height * SCROLL_SENS;

  //animate cursor parallax
  const parallaxX = -cursor.x;
  const parallaxY = cursor.y;
  cameraGroup.position.x += (parallaxX - cameraGroup.position.x * delta * 30); //created camera group to get parallax and scroll working
  cameraGroup.position.y += (parallaxY - cameraGroup.position.y * delta * 30); //idk y it works xd
  renderer.render(scene, camera);
});

