import Phaser from 'phaser';
import { SaveManager } from './SaveManager';
import { AudioManager } from './AudioManager';
import { RewardedAdModal } from '../ui/modals/RewardedAdModal';

export type AdRewardType = 'revive' | 'coins';

/**
 * AD MANAGER
 * Central monetization controller enforcing Document 06 frequency rules:
 * - Interstitials: Shown ONLY on every 4th Game Over, minimum 3-minute cooldown.
 * - Rewarded Ads:
 *   - Revive: 1 per game match.
 *   - Free Coins: +50 Coins per video, max 5/day (250 coins/day limit).
 * - Multi-platform support: Web/PWA simulated interactive video player + AdMob native hooks.
 */
export class AdManager {
  private static instance: AdManager;
  private saveManager: SaveManager;
  private audioManager: AudioManager;

  private constructor() {
    this.saveManager = SaveManager.getInstance();
    this.audioManager = AudioManager.getInstance();
  }

  public static getInstance(): AdManager {
    if (!AdManager.instance) {
      AdManager.instance = new AdManager();
    }
    return AdManager.instance;
  }

  /**
   * Evaluates and triggers an interstitial ad on Game Over if criteria met:
   * 1. 4 matches played since last interstitial.
   * 2. At least 3 minutes elapsed since last interstitial.
   */
  public handleMatchFinished(scene: Phaser.Scene, onComplete?: () => void): boolean {
    const shouldShow = this.saveManager.recordMatchFinished();
    if (shouldShow) {
      this.showInterstitialAd(scene, onComplete);
      return true;
    } else {
      if (onComplete) onComplete();
      return false;
    }
  }

  /**
   * Shows an interstitial ad with sound management.
   */
  public showInterstitialAd(scene: Phaser.Scene, onComplete?: () => void) {
    this.saveManager.recordInterstitialShown();

    // Show simulated ad modal on web/PWA
    new RewardedAdModal(
      scene,
      'Sponsored Interstitial',
      'Supporting free casual gaming for everyone',
      5,
      (completed) => {
        if (onComplete) onComplete();
      },
      false // not a rewarded claim
    );
  }

  /**
   * Shows a rewarded ad for either Revive or Free 50 Coins.
   */
  public showRewardedAd(scene: Phaser.Scene, type: AdRewardType, onResult: (success: boolean) => void) {
    if (type === 'coins' && !this.saveManager.canWatchRewardedAd()) {
      onResult(false);
      return;
    }

    const title = type === 'revive' ? 'Watch Ad to Continue Match' : 'Watch Ad for +50 🪙 Coins';
    const subtitle = type === 'revive' ? 'Resume with your active score and fresh pieces!' : 'Earn free gold coins to unlock premium themes!';

    new RewardedAdModal(
      scene,
      title,
      subtitle,
      5,
      (completed) => {
        if (completed) {
          if (type === 'coins') {
            this.saveManager.addCoins(50);
            this.saveManager.recordRewardedAdWatched();
          }
          onResult(true);
        } else {
          onResult(false);
        }
      },
      true // is rewarded ad
    );
  }

  public getRemainingRewardedCoinsAds(): number {
    return this.saveManager.getRemainingRewardedAdsToday();
  }

  public canWatchRewardedAd(): boolean {
    return this.saveManager.canWatchRewardedAd();
  }
}
