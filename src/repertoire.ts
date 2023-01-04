import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import Config from './config';

export default class Repertoire {
  static cylinder: THREE.Mesh<THREE.CylinderGeometry, THREE.MeshBasicMaterial>;
  static textGroup: THREE.Group;
  static INIT: any;

  constructor() {
    Repertoire.INIT = new Config().INIT;
    // cylinder stuff
    let cylinderGeometry = new THREE.CylinderGeometry(1, 1, 3, 10);
    const material = new THREE.MeshBasicMaterial({
      color: 0x0000ff,
      wireframe: true
    });
    const cylinder = new THREE.Mesh(cylinderGeometry, material);
    cylinder.position.set(0, -35, -14);
    cylinder.rotation.x = -Math.PI / 8;
    cylinder.rotation.z = -Math.PI / 10;
    Repertoire.cylinder = cylinder;
    Repertoire.addSatellite(11, 6);

    // text stuff
    const textGroup = new THREE.Group();
    textGroup.position.set(Repertoire.INIT.TEXT_GROUP.X_POS, 0, 0);
    textGroup.position.set(-8, 0, 0);
    textGroup.rotation.x = -Math.PI / 4;
    Repertoire.textGroup = textGroup;
    Repertoire.addText([
      'Scheherazade',
      'Festive Overture',
      'Haydn Concerto',
      'Neruda Concerto',
      'Petrushka',
      'Yoru ni Kakeru',
      'O Magnum Mysterium'
    ]);
  }

  static addSatellite = (radius: number, amount: number) => {
    const starGeometry = new THREE.TorusKnotGeometry(0.5, 0.1, 30, 10);
    const starMaterial = new THREE.MeshBasicMaterial({
      wireframe: true,
      color: 0x0000ff
    });
    for (let i = 0; i < amount; i++) {
      let x = (i * 2 * radius) / amount - radius;
      const star = new THREE.Mesh(starGeometry, starMaterial);
      star.position.x = x;
      let y = Math.sqrt(Math.pow(radius, 2) - Math.pow(x, 2));
      star.position.z = y;
      this.cylinder.add(star);
    }

    for (let i = 0; i < amount; i++) {
      let x = (i * 2 * radius) / amount - radius;
      const star = new THREE.Mesh(starGeometry, starMaterial);
      star.position.x = x;
      let y = -Math.sqrt(Math.pow(radius, 2) - Math.pow(x, 2));
      star.position.z = y;
      this.cylinder.add(star);
    }
  };

  static addText = async (words: string[]) => {
    const fontLoader = new FontLoader();
    const fontStyle = await fontLoader.loadAsync('/Hanken_Grotesk_Regular.json');
    words.map((e, i) => {
      const textGeometry = new TextGeometry(e, {
        font: fontStyle,
        size: 2,
        height: 0
      });
      const text = new THREE.Mesh(
        textGeometry,
        new THREE.MeshBasicMaterial({
          color: 0xffffff
        })
      );
      //text.position.set(-10 + i, -35, -15);
      text.position.set(-1 + 35 * i, -16, -36);
      Repertoire.textGroup.add(text);
    });
  };
  static tick = (delta: number) => {
    Repertoire.cylinder.rotateOnAxis(new THREE.Vector3(0, 1, 0), delta * 0.5);
  };
}
