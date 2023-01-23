import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
//import fragment from '../shaders/scrollFragment.glsl';
//import vertex from '../shaders/scrollVertex.glsl';
import Config from './config';

export default class Name {
  static trumpet: THREE.Group;
  static trebleClef: THREE.Group;
  static nameText: THREE.Mesh<THREE.BufferGeometry, THREE.Material | THREE.Material[]>;

  static scrollText: THREE.Mesh<THREE.BufferGeometry, THREE.Material | THREE.Material[]>;
  static INIT: any;
  static frame: number = 0;

  //https://dev.to/somedood/the-proper-way-to-write-async-constructors-in-javascript-1o8c
  constructor() {}
  static async init(loadManager: THREE.LoadingManager) {
    this.INIT = new Config().INIT;
    this.nameText = new THREE.Mesh();
    this.scrollText = new THREE.Mesh();
    await Promise.all([
      this.createTrumpet(loadManager),
      this.createTrebleClef(loadManager),
      this.createText(loadManager)
    ]);

    return new Name();
  }

  static createTrumpet = async (loadManager: THREE.LoadingManager) => {
    const gltfLoader = new GLTFLoader(loadManager);
    const gltf = await gltfLoader.loadAsync('/trumpet/scene.gltf');
    const trumpet = gltf.scene;
    trumpet.position.set(this.INIT.TRUMPET.X_POS, this.INIT.TRUMPET.Y_POS, this.INIT.TRUMPET.Z_POS);
    trumpet.rotation.set(this.INIT.TRUMPET.X_ROT, this.INIT.TRUMPET.Y_ROT, this.INIT.TRUMPET.Z_ROT);
    this.trumpet = trumpet;
  };
  static createTrebleClef = async (loadManager: THREE.LoadingManager) => {
    const gltfLoader = new GLTFLoader(loadManager);
    const gltf = await gltfLoader.loadAsync('/treble_clef/scene.glb');
    gltf.scene.traverse(child => {
      if ((child as THREE.Mesh).isMesh) {
        (child as THREE.Mesh).material = new THREE.MeshBasicMaterial({
          color: 0xffffff
        });
      }
    });
    const trebleClef = gltf.scene;
    trebleClef.scale.set(0.2, 0.2, 0.2);
    trebleClef.position.set(this.INIT.TREBLE_CLEF.X_POS, this.INIT.TREBLE_CLEF.Y_POS, this.INIT.TREBLE_CLEF.Z_POS);
    trebleClef.rotation.y = Math.PI;
    this.trebleClef = trebleClef;
  };

  static createText = async (loadManager: THREE.LoadingManager) => {
    const fontLoader = new FontLoader(loadManager);
    let nameText = new THREE.Mesh();
    let scrollText = new THREE.Mesh();
    const font = await fontLoader.loadAsync('/fonts/Hanken_Grotesk_Regular.json');
    // name
    const nameTextGeometry = new TextGeometry('ALAN JIANG', {
      font: font,
      size: 11,
      height: 0.5
    });
    nameText = new THREE.Mesh(
      nameTextGeometry,
      new THREE.MeshBasicMaterial({
        color: 0x2d3033
      })
    );
    nameText.rotateOnAxis(new THREE.Vector3(0, 1, 0), (7 * Math.PI) / 4 + 0.6);
    nameText.position.set(this.INIT.NAME_TEXT.X_POS, this.INIT.NAME_TEXT.Y_POS, this.INIT.NAME_TEXT.Z_POS);
    nameText.rotateX(this.INIT.NAME_TEXT.X_ROT);
    nameText.rotateZ(this.INIT.NAME_TEXT.Z_ROT);
    this.nameText = nameText;

    const vertex = `#define PI 3.1415926538
    uniform float textLength;
    
    void main () {
      float scale = 1.0 / textLength * PI * 1.98;
      float theta = -position.x * scale;
      float r = 1.4;
      float r2 = r + position.y * scale * r;
      float posX = cos(theta) * r2;
      float posY = sin(theta) * r2;
    
      vec3 p = vec3(posX, posY, position.z);
      gl_Position = projectionMatrix * modelViewMatrix * vec4 (p, 1.0);
    }`;
    const fragment = `void main () {
      gl_FragColor = vec4(1, 1, 1, 1);
    }`;

    const scrollTextGeometry = new TextGeometry('SCROLL TO NAVIGATE  -  SCROLL TO NAVIGATE  -  ', {
      font: font,
      size: 0.04,
      height: 0
    });
    scrollText = new THREE.Mesh(
      scrollTextGeometry,
      new THREE.ShaderMaterial({
        side: THREE.DoubleSide,
        uniforms: {
          textLength: { value: 1.277 }
        },
        vertexShader: vertex,
        fragmentShader: fragment
      })
    );
    scrollText.position.set(0, -5.8, -7);
    this.scrollText = scrollText;
  };

  static tick = (delta: number) => {
    this.scrollText.rotation.z -= 0.35 * delta;
    this.trebleClef.position.y += 0.001 * Math.sin(this.frame);
    this.trebleClef.rotation.z += 0.0005 * Math.sin(this.frame);
    this.trebleClef.rotateOnAxis(new THREE.Vector3(0, 1, 0), 0.5 * delta);
    this.frame += 0.005;
  };
}
