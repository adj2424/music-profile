import './style.css';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/all';
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
//const background = new THREE.TextureLoader().load('/background.jpg');
//scene.background = background;
//scene.background = new THREE.Color(0xefe2ba);
scene.background = new THREE.Color(0x0000ff);

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
      color: 0x0000ff,
      wireframe: true
    });
    const particle = new THREE.Mesh(particleGeometry, particleMaterial);
    const x = Math.random() * 80 - 40;
    const y = -(Math.random() * 15) - 13.5;
    const z = -Math.random() * 7.5 - 5;
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
 * Init object positions
 */
const INIT = {
  CAMERA: { X_POS: 0, Y_POS: 0, Z_POS: 5, X_ROT: 0 },
  NAME_TEXT: { X_POS: -50, Y_POS: -3, Z_POS: -33, X_ROT: -0.15, Y_ROT: (7 * Math.PI) / 4 + 0.6, Z_ROT: 0.09 },
  TRUMPET: { X_POS: -8, Y_POS: 16, Z_POS: -23, X_ROT: -0.2, Y_ROT: -(3 * Math.PI) / 4 + 0.3, Z_ROT: 0, Z_SCALE: 1 },
  MUSICIAN_TEXT: { X_POS: -200, Y_POS: 25, Z_POS: -30, Z_ROT: -0.15, Y_SCALE: 1.5 },
  TEXT_GROUP: { X_POS: -8 }
};

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
  trumpet.position.set(INIT.TRUMPET.X_POS, INIT.TRUMPET.Y_POS, INIT.TRUMPET.Z_POS);
  trumpet.rotation.set(INIT.TRUMPET.X_ROT, INIT.TRUMPET.Y_ROT, INIT.TRUMPET.Z_ROT);
});
//const trumpetURL = new URL('../public/trumpet.glb', import.meta.url);

/**
 * Text
 */
const fontLoader = new FontLoader();
let nameText = new THREE.Mesh();
let musicianText = new THREE.Mesh();
const createTitleText = async () => {
  const font = await fontLoader.loadAsync('/Hanken_Grotesk_Regular.json');
  const nameTextGeometry = new TextGeometry('ALAN JIANG', {
    font: font,
    size: 11,
    height: 1
  });
  nameText = new THREE.Mesh(
    nameTextGeometry,
    new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true
    })
  );
  nameText.rotateOnAxis(new THREE.Vector3(0, 1, 0), (7 * Math.PI) / 4 + 0.6);
  nameText.position.set(INIT.NAME_TEXT.X_POS, INIT.NAME_TEXT.Y_POS, INIT.NAME_TEXT.Z_POS);
  nameText.rotateX(INIT.NAME_TEXT.X_ROT);
  nameText.rotateZ(INIT.NAME_TEXT.Z_ROT);
  scene.add(nameText);

  const musicianTextGeometry = new TextGeometry('MUSICIAN', {
    font: font,
    size: 22,
    height: 1
  });
  musicianText = new THREE.Mesh(
    musicianTextGeometry,
    new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true
    })
  );
  musicianText.position.set(INIT.MUSICIAN_TEXT.X_POS, INIT.MUSICIAN_TEXT.Y_POS, INIT.MUSICIAN_TEXT.Z_POS);
  musicianText.rotation.z = INIT.MUSICIAN_TEXT.Z_ROT;
  musicianText.scale.y = INIT.MUSICIAN_TEXT.Y_SCALE;
  scene.add(musicianText);
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

// twist deprecated - https://medium.com/@crazypixel/geometry-manipulation-in-three-js-twisting-c53782c38bb

//const fontLoader = new FontLoader();
//let text = new THREE.Mesh();
const textGroup = new THREE.Group();
textGroup.position.set(INIT.TEXT_GROUP.X_POS, 0, 0);
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
    text.position.set(-1 + 35 * i, -16, -36);
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
//const controls = new OrbitControls(camera, renderer.domElement);
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
 * current scroll percentage
 */
let currScrollY = window.scrollY;
const maxY = document.documentElement.scrollHeight - document.documentElement.clientHeight;
let scrollPercent = 0.0;
window.addEventListener('scroll', () => {
  //console.log(scrollPercent);
  currScrollY = window.scrollY;
  scrollPercent = currScrollY / maxY;
});

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

//animates objects with animations
const clock = new THREE.Clock();
function tick(delta: number) {
  for (const obj of updatables) {
    // calls child tick method
    (obj as any).tick(delta);
  }
}

