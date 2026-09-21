/**
 * AD SERVICE
 * Mock / Production adapter interface for Google AdMob and AdSense.
 * Ad rules specified in Document 06 (Monetization Strategy).
 */
export class AdService {
  private static instance: AdService;
  private gameOverCount: number = 0;
  private lastInterstitialTime: number = 0;
  private dailyRewardedAdsWatched: number = 0;

  private constructor() {}

  public static getInstance(): AdService {
    if (!AdService.instance) {
      AdService.instance = new AdService();
    }
    return AdService.instance;
  }

  /**
   * Called on each game over. Triggers interstitial every 4th game over.
   */
  public handleGameOver(): boolean {
    this.gameOverCount++;
    const now = Date.now();
    // Rule: Every 4th game over AND at least 3 minutes between interstitials
    if (this.gameOverCount % 4 === 0 && now - this.lastInterstitialTime > 180000) {
      this.lastInterstitialTime = now;
      this.showInterstitialAd();
      return true;
    }
    return false;
  }

  public showInterstitialAd() {
    console.info('[AdService] Showing Interstitial Ad (Triggered on Game Over).');
  }

  /**
   * Shows rewarded ad for continue or coins.
   */
  public showRewardedAd(onRewardGranted: () => void, onFailure?: () => void) {
    if (this.dailyRewardedAdsWatched >= 5) {
      console.warn('[AdService] Daily rewarded ad limit reached.');
      if (onFailure) onFailure();
      return;
    }

    console.info('[AdService] Simulating Rewarded Ad...');
    setTimeout(() => {
      this.dailyRewardedAdsWatched++;
      onRewardGranted();
    }, 500);
  }

  public getDailyRewardedCount(): number {
    return this.dailyRewardedAdsWatched;
  }
}
