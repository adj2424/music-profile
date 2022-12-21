/* eslint-disable @typescript-eslint/no-non-null-assertion */
import './style.css';
import * as THREE from 'three';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

/**
 * Set up
 */
const windowSize = {
  width: window.innerWidth,
  height: window.innerHeight
};
const scene = new THREE.Scene();

// camera group
const cameraGroup = new THREE.Group();
scene.add(cameraGroup);

const camera = new THREE.PerspectiveCamera(75, windowSize.width / windowSize.height, 0.1, 1000);
//cameraGroup.add(camera);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg')!,
  antialias: true
});

// all child objects where it will be animated through tick method
const updatables: any[] = [];

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(windowSize.width, windowSize.height);
camera.position.setZ(5);
renderer.render(scene, camera);

/**
 * Background
 */
// const background = new THREE.TextureLoader().load('/background.jpg');
// scene.background = background;
scene.background = new THREE.Color(0xefe2ba);

// add background stars
function genStars(num: number) {
  for (let i = 0; i < num; i++) {
    const starGeometry = new THREE.TorusKnotGeometry(1, 0.1, 30, 10);
    const starMaterial = new THREE.MeshBasicMaterial({
      wireframe: true,
      color: 0x0000ff
    });
    const star = new THREE.Mesh(starGeometry, starMaterial);
    const x = Math.random() * (100 + 100) - 100;
    const y = -(Math.random() * (100 + 100));
    const z = -Math.random() * 100 + 5;
    star.position.set(x, y, z);
    updatables.push(star);
    (star as any).tick = (delta: number) => {
      star.rotation.x += 1 * delta;
    };
    scene.add(star);
  }
}
//genStars(100);

// add particles
function genParticles(num: number) {
  for (let i = 0; i < num; i++) {
    const particleGeometry = new THREE.SphereGeometry(0.1, 8, 8);
    const particleMaterial = new THREE.MeshBasicMaterial({
      color: 0x000000,
      wireframe: true
    });
    const particle = new THREE.Mesh(particleGeometry, particleMaterial);
    const x = Math.random() * 120 - 60;
    const y = -(Math.random() * 10) - 20;
    const z = -Math.random() * 10 - 10;
    particle.position.set(x, y, z);
    scene.add(particle);
  }
}
genParticles(50);

/**
 * Light Source
 */
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight);

/**
 * Torus
 */
const torusGeometry = new THREE.TorusGeometry(1, 0.5, 16, 100);
const torusMaterial = new THREE.MeshToonMaterial({
  color: 0xff0000,
  wireframe: true
});
const torus0 = new THREE.Mesh(torusGeometry, torusMaterial);
torus0.position.set(3, 1, 0);
updatables.push(torus0);
scene.add(torus0);
(torus0 as any).tick = (delta: number) => {
  torus0.rotation.x += 1 * delta;
  torus0.rotation.y += 0.4 * delta;
  torus0.rotation.z += 2 * delta;
};

/**
 * TorusKnot
 */
const torusKnotGeometry = new THREE.TorusKnotGeometry(0.4, 0.05, 100, 20);
const torusKnotMesh = new THREE.MeshToonMaterial({
  color: 0x00000ff,
  wireframe: true
});
const torusKnot0 = new THREE.Mesh(torusKnotGeometry, torusKnotMesh);
const torusKnot1 = new THREE.Mesh(torusKnotGeometry, torusKnotMesh);
const torusKnot2 = new THREE.Mesh(torusKnotGeometry, torusKnotMesh);
const torusKnot3 = new THREE.Mesh(torusKnotGeometry, torusKnotMesh);
const torusKnot4 = new THREE.Mesh(torusKnotGeometry, torusKnotMesh);
torusKnot0.position.set(6, -2, 0);
torusKnot1.position.set(8, -2, 0);
torusKnot2.position.set(10, -2, 0);
torusKnot3.position.set(12, -2, 0);
torusKnot4.position.set(14, -2, 0);
const torusKnotGroup = new THREE.Group();
torusKnotGroup.position.x = 0;
torusKnotGroup.add(torusKnot0, torusKnot1, torusKnot2, torusKnot3, torusKnot4);
scene.add(torusKnotGroup);
updatables.push(torusKnotGroup);
(torusKnotGroup as any).tick = (delta: number) => {
  if (torusKnotGroup.position.x < -22) {
    torusKnotGroup.position.x = 4;
  }
  torusKnotGroup.position.x -= 2 * delta;
};

/**
 * rotating stuff
 */
const cylinderGeometry = new THREE.CylinderGeometry(1, 1, 3, 10);
const material = new THREE.MeshBasicMaterial({
  color: 0x0000ff,
  wireframe: true
});
const cylinder = new THREE.Mesh(cylinderGeometry, material);
cylinder.position.set(0, -20, -5);

(cylinder as any).tick = (delta: number) => {
  cylinder.rotateOnAxis(new THREE.Vector3(0, 1, 0), delta * 0.5);
  //cylinder.rotation.y += delta * 0.5;
};

cylinder.rotation.z = -Math.PI / 10;
updatables.push(cylinder);
scene.add(cylinder);

