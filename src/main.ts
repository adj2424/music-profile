import './style.css';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import Init from './init';
import Config from './config';
import Repertoire from './repertoire';
import Title from './title';

// all child objects where it will be animated through tick method
const updatables: any[] = [];

/**
 * Set up
 */
const world = new Init();
const { scene, camera, cameraGroup, renderer, cursor } = world;
updatables.push(world);

// Initial object positions
const INIT = new Config().INIT;

/**
 * Header Title
 */
await Title.init();
updatables.push(Title);
scene.add(Title.trumpet);
scene.add(Title.nameText);
scene.add(Title.musicianText);
scene.add(Title.scrollText);

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
 * repertoire stuff
 */
new Repertoire();
updatables.push(Repertoire);
scene.add(Repertoire.cylinder);
scene.add(Repertoire.textGroup);

// twist deprecated - https://medium.com/@crazypixel/geometry-manipulation-in-three-js-twisting-c53782c38bb

//animates objects with animations
const clock = new THREE.Clock();
function tick(delta: number) {
  for (const obj of updatables) {
    // calls child tick method
    (obj as any).tick(delta);
  }
}

let cameraParam = structuredClone(INIT.CAMERA);
let scrollParam = structuredClone(INIT.SCROLL);
let nameTextParam = structuredClone(INIT.NAME_TEXT);
let trumpetParam = structuredClone(INIT.TRUMPET);
let musicianTextParam = structuredClone(INIT.MUSICIAN_TEXT);
let textGroupParam = structuredClone(INIT.TEXT_GROUP);

/**
 * animation
 */
