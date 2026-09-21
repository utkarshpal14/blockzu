import Phaser from 'phaser';
import { SCREEN_SHAKE_DURATION } from '../constants/gameplay';
import { BoardManager } from '../managers/BoardManager';
import { ScoreManager } from '../managers/ScoreManager';
import { AudioManager } from '../managers/AudioManager';
import { BoardView } from '../ui/components/BoardView';
import { FloatingText } from '../ui/components/FloatingText';

export interface ClearEvaluationResult {
  hasCleared: boolean;
  linesCleared: number;
  clearedRows: number[];
  clearedCols: number[];
  scoreAwarded: number;
  comboName?: string;
}

/**
 * CLEAR SYSTEM
 * Coordinates line detection, combo calculation, screen shake, audio, and input locking.
 * Defined in Document 02, 03 & Milestone 4.
 */
export class ClearSystem {
  private scene: Phaser.Scene;
  private boardManager: BoardManager;
  private scoreManager: ScoreManager;
  private audioManager: AudioManager;
  private boardView: BoardView;

  private isBoardBusy: boolean = false;

  constructor(scene: Phaser.Scene, boardView: BoardView) {
    this.scene = scene;
    this.boardView = boardView;
    this.boardManager = BoardManager.getInstance();
    this.scoreManager = ScoreManager.getInstance();
    this.audioManager = AudioManager.getInstance();
  }

  public isBusy(): boolean {
    return this.isBoardBusy;
  }

  /**
   * Evaluates lines post-placement and executes the clear sequence if lines exist.
   */
  public evaluateAndClearLines(onComplete?: (result: ClearEvaluationResult) => void): boolean {
    const { rows, cols } = this.boardManager.findCompletedLines();
    const totalLines = rows.length + cols.length;

    if (totalLines === 0) {
      if (onComplete) {
        onComplete({
          hasCleared: false,
          linesCleared: 0,
          clearedRows: [],
          clearedCols: [],
          scoreAwarded: 0
        });
      }
      return false;
    }

    // 1. Lock Input during clear animation
    this.isBoardBusy = true;

    // 2. Score & Combo Calculation
    const { baseScore, comboBonus, totalScore } = this.scoreManager.addLineClearScore(totalLines);
    const comboName = this.getComboName(totalLines);

    // 3. Audio Triggers
    this.audioManager.playLineClear(totalLines);
    if (totalLines >= 2) {
      this.audioManager.playCombo();
    }

    // 4. Punchy Camera Screen Shake (100ms)
    this.triggerScreenShake(totalLines);

    // 5. Show Rewarding Floating Text / Combo Badge
    const boardCenterY = 315;
    const boardCenterX = 225;

    if (totalLines >= 2) {
      FloatingText.show(this.scene, {
        x: boardCenterX,
        y: boardCenterY,
        text: `${comboName} (+${totalScore})`,
        isCombo: true
      });
    } else {
      FloatingText.show(this.scene, {
        x: boardCenterX,
        y: boardCenterY,
        text: `+${totalScore}`,
        isCombo: false
      });
    }

    // 6. Fast 200ms Line Clear Animation & Particles
    this.boardView.animateLineClears(rows, cols, () => {
      // 7. Unlock Input after animation completion
      this.isBoardBusy = false;

      if (onComplete) {
        onComplete({
          hasCleared: true,
          linesCleared: totalLines,
          clearedRows: rows,
          clearedCols: cols,
          scoreAwarded: totalScore,
          comboName
        });
      }
    });

    return true;
  }

  /**
   * Standardized combo titles per Document 02 & specification.
   */
  private getComboName(lines: number): string {
    if (lines === 1) return 'NORMAL CLEAR';
    if (lines === 2) return 'COMBO x2';
    if (lines === 3) return 'MEGA COMBO x3';
    return 'ULTRA COMBO x4';
  }

  /**
   * Short, punchy screen shake scaling with line count.
   */
  private triggerScreenShake(lines: number) {
    let intensity = 0;
    if (lines === 2) intensity = 0.005; // ~2px
    else if (lines === 3) intensity = 0.010; // ~4px
    else if (lines >= 4) intensity = 0.016; // ~6px+

    if (intensity > 0) {
      this.scene.cameras.main.shake(SCREEN_SHAKE_DURATION, intensity);
    }
  }
}
