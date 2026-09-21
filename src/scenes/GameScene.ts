import Phaser from 'phaser';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../constants/gameplay';
import { ThemeManager } from '../managers/ThemeManager';
import { ScoreManager } from '../managers/ScoreManager';
import { AudioManager } from '../managers/AudioManager';
import { BoardManager } from '../managers/BoardManager';
import { BoardView } from '../ui/components/BoardView';

/**
 * GAME SCENE (Core Gameplay Loop)
 * Defined in Document 02, 03, 04.
 */
export class GameScene extends Phaser.Scene {
  private boardManager!: BoardManager;
  private boardView!: BoardView;
  private scoreText!: Phaser.GameObjects.Text;
  private bestScoreText!: Phaser.GameObjects.Text;

  constructor() {
    super('GameScene');
  }

  create() {
    const width = this.scale.width || CANVAS_WIDTH;
    const height = this.scale.height || CANVAS_HEIGHT;
    const theme = ThemeManager.getInstance().getActiveColors();
    const scoreManager = ScoreManager.getInstance();
    const audioManager = AudioManager.getInstance();

    this.boardManager = BoardManager.getInstance();
    this.boardManager.reset();
    scoreManager.resetCurrentScore();

    // Background
    this.add.rectangle(width / 2, height / 2, width, height, Phaser.Display.Color.HexStringToColor(theme.background).color);

    // Top HUD Bar
    this.createHUD(width, theme);

    // 8x8 Board View
    this.boardView = new BoardView(this);

    // Home / Menu button
    const homeBtn = this.add.text(40, 48, '←', {
      fontFamily: 'Poppins, sans-serif',
      fontSize: '28px',
      color: theme.textPrimary
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    homeBtn.on('pointerdown', () => {
      audioManager.playButtonClick();
      this.scene.start('MainMenuScene');
    });
  }

  public getBoardView(): BoardView {
    return this.boardView;
  }

  public getBoardManager(): BoardManager {
    return this.boardManager;
  }

  private createHUD(width: number, theme: any) {
    const scoreManager = ScoreManager.getInstance();

    // Score Card
    const scoreCard = this.add.graphics();
    scoreCard.fillStyle(Phaser.Display.Color.HexStringToColor(theme.cardBackground).color, 0.95);
    scoreCard.lineStyle(1.5, Phaser.Display.Color.HexStringToColor(theme.cellEmpty).color, 0.6);
    scoreCard.fillRoundedRect(width / 2 - 130, 24, 120, 56, 12);
    scoreCard.strokeRoundedRect(width / 2 - 130, 24, 120, 56, 12);

    this.add.text(width / 2 - 70, 38, 'SCORE', {
      fontFamily: 'Poppins, sans-serif',
      fontSize: '11px',
      fontStyle: 'bold',
      color: theme.textSecondary
    }).setOrigin(0.5);

    this.scoreText = this.add.text(width / 2 - 70, 60, `${scoreManager.getCurrentScore()}`, {
      fontFamily: 'Poppins, sans-serif',
      fontSize: '20px',
      fontStyle: 'bold',
      color: theme.textPrimary
    }).setOrigin(0.5);

    // Best Score Card
    const bestCard = this.add.graphics();
    bestCard.fillStyle(Phaser.Display.Color.HexStringToColor(theme.cardBackground).color, 0.95);
    bestCard.lineStyle(1.5, Phaser.Display.Color.HexStringToColor(theme.cellEmpty).color, 0.6);
    bestCard.fillRoundedRect(width / 2 + 10, 24, 120, 56, 12);
    bestCard.strokeRoundedRect(width / 2 + 10, 24, 120, 56, 12);

    this.add.text(width / 2 + 70, 38, 'BEST', {
      fontFamily: 'Poppins, sans-serif',
      fontSize: '11px',
      fontStyle: 'bold',
      color: theme.textSecondary
    }).setOrigin(0.5);

    this.bestScoreText = this.add.text(width / 2 + 70, 60, `${scoreManager.getBestScore()}`, {
      fontFamily: 'Poppins, sans-serif',
      fontSize: '20px',
      fontStyle: 'bold',
      color: theme.textPrimary
    }).setOrigin(0.5);
  }
}
