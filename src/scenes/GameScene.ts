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
import { GameFlowSystem, SessionStats } from '../systems/GameFlowSystem';
import { FloatingText } from '../ui/components/FloatingText';
import { PieceDefinition } from '../types/Piece';

/**
 * GAME SCENE (Core Gameplay Loop)
 * Coordinates HUD, BoardView, TrayView, ClearSystem, GameFlowSystem, and real-time lifecycle.
 * Defined in Document 02, 03, 04, 05.
 */
export class GameScene extends Phaser.Scene {
  private boardManager!: BoardManager;
  private pieceManager!: PieceManager;
  private boardView!: BoardView;
  private trayView!: TrayView;
  private clearSystem!: ClearSystem;
  private gameFlowSystem!: GameFlowSystem;

  private scoreText!: Phaser.GameObjects.Text;
  private bestScoreText!: Phaser.GameObjects.Text;

  // Session Statistics
  private sessionLinesCleared: number = 0;
  private sessionBlocksPlaced: number = 0;
  private sessionMaxCombo: number = 0;

  constructor() {
    super('GameScene');
  }

  create() {
    const width = this.scale.width || CANVAS_WIDTH;
    const height = this.scale.height || CANVAS_HEIGHT;
    const theme = ThemeManager.getInstance().getActiveColors();
    const scoreManager = ScoreManager.getInstance();
    const audioManager = AudioManager.getInstance();

    // Reset session trackers
    this.sessionLinesCleared = 0;
    this.sessionBlocksPlaced = 0;
    this.sessionMaxCombo = 0;

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

    // Systems
    this.clearSystem = new ClearSystem(this, this.boardView);
    this.gameFlowSystem = new GameFlowSystem(this);

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

  public getSessionStats(): SessionStats {
    const scoreManager = ScoreManager.getInstance();
    return {
      score: scoreManager.getCurrentScore(),
      linesCleared: this.sessionLinesCleared,
      blocksPlaced: this.sessionBlocksPlaced,
      maxCombo: this.sessionMaxCombo
    };
  }

  /**
   * Coordinated Placement Lifecycle:
   * 1. Lock Input
   * 2. Increment stats & spawn placement score floater (+N)
   * 3. Clear lines via ClearSystem (flash 50ms -> shrink 100ms -> fade 50ms)
   * 4. Trigger tray refill if empty
   * 5. Run Game Over Solver on the updated & cleared board state
   * 6. Unlock Input if moves exist OR trigger Game Over if 0 moves exist!
   */
  private handlePiecePlaced(piece: PieceDefinition, row: number, col: number, onComplete: () => void) {
    // 1. Lock Input
    this.trayView.setLocked(true);
    this.sessionBlocksPlaced += piece.blockCount;

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
        this.sessionLinesCleared += result.linesCleared;
        this.sessionMaxCombo = Math.max(this.sessionMaxCombo, result.linesCleared);
        this.updateHUD();
      }

      // 5. Trigger Tray Refill (if tray was emptied by this placement)
      onComplete();

      // 6. Move Availability Solver (Checks remaining pieces against updated board)
      this.time.delayedCall(100, () => {
        if (this.gameFlowSystem.isGameOver()) {
          this.trayView.setLocked(true);
          this.gameFlowSystem.triggerGameOver(this.getSessionStats());
        } else {
          // Moves available: Unlock input and continue playing!
          this.trayView.setLocked(false);
        }
      });
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
