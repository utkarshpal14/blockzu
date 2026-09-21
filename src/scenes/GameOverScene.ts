import Phaser from 'phaser';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../constants/gameplay';
import { ThemeManager } from '../managers/ThemeManager';
import { ScoreManager } from '../managers/ScoreManager';
import { AudioManager } from '../managers/AudioManager';
import { AdService } from '../services/AdService';

/**
 * GAME OVER SCENE
 * Defined in Document 04 (Section 16).
 */
export class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOverScene');
  }

  create() {
    const width = this.scale.width || CANVAS_WIDTH;
    const height = this.scale.height || CANVAS_HEIGHT;
    const theme = ThemeManager.getInstance().getActiveColors();
    const scoreManager = ScoreManager.getInstance();
    const audioManager = AudioManager.getInstance();

    audioManager.playGameOver();
    AdService.getInstance().handleGameOver();

    // Semi-transparent overlay background
    this.add.rectangle(width / 2, height / 2, width, height, Phaser.Display.Color.HexStringToColor(theme.background).color, 0.96);

    // Title
    this.add.text(width / 2, 160, 'GAME OVER', {
      fontFamily: 'Poppins, sans-serif',
      fontSize: '36px',
      fontStyle: 'bold',
      color: theme.textPrimary
    }).setOrigin(0.5);

    // Score Summary Card
    const card = this.add.graphics();
    card.fillStyle(Phaser.Display.Color.HexStringToColor(theme.cardBackground).color, 1);
    card.lineStyle(1.5, Phaser.Display.Color.HexStringToColor(theme.cellEmpty).color, 0.8);
    card.fillRoundedRect(width / 2 - 140, 220, 280, 160, 20);
    card.strokeRoundedRect(width / 2 - 140, 220, 280, 160, 20);

    this.add.text(width / 2, 255, 'FINAL SCORE', {
      fontFamily: 'Poppins, sans-serif',
      fontSize: '13px',
      fontStyle: 'bold',
      color: theme.textSecondary
    }).setOrigin(0.5);

    this.add.text(width / 2, 290, `${scoreManager.getCurrentScore()}`, {
      fontFamily: 'Poppins, sans-serif',
      fontSize: '38px',
      fontStyle: 'bold',
      color: theme.textPrimary
    }).setOrigin(0.5);

    this.add.text(width / 2, 345, `BEST: ${scoreManager.getBestScore()}`, {
      fontFamily: 'Poppins, sans-serif',
      fontSize: '15px',
      fontStyle: 'bold',
      color: theme.accent
    }).setOrigin(0.5);

    // Play Again Button (CTA)
    const playAgainBtn = this.add.container(width / 2, 450);
    const playBg = this.add.graphics();
    playBg.fillStyle(Phaser.Display.Color.HexStringToColor(theme.accent).color, 1);
    playBg.fillRoundedRect(-120, -28, 240, 56, 16);
    playAgainBtn.add(playBg);

    const playText = this.add.text(0, 0, 'PLAY AGAIN', {
      fontFamily: 'Poppins, sans-serif',
      fontSize: '18px',
      fontStyle: 'bold',
      color: '#FFFFFF'
    }).setOrigin(0.5);
    playAgainBtn.add(playText);

    playAgainBtn.setSize(240, 56);
    playAgainBtn.setInteractive({ useHandCursor: true });

    playAgainBtn.on('pointerdown', () => {
      audioManager.playButtonClick();
      this.scene.start('GameScene');
    });

    // Main Menu Button
    const menuBtn = this.add.container(width / 2, 530);
    const menuBg = this.add.graphics();
    menuBg.fillStyle(Phaser.Display.Color.HexStringToColor(theme.cardBackground).color, 1);
    menuBg.lineStyle(1.5, Phaser.Display.Color.HexStringToColor(theme.cellEmpty).color, 0.8);
    menuBg.fillRoundedRect(-120, -26, 240, 52, 14);
    menuBg.strokeRoundedRect(-120, -26, 240, 52, 14);
    menuBtn.add(menuBg);

    const menuText = this.add.text(0, 0, 'MAIN MENU', {
      fontFamily: 'Poppins, sans-serif',
      fontSize: '16px',
      fontStyle: 'bold',
      color: theme.textPrimary
    }).setOrigin(0.5);
    menuBtn.add(menuText);

    menuBtn.setSize(240, 52);
    menuBtn.setInteractive({ useHandCursor: true });

    menuBtn.on('pointerdown', () => {
      audioManager.playButtonClick();
      this.scene.start('MainMenuScene');
    });
  }
}
