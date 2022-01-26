import './style.css';
import * as THREE from 'three';
import { Mesh } from 'three';
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
let updatables: Mesh[] = [];

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(windowSize.width, windowSize.height);
camera.position.setZ(5);
renderer.render(scene, camera);

/**
 * Background
 */
//const background = new THREE.TextureLoader().load('/background.jpg');
//scene.background = background;
scene.background = new THREE.Color(0x000000);

//add background stars
function genStars(num: number) {
	for (let i = 0; i < num; i++) {
		const startGeometry = new THREE.TorusKnotGeometry(1, .1, 30, 10);
		const starMaterial = new THREE.MeshBasicMaterial({
			wireframe: true,
			color: 0x0000ff
		});
		const star = new THREE.Mesh(startGeometry, starMaterial);
		const x = (Math.random() * (100 + 100)) - 100;
		const y = -(Math.random() * (100 + 100));
		const z = (-Math.random() * 100) + 5;
		star.position.set(x, y, z);
		updatables.push(star);
		(star as any).tick = (delta: number) => {
			star.rotation.x += 1 * delta;
		};
		scene.add(star);
	}
}
///genStars(100);

//add particles
function genParticles(num: number) {
	for (let i = 0; i < num; i++) {
		const particleGeometry = new THREE.SphereGeometry(.02, 8, 8);
		const particleMaterial = new THREE.MeshBasicMaterial({
			color: 0xFFFFFF,
			wireframe: true
		});
		const particle = new THREE.Mesh(particleGeometry, particleMaterial);
		const x = (Math.random() * (40)) - 20;
		const y = -(Math.random() * 13) - 20;
		const z = (-Math.random() * 10);
		particle.position.set(x, y, z);
		scene.add(particle);
	}
}
genParticles(150);

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
torus0.position.set(3, 1, 0);
updatables.push(torus0);
scene.add(torus0);
(torus0 as any).tick = (delta: number) => {
	torus0.rotation.x += 1 * delta;
	torus0.rotation.y += 0.4 * delta;
	torus0.rotation.z += 2 * delta;
};

/**
 * pfp cube
 */
/**
const geometryCube = new THREE.BoxGeometry(10, 10, 10);
const pfpTexture = new THREE.TextureLoader().load('/pfp.jpg');
const geometryMesh = new THREE.MeshBasicMaterial({
	map: pfpTexture
});
const pfpCube = new THREE.Mesh(geometryCube, geometryMesh);
pfpCube.position.x = 10;
pfpCube.position.y = 10;
//scene.add(pfpCube); 
*/

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
	//renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
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
 * scroll animation
 */
let currScrollY = window.scrollY;
let maxY = document.documentElement.scrollHeight - document.documentElement.clientHeight;
let scrollPercent = 0.0;
window.addEventListener('scroll', () => {
	currScrollY = window.scrollY;
	scrollPercent = currScrollY / maxY;
});

/**
 * scroll animation timeline
 */
// linear interpolation function
function lerp(min: number, max: number, ratio: number): number {
	return (1 - ratio) * min + ratio * max;
}
// fit lerp to start and end at scroll percentages
function scalePercent(start: number, end: number, scrollPercent: number): number {
	return (scrollPercent - start) / (end - start);
}

const timeLineScripts: {
	start: number;
	end: number;
	animationFun: () => void;
}[] = [];

timeLineScripts.push({
	start: 0.00,
	end: 0.1,
	animationFun: () => {
		torus0.position.x = lerp(3, -10, scalePercent(0.00, 0.1, scrollPercent));
		torus0.position.y = lerp(1, -5, scalePercent(0.00, 0.1, scrollPercent));
	}
});
let isDark = true;
function playTimeLineAnimations() {
	for (const script of timeLineScripts) {
		if (scrollPercent >= script.start && scrollPercent < script.end) {
			script.animationFun();
		}
	}
	if (scrollPercent >= .45 && scrollPercent <= .55) {
		
		if (isDark) {
			console.log("hi")
			const background = new THREE.TextureLoader().load('/background.jpg');
			scene.background = background;
			isDark = false;
		}
		else {
			scene.background = new THREE.Color(0x000000);
			isDark = true;
		}
		
	}
}


/**
 * animation
 */
const clock = new THREE.Clock;
function tick(delta: number) {
	for (const obj of updatables) {
		//calls child tick method
		(obj as any).tick(delta);
	}
}
renderer.setAnimationLoop(() => {
	//delta for consistency
	const delta = clock.getDelta();
	tick(delta);
	//animate camera scroll
	const SCROLL_SENS = 8;
	camera.position.y = -currScrollY / windowSize.height * SCROLL_SENS;
	//scroll based animation timeline
	playTimeLineAnimations();

	//animate cursor parallax
	const parallaxX = -cursor.x;
	const parallaxY = cursor.y;
	cameraGroup.position.x += (parallaxX - cameraGroup.position.x * delta * 50); //created camera group to get parallax and scroll working
	cameraGroup.position.y += (parallaxY - cameraGroup.position.y * delta * 30); //idk y it works xd
	renderer.render(scene, camera);
});

