import { SaveManager } from './SaveManager';

export interface DailyRewardTier {
  day: number;
  coins: number;
  icon: string;
}

export const DAILY_REWARD_SCHEDULE: DailyRewardTier[] = [
  { day: 1, coins: 50, icon: '🪙' },
  { day: 2, coins: 75, icon: '🪙' },
  { day: 3, coins: 100, icon: '🪙' },
  { day: 4, coins: 150, icon: '🪙' },
  { day: 5, coins: 200, icon: '💰' },
  { day: 6, coins: 300, icon: '💰' },
  { day: 7, coins: 500, icon: '👑' }
];

const CLAIM_COOLDOWN_MS = 20 * 60 * 60 * 1000; // 20 hours (standard mobile daily grace window)
const STREAK_EXPIRY_MS = 48 * 60 * 60 * 1000;  // 48 hours to preserve streak

/**
 * DAILY REWARD MANAGER
 * Manages 7-day login streak, rewards calculation, timer countdowns, and persistence.
 * Milestone 7.4 (Progression System).
 */
export class DailyRewardManager {
  private static instance: DailyRewardManager;
  private saveManager: SaveManager;

  private constructor() {
    this.saveManager = SaveManager.getInstance();
  }

  public static getInstance(): DailyRewardManager {
    if (!DailyRewardManager.instance) {
      DailyRewardManager.instance = new DailyRewardManager();
    }
    return DailyRewardManager.instance;
  }

  private getDailyData() {
    const data = this.saveManager.getData();
    if (!data.dailyReward) {
      data.dailyReward = { lastClaimTime: 0, currentStreak: 0 };
    }
    return data.dailyReward;
  }

  /**
   * Checks if player can claim today's daily reward.
   */
  public isRewardAvailable(): boolean {
    const daily = this.getDailyData();
    if (daily.lastClaimTime === 0) return true; // Never claimed before

    const elapsed = Date.now() - daily.lastClaimTime;
    return elapsed >= CLAIM_COOLDOWN_MS;
  }

  /**
   * Returns the current day index (1-7) that is eligible for claim.
   */
  public getEligibleDay(): number {
    const daily = this.getDailyData();
    if (daily.lastClaimTime === 0) return 1;

    const elapsed = Date.now() - daily.lastClaimTime;
    if (elapsed > STREAK_EXPIRY_MS) {
      return 1; // Streak broken, restart at day 1
    }

    if (this.isRewardAvailable()) {
      return (daily.currentStreak % 7) + 1;
    }

    return daily.currentStreak === 0 ? 1 : daily.currentStreak;
  }

  /**
   * Returns time remaining until next claim in ms (0 if available now).
   */
  public getTimeUntilNextClaimMs(): number {
    if (this.isRewardAvailable()) return 0;
    const daily = this.getDailyData();
    const remaining = CLAIM_COOLDOWN_MS - (Date.now() - daily.lastClaimTime);
    return Math.max(0, remaining);
  }

  /**
   * Claims today's daily reward and adds coins to player economy.
   */
  public claimDailyReward(): { day: number; coins: number } | null {
    if (!this.isRewardAvailable()) return null;

    const targetDay = this.getEligibleDay();
    const rewardTier = DAILY_REWARD_SCHEDULE.find((r) => r.day === targetDay) || DAILY_REWARD_SCHEDULE[0];

    const daily = this.getDailyData();
    daily.lastClaimTime = Date.now();
    daily.currentStreak = targetDay;

    this.saveManager.addCoins(rewardTier.coins);
    this.saveManager.save();

    return { day: targetDay, coins: rewardTier.coins };
  }
}
