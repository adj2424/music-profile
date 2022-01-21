import './style.css'
import * as THREE from  'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls' 




// setup
const scene = new THREE.Scene(); 

const camera = new THREE.PerspectiveCamera(50 , window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg')!,
});

const controls = new OrbitControls(camera, renderer.domElement);

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);  
camera.position.setZ(50);
renderer.render(scene, camera);

//add background
const background = new THREE.TextureLoader().load('/background.jpg')
scene.background = background;

//add background stars
function addStar() {
  const geometryStar = new THREE.SphereGeometry(0.25, 24, 24);
  const materialStar = new THREE.MeshBasicMaterial({
    wireframe: true,
    color: 0x0000ff
  });
  const star = new THREE.Mesh(geometryStar, materialStar);
  const x = (Math.random() * (100 + 100)) - 100;
  const y = (Math.random() * (100 + 100)) - 100;
  const z = (Math.random() * (100 + 100)) - 100;
    
  star.position.set(x, y, z);
  return star;

  
}
let star = addStar();
for (let i = 0; i < 100; i++){ 
  star = addStar();
  scene.add(star)
}

//add light source
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight);  

// torus
const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshStandardMaterial()
material.color = new THREE.Color(0xff0000);
const torus = new THREE.Mesh(geometry, material);
//add object to scene
scene.add(torus)

//pfp cube
const geometryCube = new THREE.BoxGeometry(10, 10, 10)
const pfpTexture = new THREE.TextureLoader().load('/pfp.jpg')
const geometryMesh = new THREE.MeshBasicMaterial({
  map: pfpTexture
});
const pfpCube = new THREE.Mesh(geometryCube, geometryMesh)
pfpCube.position.x = 10;
pfpCube.position.y = 10;
scene.add(pfpCube); 


//helpers
const gridHelper = new THREE.GridHelper(500)
scene.add(gridHelper)





//animate
function animate () {
  requestAnimationFrame(animate);
  torus.rotation.x += 0.001;
  torus.rotateY(.005);
  torus.rotateZ(.003);
  controls.update();
  star.rotateY(0.005);
  renderer.render(scene, camera);
}
animate();