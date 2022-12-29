/* eslint-disable @typescript-eslint/no-non-null-assertion */
import './style.css';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

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
    const y = -(Math.random() * 15) - 12;
    const z = -Math.random() * 7 - 5;
    particle.position.set(x, y, z);
    scene.add(particle);
  }
}
genParticles(80);

/**
 * Light Source
 */
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight);

/**
 * Header Title
 */
/**
 * Trumpet
 */
const gltfLoader = new GLTFLoader();
let trumpet = new THREE.Group();
gltfLoader.load('/trumpet/scene.gltf', gltf => {
  trumpet = gltf.scene;
  scene.add(trumpet);
  trumpet.position.set(-8, 16, -23);
  trumpet.rotateX(-0.2);
  trumpet.rotation.y = -(3 * Math.PI) / 4 + 0.3;
});
//const trumpetURL = new URL('../public/trumpet.glb', import.meta.url);

/**
 * Text
 */
const fontLoader = new FontLoader();
let nameText = new THREE.Mesh();
const createTitleText = async () => {
  const font = await fontLoader.loadAsync('/Hanken_Grotesk_Regular.json');
  const textGeometry = new TextGeometry('ALAN JIANG', {
    font: font,
    size: 11,
    height: 1
  });
  nameText = new THREE.Mesh(
    textGeometry,
    new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true
    })
  );
  nameText.rotateOnAxis(new THREE.Vector3(0, 1, 0), (7 * Math.PI) / 4 + 0.6);
  nameText.position.set(-50, -3, -33);
  nameText.rotateX(-0.15);
  nameText.rotateZ(0.09);
  scene.add(nameText);
};
createTitleText();

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
let cylinderGeometry = new THREE.CylinderGeometry(1, 1, 3, 10);
const material = new THREE.MeshBasicMaterial({
  color: 0x0000ff,
  wireframe: true
});
const cylinder = new THREE.Mesh(cylinderGeometry, material);
cylinder.position.set(0, -35, -14);

(cylinder as any).tick = (delta: number) => {
  //console.log(cylinderGeometry.attributes.position.count);
  //console.log(cylinderGeometry.vertices);
  cylinder.rotateOnAxis(new THREE.Vector3(0, 1, 0), delta * 0.5);
  //cylinder.rotation.y += delta * 0.5;
};
cylinder.rotation.x = -Math.PI / 8;
cylinder.rotation.z = -Math.PI / 10;
updatables.push(cylinder);
scene.add(cylinder);

const startGeometry = new THREE.TorusKnotGeometry(0.5, 0.1, 30, 10);
const starMaterial = new THREE.MeshBasicMaterial({
  wireframe: true,
  color: 0x0000ff
});

let r = 11;
let amount = 6;
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

// const twist = (geometry1: any) => {
//   const quaternion = new THREE.Quaternion();
//   const geometry = new THREE.CylinderGeometry(1, 1, 3, 10);
//   console.log(geometry.attributes.position.count);
//   for (let i = 0; i < geometry.attributes.position.count; i++) {
//     // a single vertex Y position
//     const yPos = geometry.attributes.position.getY(i);
//     const twistAmount = 10;
//     const upVec = new THREE.Vector3(0, 1, 0);
//     quaternion.setFromAxisAngle(upVec, (Math.PI / 180) * (yPos / twistAmount));
//     const twistVec = new THREE.Vector3(
//       geometry.attributes.position.getX(i),
//       geometry.attributes.position.getY(i),
//       geometry.attributes.position.getZ(i)
//     );
//     //geometry.attributes.position.array[i].applyQuaternion(quaternion);
//     //geometry.vertices[i].applyQuaternion(quaternion);
//     twistVec.applyQuaternion(quaternion);
//   }

//   // tells Three.js to re-render this mesh
//   geometry.attributes.position.needsUpdate = true;
// };

//const fontLoader = new FontLoader();
//let text = new THREE.Mesh();
const textGroup = new THREE.Group();
textGroup.position.set(0, 0, 0);
const createText = async (words: string[]) => {
  const font = await fontLoader.loadAsync('/Hanken_Grotesk_Regular.json');
  words.map((e, i) => {
    const textGeometry = new TextGeometry(e, {
      font: font,
      size: 2,
      height: 0.1
    });
    const text = new THREE.Mesh(
      textGeometry,
      new THREE.MeshBasicMaterial({
        color: 0xffffff
      })
    );
    //text.position.set(-10 + i, -35, -15);
    text.position.set(-1 + 30 * i, -16, -36);
    //scene.add(text);
    textGroup.add(text);
  });
  scene.add(textGroup);
};
createText([
  'Scheherazade',
  'Festive Overture',
  'Haydn Concerto',
  'Neruda Concerto',
  'Petrushka',
  'Yoru ni Kakeru',
  'O Magnum Mysterium'
]);

