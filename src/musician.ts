import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import Config from './config';

export default class Musician {
  static musicianText: THREE.Mesh<THREE.BufferGeometry, THREE.Material | THREE.Material[]>;
  static groupText: THREE.Group;
  static topGroup: THREE.Group;
  static bottomGroup: THREE.Group;
  static INIT: any;

  constructor() {}
  static async init(loadManager: THREE.LoadingManager) {
    this.INIT = new Config().INIT;
    this.musicianText = new THREE.Mesh();
    this.groupText = new THREE.Group();
    this.topGroup = new THREE.Group();
    this.bottomGroup = new THREE.Group();
    await this.createText(loadManager);
    this.groupText.add(this.topGroup, this.bottomGroup);
    return new Musician();
  }

  static createText = async (loadManager: THREE.LoadingManager) => {
    let musicianText = new THREE.Mesh();
    const fontLoader = new FontLoader(loadManager);
    const hankenRegular = await fontLoader.loadAsync('/fonts/Hanken_Grotesk_Regular.json');

    // musician
    const musicianTextGeometry = new TextGeometry('MUSICIAN', {
      font: hankenRegular,
      size: 22,
      height: 0
    });
    musicianText = new THREE.Mesh(
      musicianTextGeometry,
      new THREE.MeshBasicMaterial({
        color: 0xf3f3ec
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

    // top text
    this.createTopText(loadManager);
    this.topGroup.rotation.z = this.INIT.MUSICIAN_TEXT.Z_ROT;
    // bottom text
    this.createFancyText(loadManager);
    this.createBottomText(loadManager);
    this.bottomGroup.rotation.z = this.INIT.MUSICIAN_TEXT.Z_ROT;
  };
  static createFancyText = async (loadManager: THREE.LoadingManager) => {
    const fontLoader = new FontLoader(loadManager);
    const northwest = await fontLoader.loadAsync('/fonts/Northwest_Signature_Duo_Italic_Regular.json');
    const words: string[] = ['SPECIALIZE', 'EMOTIONAL'];
    const coords: number[][] = [
      [-80, -27, -40],
      [146.5, -27, -40]
    ];
    for (let i = 0; i < words.length; i++) {
      const fancyGeometry = new TextGeometry(words[i], {
        font: northwest,
        size: 8,
        height: 0
      });
      const fancyText = new THREE.Mesh(
        fancyGeometry,
        new THREE.MeshBasicMaterial({
          color: 0xf3f3ec
        })
      );
      const [x, y, z] = coords[i];
      fancyText.position.set(x, y, z);
      this.bottomGroup.add(fancyText);
    }
  };
  static createTopText = async (loadManager: THREE.LoadingManager) => {
    const fontLoader = new FontLoader(loadManager);
    const hankenItalic = fontLoader.loadAsync('/fonts/Hanken_Grotesk_ExtraLight_Italic.json');
    const playfairMedium = fontLoader.loadAsync('/fonts/Playfair_Display_Medium_Regular.json');
    const comfortaa = fontLoader.loadAsync('/fonts/Comfortaa_Regular.json');
    const amita = fontLoader.loadAsync('/fonts/Amita_Regular.json');
    const hankenRegular = fontLoader.loadAsync('/fonts/Hanken_Grotesk_Regular.json');

    //PERFORMER ARTIST PLAYER JUICER SOLOIST
    const words: string[] = ['PERFORMER', 'Artist', 'PLAYER', 'JUICER', 'soloist'];
    const coords: number[][] = [
      [-80, 26, -40],
      [-20, 26, -40],
      [10, 26, -40],
      [55, 26, -40],
      [92, 26, -40]
    ];
    const fonts = await Promise.all([hankenItalic, playfairMedium, comfortaa, amita, hankenRegular]);
    for (let i = 0; i < words.length; i++) {
      const topGeometry = new TextGeometry(words[i], {
        font: fonts[i],
        size: 7,
        height: 0
      });
      const topText = new THREE.Mesh(
        topGeometry,
        new THREE.MeshBasicMaterial({
          color: 0xa7a79f
        })
      );
      const [x, y, z] = coords[i];
      topText.position.set(x, y, z);
      this.topGroup.add(topText);
    }
  };
  static createBottomText = async (loadManager: THREE.LoadingManager) => {
    const fontLoader = new FontLoader(loadManager);
    const hankenLight = await fontLoader.loadAsync('/fonts/Hanken_Grotesk_Light_Regular.json');
    // specialize in music for the pursuit of emotional experiences
    const words: string[] = ['IN MUSIC FOR THE PURSUIT OF', 'EXPERIENCES  -  '];
    const coords: number[][] = [
      [-13, -27, -40],
      [211.5, -27, -40]
    ];
    for (let i = 0; i < words.length; i++) {
      const bottomGeometry = new TextGeometry(words[i], {
        font: hankenLight,
        size: 8,
        height: 0
      });
      const bottomText = new THREE.Mesh(
        bottomGeometry,
        new THREE.MeshBasicMaterial({
          color: 0xa7a79f
        })
      );
      const [x, y, z] = coords[i];
      bottomText.position.set(x, y, z);
      this.bottomGroup.add(bottomText);
    }
  };

  static tick = (delta: number) => {
    this.topGroup.children.map(e => {
      if (e.position.x > 105) {
        e.position.x = -102;
      }
      e.position.x += 10 * delta;
    });
    this.bottomGroup.children.map(e => {
      if (e.position.x < -280) {
        e.position.x = 95;
      }
      e.position.x -= 30 * delta;
    });
  };
}