const animate = () => {
  // delta for consistency
  const delta = clock.getDelta();
  tick(delta);
  camera.position.set(cameraParam.X_POS, cameraParam.Y_POS, cameraParam.Z_POS);
  camera.rotation.x = cameraParam.X_ROT;

  Title.scrollText.scale.set(scrollParam.X_SCALE, scrollParam.Y_SCALE, scrollParam.Z_SCALE);
  Title.nameText.position.set(nameTextParam.X_POS, nameTextParam.Y_POS, nameTextParam.Z_POS);
  Title.trumpet.rotation.set(trumpetParam.X_ROT, trumpetParam.Y_ROT, trumpetParam.Z_ROT);
  Title.trumpet.position.set(trumpetParam.X_POS, trumpetParam.Y_POS, trumpetParam.Z_POS);
  Title.trumpet.scale.set(1, 1, trumpetParam.Z_SCALE);
  Title.musicianText.position.set(musicianTextParam.X_POS, musicianTextParam.Y_POS, musicianTextParam.Z_POS);
  Repertoire.textGroup.position.x = textGroupParam.X_POS;

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
let currScrollY = window.scrollY;
const maxY = document.documentElement.scrollHeight - document.documentElement.clientHeight;
let scrollPercent = 0.0;
window.addEventListener('scroll', () => {
  let st = window.pageYOffset || document.documentElement.scrollTop;
  // whether scroll is up or down
  scrollUp = st > lastScrollTop ? false : true;
  lastScrollTop = st <= 0 ? 0 : st;
  currScrollY = window.scrollY;
  // current scroll percent
  scrollPercent = currScrollY / maxY;

  /**
   * scroll down animations
   */
  if (position == 0 && !scrollUp && scrollPercent > 0.05) {
    position = 1;
    gsap.to(trumpetParam, {
      duration: 1.5,
      X_ROT: -0.3,
      Y_ROT: (3 * Math.PI) / 4 - 0.3,
      X_POS: 5,
      Y_POS: 14,
      Z_POS: -30,
      Z_SCALE: 0.8,
      ease: 'power2.out'
    });
    gsap.to(musicianTextParam, {
      duration: 1.5,
      X_POS: -72,
      Y_POS: 0,
      Z_POS: -40,
      ease: 'power2.out'
    });
    gsap.to(scrollParam, {
      duration: 0.5,
      X_SCALE: 0.0,
      Y_SCALE: 0.0,
      Z_SCALE: 0.0,
      ease: 'power2.out'
    });
    gsap.to(scene.background, {
      duration: 1.5,
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
      onComplete: () => {
        if (position == 2) {
          gsap.to(scene.background, {
            duration: 0.8,
            r: 2 / 255,
            g: 56 / 255,
            b: 60 / 255,
            ease: 'power2.out'
          });
        }
      },
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
    gsap.to(scene.background, {
      duration: 1,
      r: 246 / 255,
      g: 164 / 255,
      b: 164 / 255,
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
    gsap.to(scene.background, {
      duration: 1,
      r: 139 / 255,
      g: 211 / 255,
      b: 230 / 255,
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
    gsap.to(scene.background, {
      duration: 1,
      r: 199 / 255,
      g: 188 / 255,
      b: 161 / 255,
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
    gsap.to(scene.background, {
      duration: 1,
      r: 127 / 255,
      g: 102 / 255,
      b: 157 / 255,
      ease: 'power2.out'
    });
  }
  //yoru ni kakeru
  if (position == 6 && !scrollUp && scrollPercent > 0.58) {
    position = 7;
    gsap.to(textGroupParam, {
      duration: 1,
      X_POS: -183,
      ease: 'power2.out'
    });
    gsap.to(scene.background, {
      duration: 1,
      r: 99 / 255,
      g: 38 / 255,
      b: 38 / 255,
      ease: 'power2.out'
    });
  }
  //o magnum mysterium
  if (position == 7 && !scrollUp && scrollPercent > 0.66) {
    position = 8;
    gsap.to(textGroupParam, {
      duration: 1,
      X_POS: -223,
      ease: 'power2.out'
    });
    gsap.to(scene.background, {
      duration: 1,
      r: 137 / 255,
      g: 138 / 255,
      b: 166 / 255,
      ease: 'power2.out'
    });
  }

  /**
   * scroll up animations
   */
  if (position == 1 && scrollUp && scrollPercent < 0.05) {
    position = 0;
    gsap.to(trumpetParam, {
      duration: 1.5,
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
      duration: 1.5,
      X_POS: INIT.MUSICIAN_TEXT.X_POS,
      Y_POS: INIT.MUSICIAN_TEXT.Y_POS,
      Z_POS: INIT.MUSICIAN_TEXT.Z_POS,
      ease: 'power2.out'
    });
    gsap.to(scrollParam, {
      duration: 0.5,
      X_SCALE: INIT.SCROLL.X_SCALE,
      Y_SCALE: INIT.SCROLL.Y_SCALE,
      Z_SCALE: INIT.SCROLL.Z_SCALE,
      ease: 'power2.out'
    });
    gsap.to(scene.background, {
      duration: 1.5,
      r: 239 / 255,
      g: 226 / 255,
      b: 186 / 255
    });
  }

  if (position == 2 && scrollUp && scrollPercent < 0.18) {
    position = 1;
    gsap.to(cameraParam, {
      duration: 2.5,
      Y_POS: INIT.CAMERA.Y_POS,
      Z_POS: INIT.CAMERA.Z_POS,
      X_ROT: INIT.CAMERA.X_ROT,
      ease: 'power2.out'
    });
    gsap.to(scene.background, {
      duration: 1.5,
      r: 0,
      g: 0,
      b: 0,
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
    gsap.to(scene.background, {
      duration: 0.8,
      r: 2 / 255,
      g: 56 / 255,
      b: 60 / 255,
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
    gsap.to(scene.background, {
      duration: 1,
      r: 246 / 255,
      g: 164 / 255,
      b: 164 / 255,
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
    gsap.to(scene.background, {
      duration: 1,
      r: 139 / 255,
      g: 211 / 255,
      b: 230 / 255,
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
    gsap.to(scene.background, {
      duration: 1,
      r: 199 / 255,
      g: 188 / 255,
      b: 161 / 255,
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
    gsap.to(scene.background, {
      duration: 1,
      r: 127 / 255,
      g: 102 / 255,
      b: 157 / 255,
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
    gsap.to(scene.background, {
      duration: 1,
      r: 99 / 255,
      g: 38 / 255,
      b: 38 / 255,
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
