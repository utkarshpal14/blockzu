import { SaveManager } from './SaveManager';
import { BetaAnalyticsData } from '../types/PlayerData';

export interface AnalyticsSummaryReport {
  metrics: {
    averageScore: number;
    gamesPlayed: number;
    themesPurchased: number;
    achievementsClaimed: number;
    revivesUsed: number;
    totalSessionTimeSeconds: number;
    totalSessionTimeFormatted: string;
    averageSessionLengthSeconds: number;
    averageSessionLengthFormatted: string;
    sessionCount: number;
    lastSessionLengthSeconds: number;
  };
  economy: {
    currentCoins: number;
    totalCoinsEarned: number;
  };
  timestamp: string;
}

/**
 * ANALYTICS MANAGER (Milestone 11.5 — Beta Analytics)
 * Captures core player progression, monetization, and retention telemetry locally.
 * Pre-launch telemetry single source of truth.
 */
export class AnalyticsManager {
  private static instance: AnalyticsManager;
  private saveManager: SaveManager;

  private constructor() {
    this.saveManager = SaveManager.getInstance();
    this.ensureAnalyticsInitialized();

    // Mount to global window for easy dev / beta tester console telemetry inspection
    if (typeof window !== 'undefined') {
      (window as any).blockzuAnalytics = this;
    }
  }

  public static getInstance(): AnalyticsManager {
    if (!AnalyticsManager.instance) {
      AnalyticsManager.instance = new AnalyticsManager();
    }
    return AnalyticsManager.instance;
  }

  private ensureAnalyticsInitialized(): BetaAnalyticsData {
    const data = this.saveManager.getData();
    if (!data.analytics) {
      data.analytics = {
        averageScore: data.statistics?.averageScore || 0,
        gamesPlayed: data.statistics?.gamesPlayed || 0,
        themesPurchased: Math.max(0, (data.themes?.unlockedThemes?.length || 1) - 1),
        achievementsClaimed: data.achievements?.filter((a) => a.claimed)?.length || 0,
        revivesUsed: 0,
        totalSessionTimeSeconds: data.metadata?.totalPlayTime || 0,
        sessionCount: 1,
        averageSessionLengthSeconds: data.metadata?.totalPlayTime || 0,
        lastSessionLengthSeconds: 0,
        lastSessionTimestamp: Date.now()
      };
      this.saveManager.save();
    }
    return data.analytics;
  }

  public getAnalytics(): BetaAnalyticsData {
    return this.ensureAnalyticsInitialized();
  }

  /**
   * 1. Average Score & Games Played
   * Synchronized whenever a match ends.
   */
  public recordGameFinished(finalScore: number): void {
    const analytics = this.getAnalytics();
    const stats = this.saveManager.getData().statistics;

    analytics.gamesPlayed = stats.gamesPlayed;
    analytics.averageScore = stats.averageScore;

    this.saveManager.save();
  }

  /**
   * 2. Themes Purchased
   * Triggered on successful store theme unlock with coins.
   */
  public recordThemePurchased(themeId: string, cost: number): void {
    const analytics = this.getAnalytics();
    analytics.themesPurchased += 1;
    this.saveManager.save();
  }

  /**
   * 3. Achievements Claimed
   * Triggered when reward coins/trophies are claimed.
   */
  public recordAchievementClaimed(achievementId: string, rewardCoins: number): void {
    const analytics = this.getAnalytics();
    analytics.achievementsClaimed += 1;
    this.saveManager.save();
  }

  /**
   * 4. Revives Used
   * Triggered when a rewarded revive continue is activated.
   */
  public recordReviveUsed(): void {
    const analytics = this.getAnalytics();
    analytics.revivesUsed += 1;
    this.saveManager.save();
  }

  /**
   * 5. Session Length Tracking
   * Accrues active elapsed play time into lifetime and session stats.
   */
  public recordSessionTime(elapsedSeconds: number): void {
    const analytics = this.getAnalytics();
    const validSec = Math.max(0, Math.floor(elapsedSeconds));
    analytics.totalSessionTimeSeconds += validSec;
    analytics.lastSessionLengthSeconds += validSec;
    analytics.averageSessionLengthSeconds = Math.round(
      analytics.totalSessionTimeSeconds / Math.max(1, analytics.sessionCount)
    );
    this.saveManager.save();
  }

  public startNewSession(): void {
    const analytics = this.getAnalytics();
    analytics.sessionCount += 1;
    analytics.lastSessionLengthSeconds = 0;
    analytics.lastSessionTimestamp = Date.now();
    this.saveManager.save();
  }

  public formatDuration(seconds: number): string {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) return `${hrs}h ${mins}m ${secs}s`;
    if (mins > 0) return `${mins}m ${secs}s`;
    return `${secs}s`;
  }

  /**
   * Compiles complete beta telemetry summary report for inspection or export.
   */
  public getSummaryReport(): AnalyticsSummaryReport {
    const analytics = this.getAnalytics();
    const economy = this.saveManager.getData().economy;
    const metadata = this.saveManager.getMetadata();

    return {
      metrics: {
        averageScore: analytics.averageScore,
        gamesPlayed: analytics.gamesPlayed,
        themesPurchased: analytics.themesPurchased,
        achievementsClaimed: analytics.achievementsClaimed,
        revivesUsed: analytics.revivesUsed,
        totalSessionTimeSeconds: analytics.totalSessionTimeSeconds,
        totalSessionTimeFormatted: this.formatDuration(analytics.totalSessionTimeSeconds),
        averageSessionLengthSeconds: analytics.averageSessionLengthSeconds,
        averageSessionLengthFormatted: this.formatDuration(analytics.averageSessionLengthSeconds),
        sessionCount: analytics.sessionCount,
        lastSessionLengthSeconds: analytics.lastSessionLengthSeconds
      },
      economy: {
        currentCoins: economy.coins,
        totalCoinsEarned: metadata.totalCoinsEarned
      },
      timestamp: new Date().toISOString()
    };
  }

  public exportJSON(): string {
    return JSON.stringify(this.getSummaryReport(), null, 2);
  }
}