let cameraParam = structuredClone(INIT.CAMERA);
let nameTextParam = structuredClone(INIT.NAME_TEXT);
let trumpetParam = structuredClone(INIT.TRUMPET);
let musicianTextParam = structuredClone(INIT.MUSICIAN_TEXT);
let textGroupParam = structuredClone(INIT.TEXT_GROUP);

//controls.update();
/**
 * animation
 */
const animate = () => {
  // delta for consistency
  const delta = clock.getDelta();
  tick(delta);
  camera.position.set(cameraParam.X_POS, cameraParam.Y_POS, cameraParam.Z_POS);
  camera.rotation.x = cameraParam.X_ROT;

  nameText.position.set(nameTextParam.X_POS, nameTextParam.Y_POS, nameTextParam.Z_POS);
  trumpet.rotation.set(trumpetParam.X_ROT, trumpetParam.Y_ROT, trumpetParam.Z_ROT);
  trumpet.position.set(trumpetParam.X_POS, trumpetParam.Y_POS, trumpetParam.Z_POS);
  trumpet.scale.set(1, 1, trumpetParam.Z_SCALE);
  musicianText.position.set(musicianTextParam.X_POS, musicianTextParam.Y_POS, musicianTextParam.Z_POS);

  textGroup.position.x = textGroupParam.X_POS;

  // scroll based animation timeline noob strat - https://sbcode.net/threejs/animate-on-scroll/
  // playTimeLineAnimations();
  // animate cursor parallax - https://tympanus.net/codrops/2022/01/05/crafting-scroll-based-animations-in-three-js/
  const PARALLAX_SENSE = 100;
  const parallaxX = -cursor.x;
  const parallaxY = cursor.y;
  cameraGroup.position.x += parallaxX - cameraGroup.position.x * delta * PARALLAX_SENSE; // created camera group to get parallax and scroll working
  cameraGroup.position.y += parallaxY - cameraGroup.position.y * delta * PARALLAX_SENSE; // idk y it works xd
  renderer.render(scene, camera);
};
renderer.setAnimationLoop(animate);

/**
 * scroll animation by current scroll position
 */
