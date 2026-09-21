import Phaser from 'phaser';

/**
 * BOOT SCENE
 * Initializes engine configurations and routes to LoadingScene.
 */
export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  create() {
    this.scene.start('LoadingScene');
  }
}