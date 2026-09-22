import { SaveManager } from './SaveManager';
import { BetaAnalyticsData, MonetizationAnalyticsData } from '../types/PlayerData';

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
  monetization: {
    rewardedAdsStarted: number;
    rewardedAdsCompleted: number;
    rewardedAdsSkipped: number;
    interstitialsShown: number;
    freeCoinsClaimed: number;
    revivesUsed: number;
    admobEvents: number;
    adsenseEvents: number;
    completionRate: string;
  };
  economy: {
    currentCoins: number;
    totalCoinsEarned: number;
  };
  timestamp: string;
}

/**
 * ANALYTICS MANAGER (Milestone 11.5 — Beta & Monetization Analytics)
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
        lastSessionTimestamp: Date.now(),
        monetization: {
          rewardedAdsStarted: 0,
          rewardedAdsCompleted: 0,
          rewardedAdsSkipped: 0,
          interstitialsShown: 0,
          freeCoinsClaimed: 0,
          revivesUsed: 0,
          admobEvents: 0,
          adsenseEvents: 0
        }
      };
      this.saveManager.save();
    }

    if (!data.analytics.monetization) {
      data.analytics.monetization = {
        rewardedAdsStarted: 0,
        rewardedAdsCompleted: 0,
        rewardedAdsSkipped: 0,
        interstitialsShown: 0,
        freeCoinsClaimed: 0,
        revivesUsed: 0,
        admobEvents: 0,
        adsenseEvents: 0
      };
      this.saveManager.save();
    }

    return data.analytics;
  }

  public getAnalytics(): BetaAnalyticsData {
    return this.ensureAnalyticsInitialized();
  }

  public getMonetizationData(): MonetizationAnalyticsData {
    const analytics = this.ensureAnalyticsInitialized();
    return analytics.monetization!;
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
    if (analytics.monetization) {
      analytics.monetization.revivesUsed += 1;
    }
    this.saveManager.save();
  }

  /**
   * 5. Monetization Ad Events
   */
  public recordAdStarted(format: 'rewarded' | 'interstitial', network: 'admob' | 'adsense' | 'fallback'): void {
    const mon = this.getMonetizationData();
    if (format === 'rewarded') {
      mon.rewardedAdsStarted += 1;
    }
    if (network === 'admob') {
      mon.admobEvents += 1;
    } else if (network === 'adsense') {
      mon.adsenseEvents += 1;
    }
    this.saveManager.save();
  }

  public recordAdCompleted(
    format: 'rewarded' | 'interstitial',
    network: 'admob' | 'adsense' | 'fallback',
    rewardType?: 'coins' | 'revive'
  ): void {
    const mon = this.getMonetizationData();
    if (format === 'rewarded') {
      mon.rewardedAdsCompleted += 1;
      if (rewardType === 'coins') {
        mon.freeCoinsClaimed += 1;
      }
    } else if (format === 'interstitial') {
      mon.interstitialsShown += 1;
    }

    if (network === 'admob') {
      mon.admobEvents += 1;
    } else if (network === 'adsense') {
      mon.adsenseEvents += 1;
    }
    this.saveManager.save();
  }

  public recordAdSkipped(format: 'rewarded' | 'interstitial'): void {
    const mon = this.getMonetizationData();
    if (format === 'rewarded') {
      mon.rewardedAdsSkipped += 1;
    }
    this.saveManager.save();
  }

  /**
   * 6. Session Length Tracking
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
    const mon = this.getMonetizationData();
    const economy = this.saveManager.getData().economy;
    const metadata = this.saveManager.getMetadata();

    const completionRatePct = mon.rewardedAdsStarted > 0
      ? `${Math.round((mon.rewardedAdsCompleted / mon.rewardedAdsStarted) * 100)}%`
      : '100%';

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
      monetization: {
        rewardedAdsStarted: mon.rewardedAdsStarted,
        rewardedAdsCompleted: mon.rewardedAdsCompleted,
        rewardedAdsSkipped: mon.rewardedAdsSkipped,
        interstitialsShown: mon.interstitialsShown,
        freeCoinsClaimed: mon.freeCoinsClaimed,
        revivesUsed: mon.revivesUsed,
        admobEvents: mon.admobEvents,
        adsenseEvents: mon.adsenseEvents,
        completionRate: completionRatePct
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
