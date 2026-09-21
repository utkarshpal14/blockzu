import { ACHIEVEMENT_CATALOG } from '../data/achievements';
import { AchievementDefinition } from '../types/Achievement';
import { AchievementData } from '../types/PlayerData';
import { SaveManager } from './SaveManager';

/**
 * ACHIEVEMENT MANAGER
 * Tracks progress, completion states, and coin reward claims for all 20 launch achievements.
 * Defined in Document 05.
 */
export class AchievementManager {
  private static instance: AchievementManager;
  private saveManager: SaveManager;

  private constructor() {
    this.saveManager = SaveManager.getInstance();
    this.initAchievements();
  }

  public static getInstance(): AchievementManager {
    if (!AchievementManager.instance) {
      AchievementManager.instance = new AchievementManager();
    }
    return AchievementManager.instance;
  }

  private initAchievements() {
    const data = this.saveManager.getData();
    if (!data.achievements || data.achievements.length === 0) {
      data.achievements = ACHIEVEMENT_CATALOG.map((def) => ({
        id: def.id,
        progress: 0,
        completed: false,
        claimed: false
      }));
      this.saveManager.save();
    }
  }

  public getAchievementDefinitions(): AchievementDefinition[] {
    return ACHIEVEMENT_CATALOG;
  }

  public getAchievementState(id: string): AchievementData | undefined {
    return this.saveManager.getData().achievements.find((a) => a.id === id);
  }

  public hasUnclaimedAchievements(): boolean {
    return this.getUnclaimedCount() > 0;
  }

  public getUnclaimedCount(): number {
    const data = this.saveManager.getData();
    if (!data.achievements) return 0;
    return data.achievements.filter((a) => a.completed && !a.claimed).length;
  }

  /**
   * Updates progress for a given achievement and checks completion.
   */
  public updateProgress(id: string, progressValue: number, isCumulative: boolean = false): boolean {
    const state = this.getAchievementState(id);
    const def = ACHIEVEMENT_CATALOG.find((d) => d.id === id);
    if (!state || !def || state.completed) return false;

    if (isCumulative) {
      state.progress += progressValue;
    } else {
      state.progress = Math.max(state.progress, progressValue);
    }

    if (state.progress >= def.target) {
      state.progress = def.target;
      state.completed = true;
      this.saveManager.save();
      return true; // Newly completed
    }

    this.saveManager.save();
    return false;
  }

  /**
   * Claims coins reward for a completed achievement.
   */
  public claimReward(id: string): boolean {
    const state = this.getAchievementState(id);
    const def = ACHIEVEMENT_CATALOG.find((d) => d.id === id);
    if (!state || !def || !state.completed || state.claimed) return false;

    state.claimed = true;
    if (def.rewardCoins > 0) {
      this.saveManager.addCoins(def.rewardCoins);
    }

    if (id === 'collector') {
      this.saveManager.unlockTheme('golden');
    }

    this.saveManager.save();
    return true;
  }
}
