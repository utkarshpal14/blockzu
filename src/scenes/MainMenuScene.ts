import Phaser from 'phaser';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../constants/gameplay';
import { ThemeManager } from '../managers/ThemeManager';
import { SaveManager } from '../managers/SaveManager';
import { AudioManager } from '../managers/AudioManager';

/**
 * MAIN MENU SCENE
 * Defined in Document 04 (Section 6).
 */
export class MainMenuScene extends Phaser.Scene {
  constructor() {
    super('MainMenuScene');
  }

  create() {
    const width = this.scale.width || CANVAS_WIDTH;
    const height = this.scale.height || CANVAS_HEIGHT;
    const theme = ThemeManager.getInstance().getActiveColors();
    const saveManager = SaveManager.getInstance();
    const audioManager = AudioManager.getInstance();

    // Background
    this.add.rectangle(width / 2, height / 2, width, height, Phaser.Display.Color.HexStringToColor(theme.background).color);

    // Header Logo
    this.add.text(width / 2, 130, 'BLOCKZU', {
      fontFamily: 'Poppins, sans-serif',
      fontSize: '44px',
      fontStyle: 'bold',
      color: theme.textPrimary
    }).setOrigin(0.5);

    // Coins Pill
    const coinContainer = this.add.container(width / 2, 185);
    const coinBg = this.add.graphics();
    coinBg.fillStyle(Phaser.Display.Color.HexStringToColor(theme.cardBackground).color, 0.9);
    coinBg.lineStyle(1.5, Phaser.Display.Color.HexStringToColor(theme.cellEmpty).color, 0.8);
    coinBg.fillRoundedRect(-60, -16, 120, 32, 16);
    coinBg.strokeRoundedRect(-60, -16, 120, 32, 16);
    coinContainer.add(coinBg);

    const coinText = this.add.text(0, 0, `🪙 ${saveManager.getCoins()}`, {
      fontFamily: 'Poppins, sans-serif',
      fontSize: '15px',
      fontStyle: 'bold',
      color: theme.textPrimary
    }).setOrigin(0.5);
    coinContainer.add(coinText);

    // Best Score Card
    const bestCard = this.add.graphics();
    bestCard.fillStyle(Phaser.Display.Color.HexStringToColor(theme.cardBackground).color, 0.95);
    bestCard.lineStyle(1.5, Phaser.Display.Color.HexStringToColor(theme.cellEmpty).color, 0.5);
    bestCard.fillRoundedRect(width / 2 - 140, 240, 280, 100, 18);
    bestCard.strokeRoundedRect(width / 2 - 140, 240, 280, 100, 18);

    this.add.text(width / 2, 265, 'BEST SCORE', {
      fontFamily: 'Poppins, sans-serif',
      fontSize: '14px',
      fontStyle: 'bold',
      color: theme.textSecondary
    }).setOrigin(0.5);

    this.add.text(width / 2, 305, `${saveManager.getBestScore()}`, {
      fontFamily: 'Poppins, sans-serif',
      fontSize: '36px',
      fontStyle: 'bold',
      color: theme.textPrimary
    }).setOrigin(0.5);

    // PLAY NOW Button (Primary CTA)
    const playBtn = this.add.container(width / 2, 430);
    const playBg = this.add.graphics();
    const accentColor = Phaser.Display.Color.HexStringToColor(theme.accent).color;
    playBg.fillStyle(accentColor, 1);
    playBg.fillRoundedRect(-120, -32, 240, 64, 20);
    playBtn.add(playBg);

    const playText = this.add.text(0, 0, 'PLAY NOW', {
      fontFamily: 'Poppins, sans-serif',
      fontSize: '22px',
      fontStyle: 'bold',
      color: '#FFFFFF'
    }).setOrigin(0.5);
    playBtn.add(playText);

    playBtn.setSize(240, 64);
    playBtn.setInteractive({ useHandCursor: true });

    playBtn.on('pointerdown', () => {
      audioManager.playButtonClick();
      this.tweens.add({
        targets: playBtn,
        scale: 0.95,
        duration: 80,
        yoyo: true,
        onComplete: () => {
          this.scene.start('GameScene');
        }
      });
    });

    // Secondary Action Buttons Row: Themes & Settings
    this.createSecondaryButton(width / 2 - 70, 540, '🎨 Themes', () => {
      audioManager.playButtonClick();
      // Themes overlay / dialog
    });

    this.createSecondaryButton(width / 2 + 70, 540, '⚙️ Settings', () => {
      audioManager.playButtonClick();
      // Settings scene/overlay
    });
  }

  private createSecondaryButton(x: number, y: number, label: string, onClick: () => void) {
    const theme = ThemeManager.getInstance().getActiveColors();
    const container = this.add.container(x, y);

    const bg = this.add.graphics();
    bg.fillStyle(Phaser.Display.Color.HexStringToColor(theme.cardBackground).color, 1);
    bg.lineStyle(1.5, Phaser.Display.Color.HexStringToColor(theme.cellEmpty).color, 0.8);
    bg.fillRoundedRect(-60, -24, 120, 48, 14);
    bg.strokeRoundedRect(-60, -24, 120, 48, 14);
    container.add(bg);

    const text = this.add.text(0, 0, label, {
      fontFamily: 'Poppins, sans-serif',
      fontSize: '14px',
      fontStyle: 'bold',
      color: theme.textPrimary
    }).setOrigin(0.5);
    container.add(text);

    container.setSize(120, 48);
    container.setInteractive({ useHandCursor: true });

    container.on('pointerdown', () => {
      this.tweens.add({
        targets: container,
        scale: 0.94,
        duration: 80,
        yoyo: true,
        onComplete: onClick
      });
    });
  }
}
