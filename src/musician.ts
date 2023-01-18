import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import Config from './config';

export default class Musician {
  static musicianText: THREE.Mesh<THREE.BufferGeometry, THREE.Material | THREE.Material[]>;
  static INIT: any;

  constructor() {}
  static async init() {
    this.INIT = new Config().INIT;
    this.musicianText = new THREE.Mesh();
    await this.createText();
  }

  static createText = async () => {
    let musicianText = new THREE.Mesh();
    const fontLoader = new FontLoader();
    const font = await fontLoader.loadAsync('/Hanken_Grotesk_Regular.json');
    // musician
    const musicianTextGeometry = new TextGeometry('MUSICIAN', {
      font: font,
      size: 22,
      height: 0
    });
    musicianText = new THREE.Mesh(
      musicianTextGeometry,
      new THREE.MeshBasicMaterial({
        color: 0xffffff
      })
    );
    musicianText.position.set(
      this.INIT.MUSICIAN_TEXT.X_POS,
      this.INIT.MUSICIAN_TEXT.Y_POS,
      this.INIT.MUSICIAN_TEXT.Z_POS
    );
    musicianText.rotation.z = this.INIT.MUSICIAN_TEXT.Z_ROT;
    musicianText.scale.y = this.INIT.MUSICIAN_TEXT.Y_SCALE;
    this.musicianText = musicianText;
  };
}
