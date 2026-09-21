import Phaser from "phaser";

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super("PreloadScene");
  }

  preload() {}

  create() {
    this.add.text(
      this.scale.width / 2,
      this.scale.height / 2,
      "BLOCKZU",
      {
        fontSize: "48px",
        color: "#ffffff",
      }
    ).setOrigin(0.5);
  }
}