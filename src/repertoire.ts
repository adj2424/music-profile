import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import Config from './config';

export default class Repertoire {
  static musicParent: THREE.Object3D;
  static textGroup: THREE.Group;
  static frames: number[];
  static rotationDirections: number[];
  static repertoireText: THREE.Mesh<THREE.BufferGeometry, THREE.Material | THREE.Material[]>;
  static INIT: any;

  constructor() {}
  static async init() {
    this.INIT = new Config().INIT;

    // music note stuff
    const musicParent = new THREE.Object3D();
    musicParent.position.set(0, -34.5, -12);
    musicParent.rotation.x = -Math.PI / 5;
    musicParent.rotation.z = -Math.PI / 10;
    this.musicParent = musicParent;
    await this.addSatellite();
    // generate random frame for each music note for variance
    this.frames = [...Array(this.musicParent.children.length)].map(_ => Math.random() * 10);
    // generate random y axis value for each music note for variance
    this.rotationDirections = [...Array(this.musicParent.children.length)].map(_ => Math.random() * 2 - 1);

    //title text
    const fontLoader = new FontLoader();
    const fontStyle = await fontLoader.loadAsync('/fonts/Hanken_Grotesk_Regular.json');
    this.repertoireText = new THREE.Mesh();
    const textGeometry = new TextGeometry('Repertoire', {
      font: fontStyle,
      size: 1,
      height: 0
    });
    const titleText = new THREE.Mesh(
      textGeometry,
      new THREE.MeshBasicMaterial({
        color: 0xffffff
      })
    );
    titleText.position.set(-3.5, -37, -50);
    titleText.rotation.x = -Math.PI / 4;
    this.repertoireText = titleText;

    // text stuff
    const textGroup = new THREE.Group();
    textGroup.position.set(Repertoire.INIT.TEXT_GROUP.X_POS, 0, 0);
    textGroup.rotation.x = -Math.PI / 4;
    this.textGroup = textGroup;
    const words = [
      'Scheherazade',
      'Festive Overture',
      'Haydn Concerto',
      'Neruda Concerto',
      'Petrushka',
      'Yoru ni Kakeru',
      'O Magnum Mysterium',
      'CONTACT ME'
    ];
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
      this.textGroup.add(text);
    });
    return new Repertoire();
  }

  static addSatellite = async () => {
    const fontLoader = new FontLoader();
    //https://fonts.google.com/noto/specimen/Noto+Music/glyphs
    // only misc symbols work????!!!!!!!
    const musicSymbolFont = await fontLoader.loadAsync('/fonts/Noto_Music_Regular.json');
    const gltfLoader = new GLTFLoader();
    const sixteenNote = gltfLoader.loadAsync('/symbols/16th note.glb');
    const halfNote = gltfLoader.loadAsync('/symbols/half note.glb');
    const sixteenNote2 = gltfLoader.loadAsync('/symbols/16th note3.glb');
    const quarterNote = gltfLoader.loadAsync('/symbols/quarter note.glb');
    const eighthNote = gltfLoader.loadAsync('/symbols/8th note.glb');
    const sixteenNote3 = gltfLoader.loadAsync('/symbols/16th note2.glb');
    const wholeNote = gltfLoader.loadAsync('/symbols/whole note.glb');
    const tripleNote = gltfLoader.loadAsync('/symbols/triple note2.glb');

    const notes = await Promise.all([
      sixteenNote,
      halfNote,
      sixteenNote2,
      quarterNote,
      eighthNote,
      sixteenNote3,
      '♪',
      wholeNote,
      tripleNote
    ]);

    let radius = 16;
    const angle = (2 * Math.PI) / notes.length;
    for (let i = 0; i < notes.length; i++) {
      //text objects
      let note = new THREE.Group();
      if (typeof notes[i] === 'string') {
        const textGeometry = new TextGeometry(notes[i] as string, {
          font: musicSymbolFont,
          size: 5,
          height: 0.04
        });
        const text = new THREE.Mesh(
          textGeometry,
          new THREE.MeshBasicMaterial({
            color: 0x2d3033
          })
        );
        text.position.set(0, -2, 0);
        note.add(text);
      }
      //gltf objects
      else {
        const gltf = notes[i] as GLTF;
        gltf.scene.traverse(child => {
          if ((child as THREE.Mesh).isMesh) {
            (child as THREE.Mesh).material = new THREE.MeshBasicMaterial({
              color: 0x2d3033
            });
          }
        });
        note = gltf.scene;
        note.rotation.set(-Math.PI / 2, 0, Math.random() * 10);
        // check for the big 16th notes and make it smaller by increasing radius
        radius = i !== 2 && i !== 5 ? 16 : 20;
      }
      note.position.x = radius * Math.cos(angle * i);
      note.position.z = radius * Math.sin(angle * i);
      this.musicParent.add(note);
    }
  };

  static tick = (delta: number) => {
    this.musicParent.rotateOnAxis(new THREE.Vector3(0, 1, 0), delta * 0.4);
    this.musicParent.children.map((e, i) => {
      //gltf
      if (i !== 6) {
        e.rotateOnAxis(new THREE.Vector3(0, 0, this.rotationDirections[i]), delta * 1.2);
      }
      //text
      else {
        e.rotateOnAxis(new THREE.Vector3(0, this.rotationDirections[i], 0), delta * 1.2);
      }
      e.position.y += 0.006 * Math.sin(this.frames[i]);
      this.frames[i] += 0.005;
    });
  };
}
