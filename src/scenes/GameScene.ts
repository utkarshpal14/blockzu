import Phaser from 'phaser';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../constants/gameplay';
import { ThemeManager } from '../managers/ThemeManager';
import { ScoreManager } from '../managers/ScoreManager';
import { AudioManager } from '../managers/AudioManager';
import { BoardManager } from '../managers/BoardManager';
import { PieceManager } from '../managers/PieceManager';
import { BoardView } from '../ui/components/BoardView';
import { TrayView } from '../ui/components/TrayView';
import { ClearSystem } from '../systems/ClearSystem';
import { FloatingText } from '../ui/components/FloatingText';
import { PieceDefinition } from '../types/Piece';

/**
 * GAME SCENE (Core Gameplay Loop)
 * Coordinates HUD, BoardView, TrayView, ClearSystem, and real-time scoring.
 * Defined in Document 02, 03, 04.
 */
export class GameScene extends Phaser.Scene {
  private boardManager!: BoardManager;
  private pieceManager!: PieceManager;
  private boardView!: BoardView;
  private trayView!: TrayView;
  private clearSystem!: ClearSystem;

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

    this.pieceManager = PieceManager.getInstance();
    this.pieceManager.reset();

    scoreManager.resetCurrentScore();

    // Background
    this.add.rectangle(width / 2, height / 2, width, height, Phaser.Display.Color.HexStringToColor(theme.background).color);

    // Top HUD Bar
    this.createHUD(width, theme);

    // 8x8 Board View
    this.boardView = new BoardView(this);

    // Clear & Combo System
    this.clearSystem = new ClearSystem(this, this.boardView);

    // 3-Piece Tray View
    this.trayView = new TrayView(
      this,
      this.boardView,
      (piece: PieceDefinition, row: number, col: number, onComplete: () => void) => {
        this.handlePiecePlaced(piece, row, col, onComplete);
      }
    );

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

  public getTrayView(): TrayView {
    return this.trayView;
  }

  public getClearSystem(): ClearSystem {
    return this.clearSystem;
  }

  /**
   * Coordinated placement lifecycle:
   * 1. Lock input
   * 2. Show placement score floater (+N)
   * 3. Evaluate lines with ClearSystem (scoring, screen shake, combo text, fast 200ms clear)
   * 4. Unlock input and trigger tray refill
   */
  private handlePiecePlaced(piece: PieceDefinition, row: number, col: number, onComplete: () => void) {
    const scoreManager = ScoreManager.getInstance();

    // 1. Lock Input
    this.trayView.setLocked(true);

    // 2. Update HUD
    this.updateHUD();

    // 3. Score popup for base block placement (+1, +4, +9)
    const cellPos = this.boardManager.getCellCenter(row, col);
    FloatingText.show(this, {
      x: cellPos.x,
      y: cellPos.y,
      text: `+${piece.blockCount}`,
      fontSize: '20px'
    });

    // 4. Evaluate Line Clears & Combos
    this.clearSystem.evaluateAndClearLines((result) => {
      if (result.hasCleared) {
        this.updateHUD();
      }

      // 5. Unlock Input & Proceed
      this.trayView.setLocked(false);
      onComplete();
    });
  }

  private updateHUD() {
    const scoreManager = ScoreManager.getInstance();
    this.scoreText.setText(`${scoreManager.getCurrentScore()}`);
    this.bestScoreText.setText(`${scoreManager.getBestScore()}`);
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