//updatables.push(textGroup);
(textGroup as any).tick = (delta: number) => {
  textGroup.rotation.x += 0.5 * delta;
};
textGroup.rotation.x = -Math.PI / 4;

/**
 * helpers
 */
const gridHelper = new THREE.GridHelper(500);
const controls = new OrbitControls(camera, renderer.domElement);
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

const changeTitleScript = {
  start: 0.01,
  end: 0.075,
  animationFun: () => {
    // animate camera scroll
    nameText.position.x = lerp(-50, 100, scalePercent(changeTitleScript.start, changeTitleScript.end));
    nameText.position.y = lerp(-3, 10, scalePercent(changeTitleScript.start, changeTitleScript.end));
    nameText.position.z = lerp(-33, 0, scalePercent(changeTitleScript.start, changeTitleScript.end));
    trumpet.rotation.y = lerp(
      -(3 * Math.PI) / 4 + 0.3,
      (3 * Math.PI) / 4 - 0.2,
      scalePercent(changeTitleScript.start, changeTitleScript.end)
    );
    trumpet.position.x = lerp(-8, 8, scalePercent(changeTitleScript.start, changeTitleScript.end));
    trumpet.position.z = lerp(-23, -30, scalePercent(changeTitleScript.start, changeTitleScript.end));

    //camera.position.y = lerp(0, -9, scalePercent(changeTitleScript.start, changeTitleScript.end));
  }
};
timeLineScripts.push(changeTitleScript);

const moveCameraScript = {
  start: 0.1,
  end: 0.2,
  animationFun: () => {
    camera.position.y = lerp(0, -12, scalePercent(moveCameraScript.start, moveCameraScript.end));
    camera.position.z = lerp(5, -8, scalePercent(moveCameraScript.start, moveCameraScript.end));
    camera.rotation.x = lerp(0, -Math.PI / 4, scalePercent(moveCameraScript.start, moveCameraScript.end));
  }
};
timeLineScripts.push(moveCameraScript);

const moveTextScript = {
  start: 0.25,
  end: 0.7,
  animationFun: () => {
    textGroup.position.x = lerp(0, -193.5, scalePercent(moveTextScript.start, moveTextScript.end));
  }
};
timeLineScripts.push(moveTextScript);

const changeBackgroundScript = {
  start: 0.2,
  end: 0.5,
  animationFun: () => {
    if (scrollPercent > 0.48) {
      gsap.to(scene.background, {
        duration: 2,
        r: 1,
        g: 0,
        b: 1
      });
    }
    //
    else if (scrollPercent > 0.35) {
      gsap.to(scene.background, {
        duration: 2,
        r: 0,
        g: 1,
        b: 1
      });
    }
    //
    else if (scrollPercent > 0.22) {
      gsap.to(scene.background, {
        duration: 2,
        r: 0,
        g: 1,
        b: 0
      });
    }
    //
    else {
      gsap.to(scene.background, {
        duration: 2,
        r: 239 / 255,
        g: 226 / 255,
        b: 186 / 255
      });
    }
  }
};
timeLineScripts.push(changeBackgroundScript);

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

//controls.update();
renderer.setAnimationLoop(() => {
  // delta for consistency
  const delta = clock.getDelta();
  tick(delta);
  //controls.update();
  // animate camera scroll
  //camera.position.y = (-currScrollY / windowSize.height) * SCROLL_SENS;

  // another way looks correct but harder - https://tympanus.net/codrops/2022/12/13/how-to-code-an-on-scroll-folding-3d-cardboard-box-animation-with-three-js-and-gsap/
  // scroll based animation timeline - https://sbcode.net/threejs/animate-on-scroll/
  playTimeLineAnimations();

  // animate cursor parallax - https://tympanus.net/codrops/2022/01/05/crafting-scroll-based-animations-in-three-js/
  const PARALLAX_SENSE = 100;
  const parallaxX = -cursor.x;
  const parallaxY = cursor.y;
  cameraGroup.position.x += parallaxX - cameraGroup.position.x * delta * PARALLAX_SENSE; // created camera group to get parallax and scroll working
  cameraGroup.position.y += parallaxY - cameraGroup.position.y * delta * PARALLAX_SENSE; // idk y it works xd
  renderer.render(scene, camera);
});
