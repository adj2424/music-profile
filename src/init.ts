import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
export default class Init {
  scene: THREE.Scene;
  camera: THREE.Camera;
  cameraGroup: THREE.Group;
  musicNoteGroup: THREE.Group;
  renderer: THREE.WebGLRenderer;
  cursor: any;
  constructor() {
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

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(windowSize.width, windowSize.height);
    camera.position.setZ(5);
    renderer.render(scene, camera);

    /**
     * Background
     */
    //const background = new THREE.TextureLoader().load('/background.jpg');
    //scene.background = background;
    scene.background = new THREE.Color(0xbdb8b1);

    /**
     * Light Source
     */
    const ambientLight = new THREE.AmbientLight(0xffffff);
    scene.add(ambientLight);

    const light = new THREE.PointLight(0xffffff, 3, 100);
    light.position.set(-10, 6, -4);
    scene.add(light);

    /**
     * helpers
     */
    const lightHelper = new THREE.PointLightHelper(light);
    scene.add(lightHelper);
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

    this.scene = scene;
    this.camera = camera;
    this.cameraGroup = cameraGroup;
    this.musicNoteGroup = new THREE.Group();
    this.renderer = renderer;
    this.cursor = cursor;
    this.genParticles(80);
    //this.genStars(100);
    this.addMusicNotes();
  }

  // add background stars
  genStars(num: number) {
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
      this.scene.add(star);
    }
  }

  // add particles
  genParticles(num: number) {
    for (let i = 0; i < num; i++) {
      const particleGeometry = new THREE.SphereGeometry(0.1, 8, 8);
      const particleMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: true
      });
      const particle = new THREE.Mesh(particleGeometry, particleMaterial);
      const x = Math.random() * 80 - 40;
      const y = -(Math.random() * 15) - 13.5;
      const z = -Math.random() * 7.5 - 5;
      particle.position.set(x, y, z);
      particle.rotation.set(x, y, z);
      this.scene.add(particle);
    }
  }

  // maybe add notes randomly and delete them after crossing so its auto gen
  async addMusicNotes() {
    const gltfLoader = new GLTFLoader();
    let gltf = await gltfLoader.loadAsync('/symbols/16th note2.glb');
    gltf.scene.traverse(child => {
      if ((child as THREE.Mesh).isMesh) {
        (child as THREE.Mesh).material = new THREE.MeshBasicMaterial({
          color: 0x2d3033
        });
      }
    });
    const sixteenNote = gltf.scene;
    sixteenNote.position.set(-18, -5.5, -8);
    sixteenNote.rotation.set(-Math.PI / 2, 0, Math.PI);
    this.musicNoteGroup.add(sixteenNote);

    gltf = await gltfLoader.loadAsync('/symbols/half note.glb');
    gltf.scene.traverse(child => {
      if ((child as THREE.Mesh).isMesh) {
        (child as THREE.Mesh).material = new THREE.MeshBasicMaterial({
          color: 0x2d3033
        });
      }
    });
    const halfNote = gltf.scene;
    halfNote.position.set(-5, -7, -8);
    halfNote.rotation.set(-Math.PI / 2, 0, Math.PI);
    this.musicNoteGroup.add(halfNote);

    gltf = await gltfLoader.loadAsync('/symbols/quarter note.glb');
    gltf.scene.traverse(child => {
      if ((child as THREE.Mesh).isMesh) {
        (child as THREE.Mesh).material = new THREE.MeshBasicMaterial({
          color: 0x2d3033
        });
      }
    });
    const quarterNote = gltf.scene;
    quarterNote.position.set(0, -7, -8);
    quarterNote.rotation.set(-Math.PI / 2, 0, Math.PI);
    this.musicNoteGroup.add(quarterNote);

    gltf = await gltfLoader.loadAsync('/symbols/8th note.glb');
    gltf.scene.traverse(child => {
      if ((child as THREE.Mesh).isMesh) {
        (child as THREE.Mesh).material = new THREE.MeshBasicMaterial({
          color: 0x2d3033
        });
      }
    });
    const eighthNote = gltf.scene;
    eighthNote.position.set(5.25, -6, -8);
    eighthNote.rotation.set(-Math.PI / 2, 0, Math.PI);
    this.musicNoteGroup.add(eighthNote);

    gltf = await gltfLoader.loadAsync('/symbols/16th note5.glb');
    gltf.scene.traverse(child => {
      if ((child as THREE.Mesh).isMesh) {
        (child as THREE.Mesh).material = new THREE.MeshBasicMaterial({
          color: 0x2d3033
        });
      }
    });
    const sixteenNote2 = gltf.scene;
    sixteenNote2.position.set(14, -6, -8);
    sixteenNote2.rotation.set(-Math.PI / 2, 0, Math.PI);
    this.musicNoteGroup.add(sixteenNote2);

    gltf = await gltfLoader.loadAsync('/symbols/whole note.glb');
    gltf.scene.traverse(child => {
      if ((child as THREE.Mesh).isMesh) {
        (child as THREE.Mesh).material = new THREE.MeshBasicMaterial({
          color: 0x2d3033
        });
      }
    });
    const wholeNote = gltf.scene;
    wholeNote.position.set(26, -7.15, -8);
    wholeNote.rotation.set(-Math.PI / 2, 0, Math.PI);
    this.musicNoteGroup.add(wholeNote);

    gltf = await gltfLoader.loadAsync('/symbols/triple note.glb');
    gltf.scene.traverse(child => {
      if ((child as THREE.Mesh).isMesh) {
        (child as THREE.Mesh).material = new THREE.MeshBasicMaterial({
          color: 0x2d3033
        });
      }
    });
    const tripleNote = gltf.scene;
    tripleNote.position.set(30.8, -6.15, -8);
    tripleNote.rotation.set(-Math.PI / 2, 0, Math.PI);
    this.musicNoteGroup.add(tripleNote);
    this.scene.add(this.musicNoteGroup);
  }

  tick = (delta: number) => {
    this.musicNoteGroup.children.map(e => {
      if (e.position.x < -30) {
        e.position.x = 30;
      }
      e.position.x -= 2.5 * delta;
    });
  };
}
