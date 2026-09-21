import Phaser from 'phaser';
import { BoardManager } from '../managers/BoardManager';
import { PieceManager } from '../managers/PieceManager';
import { StatisticsManager } from '../managers/StatisticsManager';
import { AudioManager } from '../managers/AudioManager';
import { AdService } from '../services/AdService';

export interface SessionStats {
  score: number;
  linesCleared: number;
  blocksPlaced: number;
  maxCombo: number;
}

/**
 * GAME FLOW SYSTEM
 * Handles move availability solver, game over lifecycle, stats recording, and restart transitions.
 * Defined in Document 02, 03 & Milestone 5.
 */
export class GameFlowSystem {
  private scene: Phaser.Scene;
  private boardManager: BoardManager;
  private pieceManager: PieceManager;
  private statisticsManager: StatisticsManager;
  private audioManager: AudioManager;
  private adService: AdService;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.boardManager = BoardManager.getInstance();
    this.pieceManager = PieceManager.getInstance();
    this.statisticsManager = StatisticsManager.getInstance();
    this.audioManager = AudioManager.getInstance();
    this.adService = AdService.getInstance();
  }

  /**
   * Move Availability Solver:
   * Checks if ANY remaining non-null piece in the tray can fit anywhere on the current board.
   * Returns true if NO moves are possible (Game Over condition).
   */
  public isGameOver(): boolean {
    const activeSlots = this.pieceManager.getActiveSlots();
    const remainingPieces = activeSlots.filter((p) => p !== null);

    // If tray is empty, pieces are being generated, so not game over
    if (remainingPieces.length === 0) {
      return false;
    }

    // Check if at least one remaining piece can fit
    const hasAnyMove = remainingPieces.some((piece) => {
      if (!piece) return false;
      return this.boardManager.hasAnyValidPlacement(piece.cells);
    });

    return !hasAnyMove;
  }

  /**
   * Executes the Game Over sequence:
   * 1. Records match stats
   * 2. Plays game over audio
   * 3. Triggers AdService frequency logic
   * 4. Transitions to GameOverScene after 600ms delay
   */
  public triggerGameOver(stats: SessionStats, onTransitionStart?: () => void): void {
    console.info('[GameFlowSystem] Game Over detected. No valid moves remaining.');

    // 1. Record stats permanently
    this.statisticsManager.recordGameFinished(
      stats.score,
      stats.linesCleared,
      stats.blocksPlaced,
      stats.maxCombo
    );

    // 2. Audio feedback
    this.audioManager.playGameOver();

    // 3. Ad check (interstitial every 4th game over)
    this.adService.handleGameOver();

    if (onTransitionStart) {
      onTransitionStart();
    }

    // 4. Smooth 600ms delay before transitioning to GameOverScene
    this.scene.time.delayedCall(600, () => {
      this.scene.cameras.main.fade(300, 15, 23, 42, false, (camera: any, progress: number) => {
        if (progress === 1) {
          this.scene.scene.start('GameOverScene', stats);
        }
      });
    });
  }
}
