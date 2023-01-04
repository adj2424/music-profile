import * as THREE from 'three';
export default class Init {
  scene: THREE.Scene;
  camera: THREE.Camera;
  cameraGroup: THREE.Group;
  renderer: THREE.WebGLRenderer;
  cursor: any;
  tickItems: any[] = [];
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
    scene.background = new THREE.Color(0xefe2ba);

    /**
     * Light Source
     */
    const ambientLight = new THREE.AmbientLight(0xffffff);
    scene.add(ambientLight);

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
     * helpers
     */
    const gridHelper = new THREE.GridHelper(500);
    //const controls = new OrbitControls(camera, renderer.domElement);
    scene.add(gridHelper);

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
    this.renderer = renderer;
    this.cursor = cursor;
    this.genParticles(80);
    this.genStars(100);
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
      this.tickItems.push(star);
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
      this.scene.add(particle);
    }
  }

  tick = (delta: number) => {
    this.tickItems.map(e => {
      e.rotation.x += 1 * delta;
    });
  };
}
