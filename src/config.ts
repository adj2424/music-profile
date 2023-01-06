export default class Config {
  INIT: any;
  constructor() {
    /**
     * Init object positions
     */
    const INIT = {
      CAMERA: { X_POS: 0, Y_POS: 0, Z_POS: 5, X_ROT: 0 },
      TREBLE_CLEF: { X_POS: -11, Y_POS: 5, Z_POS: -7 },
      SCROLL: { X_SCALE: 1, Y_SCALE: 1, Z_SCALE: 1 },
      NAME_TEXT: { X_POS: -50, Y_POS: -1, Z_POS: -33, X_ROT: -0.15, Y_ROT: (7 * Math.PI) / 4 + 0.6, Z_ROT: 0.09 },
      TRUMPET: { X_POS: -8, Y_POS: 18, Z_POS: -23, X_ROT: -0.2, Y_ROT: -(3 * Math.PI) / 4 + 0.3, Z_ROT: 0, Z_SCALE: 1 },
      MUSICIAN_TEXT: { X_POS: -200, Y_POS: 25, Z_POS: -30, Z_ROT: -0.15, Y_SCALE: 1.5 },
      TEXT_GROUP: { X_POS: -8 }
    };
    this.INIT = INIT;
  }
}
