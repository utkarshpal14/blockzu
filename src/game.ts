import Phaser from 'phaser';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from './constants/gameplay';
import { BootScene } from './scenes/BootScene';
import { LoadingScene } from './scenes/LoadingScene';
import { MainMenuScene } from './scenes/MainMenuScene';
import { GameScene } from './scenes/GameScene';
import { GameOverScene } from './scenes/GameOverScene';

export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: CANVAS_WIDTH,
  height: CANVAS_HEIGHT,
  parent: 'app',
  backgroundColor: '#0F172A',
  scene: [
    BootScene,
    LoadingScene,
    MainMenuScene,
    GameScene,
    GameOverScene
  ],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  render: {
    pixelArt: false,
    antialias: true
  }
};

export const game = new Phaser.Game(gameConfig);