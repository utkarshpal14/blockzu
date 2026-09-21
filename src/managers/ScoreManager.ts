import { POINTS_PER_BLOCK, POINTS_PER_LINE, COMBO_MULTIPLIER_PER_LINE } from '../constants/gameplay';
import { LineClearResult } from '../types/Board';
import { SaveManager } from './SaveManager';

/**
 * SCORE MANAGER
 * Handles score calculations for placements, line clears, and combos.
 * Defined in Document 02 (Section 11).
 */
export class ScoreManager {
  private static instance: ScoreManager;
  private currentScore: number = 0;
  private saveManager: SaveManager;

  private constructor() {
    this.saveManager = SaveManager.getInstance();
  }

  public static getInstance(): ScoreManager {
    if (!ScoreManager.instance) {
      ScoreManager.instance = new ScoreManager();
    }
    return ScoreManager.instance;
  }

  public resetCurrentScore() {
    this.currentScore = 0;
  }

  public getCurrentScore(): number {
    return this.currentScore;
  }

  public getBestScore(): number {
    return this.saveManager.getBestScore();
  }

  /**
   * Adds points for placing a piece (+1 per filled block tile).
   */
  public addPlacementScore(blockCount: number): number {
    const points = blockCount * POINTS_PER_BLOCK;
    this.currentScore += points;
    this.saveManager.updateScore(this.currentScore);
    return points;
  }

  /**
   * Calculates and adds score for cleared lines with combo multiplier.
   */
  public addLineClearScore(clearedCount: number): { baseScore: number; comboBonus: number; totalScore: number } {
    if (clearedCount <= 0) return { baseScore: 0, comboBonus: 0, totalScore: 0 };

    const baseScore = clearedCount * POINTS_PER_LINE;
    const comboBonus = clearedCount >= 2 ? clearedCount * COMBO_MULTIPLIER_PER_LINE : 0;
    const totalScore = baseScore + comboBonus;

    this.currentScore += totalScore;
    this.saveManager.updateScore(this.currentScore);

    return { baseScore, comboBonus, totalScore };
  }
}