let scrollUp = true;
let lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;
let position = 0;
window.addEventListener('scroll', () => {
  let st = window.pageYOffset || document.documentElement.scrollTop;
  scrollUp = st > lastScrollTop ? false : true;
  lastScrollTop = st <= 0 ? 0 : st;

  /**
   * scroll down animations
   */
  if (position == 0 && !scrollUp && scrollPercent > 0.05) {
    position = 1;
    gsap.to(trumpetParam, {
      duration: 1,
      X_ROT: -0.3,
      Y_ROT: (3 * Math.PI) / 4 - 0.3,
      X_POS: 5,
      Y_POS: 14,
      Z_POS: -30,
      Z_SCALE: 0.8,
      ease: 'power2.out'
    });
    gsap.to(musicianTextParam, {
      duration: 1,
      X_POS: -72,
      Y_POS: 0,
      Z_POS: -40,
      ease: 'power2.out'
    });
    gsap.to(scene.background, {
      duration: 1,
      r: 0,
      g: 0,
      b: 0,
      ease: 'power2.out'
    });
  }
  //move camera to scheherazade
  if (position == 1 && !scrollUp && scrollPercent > 0.18) {
    position = 2;
    gsap.to(cameraParam, {
      duration: 2,
      Y_POS: -28,
      Z_POS: -7,
      X_ROT: -Math.PI / 4,
      ease: 'power2.out'
    });
  }
  //festive overture
  if (position == 2 && !scrollUp && scrollPercent > 0.26) {
    position = 3;
    gsap.to(textGroupParam, {
      duration: 1,
      X_POS: -44,
      ease: 'power2.out'
    });
  }
  //haydn
  if (position == 3 && !scrollUp && scrollPercent > 0.34) {
    position = 4;
    gsap.to(textGroupParam, {
      duration: 1,
      X_POS: -79,
      ease: 'power2.out'
    });
  }
  //neruda
  if (position == 4 && !scrollUp && scrollPercent > 0.42) {
    position = 5;
    gsap.to(textGroupParam, {
      duration: 1,
      X_POS: -114,
      ease: 'power2.out'
    });
  }
  //petrushka
  if (position == 5 && !scrollUp && scrollPercent > 0.5) {
    position = 6;
    gsap.to(textGroupParam, {
      duration: 1,
      X_POS: -145.5,
      ease: 'power2.out'
    });
  }

  if (position == 6 && !scrollUp && scrollPercent > 0.58) {
    position = 7;
    gsap.to(textGroupParam, {
      duration: 1,
      X_POS: -183,
      ease: 'power2.out'
    });
  }

  if (position == 7 && !scrollUp && scrollPercent > 0.66) {
    position = 8;
    gsap.to(textGroupParam, {
      duration: 1,
      X_POS: -223,
      ease: 'power2.out'
    });
  }

  /**
   * scroll up animations
   */
  if (position == 1 && scrollUp && scrollPercent < 0.05) {
    position = 0;
    gsap.to(trumpetParam, {
      duration: 1,
      X_POS: INIT.TRUMPET.X_POS,
      Y_POS: INIT.TRUMPET.Y_POS,
      Z_POS: INIT.TRUMPET.Z_POS,
      X_ROT: INIT.TRUMPET.X_ROT,
      Y_ROT: INIT.TRUMPET.Y_ROT,
      Z_ROT: INIT.TRUMPET.Z_ROT,
      Z_SCALE: INIT.TRUMPET.Z_SCALE,
      ease: 'power2.out'
    });
    gsap.to(musicianTextParam, {
      duration: 1,
      X_POS: INIT.MUSICIAN_TEXT.X_POS,
      Y_POS: INIT.MUSICIAN_TEXT.Y_POS,
      Z_POS: INIT.MUSICIAN_TEXT.Z_POS,
      ease: 'power2.out'
    });
    gsap.to(scene.background, {
      duration: 1,
      r: 239 / 255,
      g: 226 / 255,
      b: 186 / 255
    });
  }

  if (position == 2 && scrollUp && scrollPercent < 0.18) {
    position = 1;
    gsap.to(cameraParam, {
      duration: 2,
      Y_POS: INIT.CAMERA.Y_POS,
      Z_POS: INIT.CAMERA.Z_POS,
      X_ROT: INIT.CAMERA.X_ROT,
      ease: 'power2.out'
    });
  }
  if (position == 3 && scrollUp && scrollPercent < 0.26) {
    position = 2;
    gsap.to(textGroupParam, {
      duration: 1,
      X_POS: INIT.TEXT_GROUP.X_POS,
      ease: 'power2.out'
    });
  }
  if (position == 4 && scrollUp && scrollPercent < 0.34) {
    position = 3;
    gsap.to(textGroupParam, {
      duration: 1,
      X_POS: -44,
      ease: 'power2.out'
    });
  }
  if (position == 5 && scrollUp && scrollPercent < 0.42) {
    position = 4;
    gsap.to(textGroupParam, {
      duration: 1,
      X_POS: -79,
      ease: 'power2.out'
    });
  }
  if (position == 6 && scrollUp && scrollPercent < 0.5) {
    position = 5;
    gsap.to(textGroupParam, {
      duration: 1,
      X_POS: -114,
      ease: 'power2.out'
    });
  }
  if (position == 7 && scrollUp && scrollPercent < 0.58) {
    position = 6;
    gsap.to(textGroupParam, {
      duration: 1,
      X_POS: -145.5,
      ease: 'power2.out'
    });
  }
  if (position == 8 && scrollUp && scrollPercent < 0.62) {
    position = 7;
    gsap.to(textGroupParam, {
      duration: 1,
      X_POS: -183,
      ease: 'power2.out'
    });
  }
});

/**
 * https://tympanus.net/codrops/2022/12/13/how-to-code-an-on-scroll-folding-3d-cardboard-box-animation-with-three-js-and-gsap/
 * scroll animation timeline by scrolling
 */
gsap.registerPlugin(ScrollTrigger);
const timeline = gsap.timeline({
  scrollTrigger: {
    trigger: '.page',
    start: '0% 0%',
    end: '100% 100%',
    scrub: true,
    markers: true,
    onUpdate: animate
  }
});
timeline
  .to(
    nameTextParam,
    {
      duration: 12, // duration
      X_POS: 50,
      Y_POS: 5,
      Z_POS: -5,
      ease: 'power1.out'
    },
    0 // start time
  )
  .to(
    nameTextParam,
    {
      duration: 12,
      X_POS: -50,
      Y_POS: -3,
      Z_POS: -33,
      ease: 'power1.out'
    },
    12
  )
  // to make start time a percentage out of 100 from total duration
  .to(nameTextParam, {}, 100);
