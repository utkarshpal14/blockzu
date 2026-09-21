import Phaser from 'phaser';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../constants/gameplay';
import { ThemeManager } from '../managers/ThemeManager';
import { ScoreManager } from '../managers/ScoreManager';
import { AudioManager } from '../managers/AudioManager';
import { SessionStats } from '../systems/GameFlowSystem';

/**
 * GAME OVER SCENE
 * Displays final score, best score, match statistics summary, and instant replay flow.
 * Defined in Document 04 (Section 16).
 */
export class GameOverScene extends Phaser.Scene {
  private sessionStats?: SessionStats;

  constructor() {
    super('GameOverScene');
  }

  init(data: SessionStats) {
    this.sessionStats = data;
  }

  create() {
    const width = this.scale.width || CANVAS_WIDTH;
    const height = this.scale.height || CANVAS_HEIGHT;
    const theme = ThemeManager.getInstance().getActiveColors();
    const scoreManager = ScoreManager.getInstance();
    const audioManager = AudioManager.getInstance();

    const finalScore = this.sessionStats?.score ?? scoreManager.getCurrentScore();
    const bestScore = scoreManager.getBestScore();
    const linesCleared = this.sessionStats?.linesCleared ?? 0;
    const maxCombo = this.sessionStats?.maxCombo ?? 0;

    // Background
    this.add.rectangle(width / 2, height / 2, width, height, Phaser.Display.Color.HexStringToColor(theme.background).color, 0.98);

    // Title
    this.add.text(width / 2, 130, 'GAME OVER', {
      fontFamily: 'Poppins, sans-serif',
      fontSize: '38px',
      fontStyle: 'bold',
      color: theme.textPrimary
    }).setOrigin(0.5);

    // Score Summary Card
    const card = this.add.graphics();
    card.fillStyle(Phaser.Display.Color.HexStringToColor(theme.cardBackground).color, 1);
    card.lineStyle(1.5, Phaser.Display.Color.HexStringToColor(theme.cellEmpty).color, 0.8);
    card.fillRoundedRect(width / 2 - 150, 190, 300, 190, 20);
    card.strokeRoundedRect(width / 2 - 150, 190, 300, 190, 20);

    this.add.text(width / 2, 220, 'FINAL SCORE', {
      fontFamily: 'Poppins, sans-serif',
      fontSize: '13px',
      fontStyle: 'bold',
      color: theme.textSecondary
    }).setOrigin(0.5);

    this.add.text(width / 2, 260, `${finalScore}`, {
      fontFamily: 'Poppins, sans-serif',
      fontSize: '42px',
      fontStyle: 'bold',
      color: theme.textPrimary
    }).setOrigin(0.5);

    this.add.text(width / 2, 310, `BEST: ${bestScore}`, {
      fontFamily: 'Poppins, sans-serif',
      fontSize: '16px',
      fontStyle: 'bold',
      color: theme.accent
    }).setOrigin(0.5);

    // Mini Match Stats Pill
    this.add.text(width / 2, 345, `Lines: ${linesCleared}  •  Max Combo: ${maxCombo > 1 ? `x${maxCombo}` : '1'}`, {
      fontFamily: 'Poppins, sans-serif',
      fontSize: '13px',
      color: theme.textSecondary
    }).setOrigin(0.5);

    // PLAY AGAIN Button (Primary CTA)
    const playAgainBtn = this.add.container(width / 2, 440);
    const playBg = this.add.graphics();
    playBg.fillStyle(Phaser.Display.Color.HexStringToColor(theme.accent).color, 1);
    playBg.fillRoundedRect(-125, -28, 250, 56, 16);
    playAgainBtn.add(playBg);

    const playText = this.add.text(0, 0, 'PLAY AGAIN', {
      fontFamily: 'Poppins, sans-serif',
      fontSize: '18px',
      fontStyle: 'bold',
      color: '#FFFFFF'
    }).setOrigin(0.5);
    playAgainBtn.add(playText);

    playAgainBtn.setSize(250, 56);
    playAgainBtn.setInteractive({ useHandCursor: true });

    playAgainBtn.on('pointerdown', () => {
      audioManager.playButtonClick();
      this.tweens.add({
        targets: playAgainBtn,
        scale: 0.95,
        duration: 80,
        yoyo: true,
        onComplete: () => {
          this.scene.start('GameScene');
        }
      });
    });

    // MAIN MENU Button
    const menuBtn = this.add.container(width / 2, 520);
    const menuBg = this.add.graphics();
    menuBg.fillStyle(Phaser.Display.Color.HexStringToColor(theme.cardBackground).color, 1);
    menuBg.lineStyle(1.5, Phaser.Display.Color.HexStringToColor(theme.cellEmpty).color, 0.8);
    menuBg.fillRoundedRect(-125, -26, 250, 52, 14);
    menuBg.strokeRoundedRect(-125, -26, 250, 52, 14);
    menuBtn.add(menuBg);

    const menuText = this.add.text(0, 0, 'MAIN MENU', {
      fontFamily: 'Poppins, sans-serif',
      fontSize: '16px',
      fontStyle: 'bold',
      color: theme.textPrimary
    }).setOrigin(0.5);
    menuBtn.add(menuText);

    menuBtn.setSize(250, 52);
    menuBtn.setInteractive({ useHandCursor: true });

    menuBtn.on('pointerdown', () => {
      audioManager.playButtonClick();
      this.tweens.add({
        targets: menuBtn,
        scale: 0.95,
        duration: 80,
        yoyo: true,
        onComplete: () => {
          this.scene.start('MainMenuScene');
        }
      });
    });
  }
}
