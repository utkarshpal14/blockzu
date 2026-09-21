import Phaser from 'phaser';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../constants/gameplay';
import { ThemeManager } from '../managers/ThemeManager';

/**
 * LOADING SCENE (Splash & Resource Preparation)
 * Defined in Document 04 (Sections 4 & 5).
 */
export class LoadingScene extends Phaser.Scene {
  constructor() {
    super('LoadingScene');
  }

  preload() {
    const width = this.scale.width || CANVAS_WIDTH;
    const height = this.scale.height || CANVAS_HEIGHT;
    const theme = ThemeManager.getInstance().getActiveColors();

    // Background
    this.add.rectangle(width / 2, height / 2, width, height, Phaser.Display.Color.HexStringToColor(theme.background).color);

    // Title Logo
    const title = this.add.text(width / 2, height / 2 - 40, 'BLOCKZU', {
      fontFamily: 'Poppins, sans-serif',
      fontSize: '46px',
      fontStyle: 'bold',
      color: theme.textPrimary
    }).setOrigin(0.5);

    // Subtitle
    this.add.text(width / 2, height / 2 + 15, 'PriorApp Games', {
      fontFamily: 'Poppins, sans-serif',
      fontSize: '16px',
      color: theme.textSecondary
    }).setOrigin(0.5);

    // Subtle scale animation on title
    this.tweens.add({
      targets: title,
      scale: { from: 0.95, to: 1.05 },
      duration: 750,
      yoyo: true,
      repeat: 1
    });

    // Loading bar container
    const barWidth = 200;
    const barHeight = 6;
    const barX = (width - barWidth) / 2;
    const barY = height / 2 + 80;

    const bgBar = this.add.graphics();
    bgBar.fillStyle(Phaser.Display.Color.HexStringToColor(theme.cellEmpty).color, 0.5);
    bgBar.fillRoundedRect(barX, barY, barWidth, barHeight, 3);

    const progressBar = this.add.graphics();
    const accentColor = Phaser.Display.Color.HexStringToColor(theme.accent).color;

    this.load.on('progress', (value: number) => {
      progressBar.clear();
      progressBar.fillStyle(accentColor, 1);
      progressBar.fillRoundedRect(barX, barY, barWidth * value, barHeight, 3);
    });
  }

  create() {
    // 1.5 second splash display per Doc 04
    this.time.delayedCall(1500, () => {
      this.scene.start('MainMenuScene');
    });
  }
}
