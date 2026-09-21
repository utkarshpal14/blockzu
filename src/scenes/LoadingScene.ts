import Phaser from 'phaser';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../constants/gameplay';
import { BlockRenderer } from '../ui/components/BlockRenderer';
import { AmbientParticles } from '../ui/components/AmbientParticles';

/**
 * LOADING SCENE (Splash & Resource Preparation)
 * Vibrant Block Blast-style splash with 3D colorful puffy logo, gold crown,
 * rotating jewel polyomino, multi-color ambient sparkles, and glowing progress bar.
 */
export class LoadingScene extends Phaser.Scene {
  constructor() {
    super('LoadingScene');
  }

  preload() {
    const width = this.scale.width || CANVAS_WIDTH;
    const height = this.scale.height || CANVAS_HEIGHT;

    // 1. Vibrant Royal Sapphire to Deep Navy Background Gradient (Interconnected)
    const bgGraphics = this.add.graphics();
    bgGraphics.fillGradientStyle(0x223BBE, 0x223BBE, 0x172554, 0x172554, 1);
    bgGraphics.fillRect(0, 0, width, height);

    // 2. Ambient Multi-Color Sparkles
    new AmbientParticles(this, 26, true);

    // 3. Logo Container (Crown + 3D Colorful Letters)
    const logoContainer = this.add.container(width / 2, height / 2 - 135);

    // Crown
    const crown = this.add.text(0, -50, '👑', {
      fontSize: '38px'
    }).setOrigin(0.5);
    logoContainer.add(crown);

    // Colorful 3D Puffy Letters: B L O C K Z U
    const letters = [
      { char: 'B', color: '#FB923C' }, // Orange
      { char: 'L', color: '#38BDF8' }, // Cyan
      { char: 'O', color: '#EF4444' }, // Red
      { char: 'C', color: '#FBBF24' }, // Yellow
      { char: 'K', color: '#C084FC' }, // Purple
      { char: 'Z', color: '#34D399' }, // Emerald
      { char: 'U', color: '#F472B6' }  // Pink
    ];

    const startX = -135;
    const charSpacing = 45;

    letters.forEach((item, idx) => {
      const charX = startX + idx * charSpacing;
      // Drop shadow text
      const shadowText = this.add.text(charX + 3, 5, item.char, {
        fontFamily: 'Poppins, sans-serif',
        fontSize: '48px',
        fontStyle: 'bold',
        color: '#070A14'
      }).setOrigin(0.5);
      logoContainer.add(shadowText);

      // Main vibrant letter
      const text = this.add.text(charX, 0, item.char, {
        fontFamily: 'Poppins, sans-serif',
        fontSize: '48px',
        fontStyle: 'bold',
        color: item.color,
        stroke: '#FFFFFF',
        strokeThickness: 3.5
      }).setOrigin(0.5);
      logoContainer.add(text);
    });

    // Subtitle
    const subText = this.add.text(0, 52, '⚡ PUZZLE MASTER ⚡', {
      fontFamily: 'Poppins, sans-serif',
      fontSize: '13px',
      fontStyle: 'bold',
      color: '#93C5FD',
      letterSpacing: 2
    }).setOrigin(0.5);
    logoContainer.add(subText);

    // Gentle logo breathing pulse
    this.tweens.add({
      targets: logoContainer,
      scale: 1.04,
      duration: 850,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // 4. Center Rotating 3D Jewel Polyomino (Matches Screenshot 2/3)
    const jewelContainer = this.add.container(width / 2, height / 2 + 50);
    const jewelGraphics = this.add.graphics();
    jewelContainer.add(jewelGraphics);

    // Render a 3-block yellow corner jewel
    const tileSize = 28;
    const radius = 6;
    const yellowHex = '#FACC15';

    BlockRenderer.renderJewelBlock(jewelGraphics, -tileSize, -tileSize, tileSize, radius, yellowHex);
    BlockRenderer.renderJewelBlock(jewelGraphics, 0, -tileSize, tileSize, radius, yellowHex);
    BlockRenderer.renderJewelBlock(jewelGraphics, -tileSize, 0, tileSize, radius, yellowHex);

    // Smooth continuous 360 degree rotation + scale pulse
    this.tweens.add({
      targets: jewelContainer,
      angle: 360,
      duration: 3500,
      repeat: -1,
      ease: 'Linear'
    });

    this.tweens.add({
      targets: jewelContainer,
      scale: 1.12,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // 5. Glowing Progress Bar
    const barWidth = 240;
    const barHeight = 10;
    const barX = (width - barWidth) / 2;
    const barY = height / 2 + 180;

    const bgBar = this.add.graphics();
    bgBar.fillStyle(0x0F172A, 0.9);
    bgBar.lineStyle(1.5, 0x334155, 0.8);
    bgBar.fillRoundedRect(barX, barY, barWidth, barHeight, 5);
    bgBar.strokeRoundedRect(barX, barY, barWidth, barHeight, 5);

    const progressBar = this.add.graphics();
    this.load.on('progress', (value: number) => {
      progressBar.clear();
      progressBar.fillStyle(0x00F0FF, 1); // Neon cyan
      progressBar.fillRoundedRect(barX + 1, barY + 1, (barWidth - 2) * value, barHeight - 2, 4);
    });
  }

  create() {
    this.time.delayedCall(1600, () => {
      this.scene.start('MainMenuScene');
    });
  }
}
