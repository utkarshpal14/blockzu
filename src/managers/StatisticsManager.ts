import { SaveManager } from './SaveManager';
import { StatisticsData } from '../types/PlayerData';

/**
 * STATISTICS MANAGER
 * Tracks gameplay stats permanently in local save.
 * Defined in Document 02 (Section 13) & Document 07 (Section 10).
 */
export class StatisticsManager {
  private static instance: StatisticsManager;
  private saveManager: SaveManager;

  private constructor() {
    this.saveManager = SaveManager.getInstance();
  }

  public static getInstance(): StatisticsManager {
    if (!StatisticsManager.instance) {
      StatisticsManager.instance = new StatisticsManager();
    }
    return StatisticsManager.instance;
  }

  public getStats(): StatisticsData {
    return this.saveManager.getData().statistics;
  }

  public recordGameFinished(finalScore: number, linesClearedInGame: number, blocksPlacedInGame: number, maxComboInGame: number) {
    const stats = this.saveManager.getData().statistics;
    const profile = this.saveManager.getData().profile;

    profile.totalGamesPlayed++;
    stats.gamesPlayed++;
    stats.totalScore += finalScore;
    stats.linesCleared += linesClearedInGame;
    stats.blocksPlaced += blocksPlacedInGame;
    stats.longestCombo = Math.max(stats.longestCombo, maxComboInGame);
    stats.highestScore = Math.max(stats.highestScore, finalScore);
    stats.averageScore = Math.round(stats.totalScore / Math.max(stats.gamesPlayed, 1));

    this.saveManager.save();
  }
}