const startGeometry = new THREE.TorusKnotGeometry(0.5, 0.1, 30, 10);
const starMaterial = new THREE.MeshBasicMaterial({
  wireframe: true,
  color: 0x0000ff
});

let r = 11;
let amount = 5;
for (let i = 0; i < amount; i++) {
  let x = (i * 2 * r) / amount - r;
  const star = new THREE.Mesh(startGeometry, starMaterial);
  star.position.x = x;
  let y = Math.sqrt(Math.pow(r, 2) - Math.pow(x, 2));
  star.position.z = y;
  cylinder.add(star);
}

for (let i = 0; i < amount; i++) {
  let x = (i * 2 * r) / amount - r;
  const star = new THREE.Mesh(startGeometry, starMaterial);
  star.position.x = x;
  let y = -Math.sqrt(Math.pow(r, 2) - Math.pow(x, 2));
  star.position.z = y;
  cylinder.add(star);
}

const star = new THREE.Mesh(startGeometry, starMaterial);
const star2 = new THREE.Mesh(startGeometry, starMaterial);

//cylinder.add(star);
//cylinder.add(star2);

star.position.x = 4;
star2.position.z = 4;

/**
 * helpers
 */
const gridHelper = new THREE.GridHelper(500);
// const controls = new OrbitControls(camera, renderer.domElement);
scene.add(gridHelper);

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
  // renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * cursor parallax
 */
const cursor = {
  x: 0,
  y: 0
};
window.addEventListener('mousemove', event => {
  cursor.x = event.clientX / window.innerWidth - 0.5; // range of -.5, 5
  cursor.y = event.clientY / window.innerHeight - 0.5; // range of -.5, 5
});

/**
 * scroll animation
 */
let currScrollY = window.scrollY;
const maxY = document.documentElement.scrollHeight - document.documentElement.clientHeight;
let scrollPercent = 0.0;
window.addEventListener('scroll', () => {
  currScrollY = window.scrollY;
  scrollPercent = currScrollY / maxY;
  // console.log(scrollPercent);
  // scrollPercent = lerp(currScrollY, windowSize.height, 0.5);
});

/**
 * scroll animation timeline
 */
// linear interpolation function
function lerp(min: number, max: number, ratio: number): number {
  return (1 - ratio) * min + ratio * max;
}
// fit lerp to start and end at scroll percentages
function scalePercent(start: number, end: number): number {
  return (scrollPercent - start) / (end - start);
}

const timeLineScripts: {
  start: number;
  end: number;
  animationFun: () => void;
}[] = [];

const torusScript = {
  start: 0.0,
  end: 0.1,
  animationFun: () => {
    torus0.position.x = lerp(3, -10, scalePercent(torusScript.start, torusScript.end));
    torus0.position.y = lerp(1, -5, scalePercent(torusScript.start, torusScript.end));
  }
};
timeLineScripts.push(torusScript);

/*
const movePlaneScript = {
  start: 0.25,
  end: 0.35,
  animationFun: () => {
    darkPlane.position.x = lerp(0, -19, scalePercent(0.25, 0.35));
    // console.log([darkPlane.position.x, scrollPercent, lerp(0, -19, scalePercent(0.250, 0.35))])
    // darkPlane.position.x = -scrollPercent * 100 + 25;
  }
};
timeLineScripts.push(movePlaneScript);

const movePlanes = {
  start: 0.45,
  end: 0.6,
  animationFun: () => {
    lightPlane.position.x = lerp(2, 40, scalePercent(movePlanes.start, movePlanes.end));
    lightPlane.position.y = lerp(-23, -10, scalePercent(movePlanes.start, movePlanes.end));
    // camera.position.x = lerp(18, 0, scalePercent(movePlaneCameraScript.start,
    // movePlaneCameraScript.end, scrollPercent));
    darkPlane.position.x = lerp(-19, -30, scalePercent(movePlanes.start, movePlanes.end));
  }
};
timeLineScripts.push(movePlanes);
*/

function playTimeLineAnimations() {
  for (const script of timeLineScripts) {
    if (scrollPercent >= script.start && scrollPercent < script.end) {
      script.animationFun();
    }
  }
}

/**
 * animation
 */
const clock = new THREE.Clock();
function tick(delta: number) {
  for (const obj of updatables) {
    // calls child tick method
    (obj as any).tick(delta);
  }
}

const SCROLL_SENS = 8;
renderer.setAnimationLoop(() => {
  // delta for consistency
  const delta = clock.getDelta();
  tick(delta);

  // animate camera scroll
  camera.position.y = (-currScrollY / windowSize.height) * SCROLL_SENS;

  // scroll based animation timeline
  playTimeLineAnimations();

  // animate cursor parallax
  const parallaxX = -cursor.x;
  const parallaxY = cursor.y;
  cameraGroup.position.x += parallaxX - cameraGroup.position.x * delta * 30; // created camera group to get parallax and scroll working
  cameraGroup.position.y += parallaxY - cameraGroup.position.y * delta * 30; // idk y it works xd
  renderer.render(scene, camera);
});
