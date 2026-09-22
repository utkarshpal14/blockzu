import type Phaser from 'phaser';
import { Capacitor } from '@capacitor/core';
import {
  AdMob,
  AdMobRewardItem,
  BannerAdOptions,
  BannerAdPosition,
  BannerAdSize,
  RewardAdPluginEvents,
  AdmobConsentStatus
} from '@capacitor-community/admob';
import { SaveManager } from './SaveManager';
import { AudioManager } from './AudioManager';
import { AnalyticsManager } from './AnalyticsManager';
import { MONETIZATION_CONFIG } from '../constants/monetization';

export type AdRewardType = 'revive' | 'coins';

/**
 * AD MANAGER
 * Dual-Platform Monetization Controller:
 * 1. Native Android Mobile: Google AdMob SDK via @capacitor-community/admob
 * 2. Web / PWA Desktop & Mobile: Google AdSense / H5 Game Ads with high-polish interactive fallback.
 * 
 * Enforces strict player-friendly frequency rules:
 * - Interstitials: Shown ONLY on every 4th Game Over with minimum 3-minute cooldown.
 * - Rewarded Revive: 1 per game match.
 * - Rewarded Free Coins: +50 Coins per video, max 5/day (250 coins/day cap).
 */
export class AdManager {
  private static instance: AdManager;
  private saveManager: SaveManager;
  private audioManager: AudioManager;
  private analyticsManager: AnalyticsManager;

  private isNative: boolean = false;
  private isAdMobInitialized: boolean = false;
  private isRewardedAdReady: boolean = false;
  private isInterstitialReady: boolean = false;
  private isBannerShowing: boolean = false;

  private constructor() {
    this.saveManager = SaveManager.getInstance();
    this.audioManager = AudioManager.getInstance();
    this.analyticsManager = AnalyticsManager.getInstance();

    this.isNative = Capacitor.isNativePlatform();
    this.initializeMonetization();
  }

  public static getInstance(): AdManager {
    if (!AdManager.instance) {
      AdManager.instance = new AdManager();
    }
    return AdManager.instance;
  }

  /**
   * Initializes monetization SDKs based on active platform.
   */
  public async initializeMonetization(): Promise<void> {
    if (this.isNative) {
      try {
        await AdMob.initialize({
          initializeForTesting: MONETIZATION_CONFIG.isTesting
        });
        this.isAdMobInitialized = true;
        this.setupAdMobListeners();
        this.preloadAds();
      } catch (err) {
        console.warn('[AdManager] Native AdMob initialization notice:', err);
      }
    } else {
      // Web / PWA Environment
      if (typeof window !== 'undefined') {
        // Initialize AdSense H5 Game Ads adBreak configuration if present
        if ((window as any).adConfig) {
          try {
            (window as any).adConfig({
              preloadAdBreaks: 'on',
              sound: 'on'
            });
          } catch (e) {
            // Ignore if script still loading
          }
        }
      }
    }
  }

  /**
   * Pre-caches rewarded and interstitial ads on native device for instant presentation.
   */
  private async preloadAds(): Promise<void> {
    if (!this.isNative || !this.isAdMobInitialized) return;

    // 1. Preload Rewarded Video
    try {
      await AdMob.prepareRewardVideoAd({
        adId: MONETIZATION_CONFIG.admob.units.rewarded,
        isTesting: MONETIZATION_CONFIG.isTesting
      });
      this.isRewardedAdReady = true;
    } catch (e) {
      this.isRewardedAdReady = false;
    }

    // 2. Preload Interstitial
    try {
      await AdMob.prepareInterstitial({
        adId: MONETIZATION_CONFIG.admob.units.interstitial,
        isTesting: MONETIZATION_CONFIG.isTesting
      });
      this.isInterstitialReady = true;
    } catch (e) {
      this.isInterstitialReady = false;
    }
  }

  /**
   * Registers native AdMob event listeners.
   */
  private setupAdMobListeners(): void {
    try {
      AdMob.addListener(RewardAdPluginEvents.Loaded, () => {
        this.isRewardedAdReady = true;
      });

      AdMob.addListener(RewardAdPluginEvents.FailedToLoad, () => {
        this.isRewardedAdReady = false;
      });

      AdMob.addListener(RewardAdPluginEvents.Dismissed, () => {
        this.isRewardedAdReady = false;
        // Background reload next rewarded video
        this.preloadAds();
      });
    } catch (e) {
      // Ignore if listeners already registered
    }
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
   * Shows an interstitial ad with audio protection and dual-platform routing.
   */
  public async showInterstitialAd(scene: Phaser.Scene, onComplete?: () => void): Promise<void> {
    this.saveManager.recordInterstitialShown();

    // ------------------------------------------------------------------------
    // A. NATIVE ANDROID ADMOB INTERSTITIAL
    // ------------------------------------------------------------------------
    if (this.isNative && this.isAdMobInitialized) {
      this.analyticsManager.recordAdStarted('interstitial', 'admob');
      try {
        if (!this.isInterstitialReady) {
          await AdMob.prepareInterstitial({
            adId: MONETIZATION_CONFIG.admob.units.interstitial,
            isTesting: MONETIZATION_CONFIG.isTesting
          });
        }
        await AdMob.showInterstitial();
        this.analyticsManager.recordAdCompleted('interstitial', 'admob');
        this.preloadAds();
        if (onComplete) onComplete();
        return;
      } catch (nativeError) {
        console.warn('[AdManager] Native Interstitial fallback to modal:', nativeError);
      }
    }

    // ------------------------------------------------------------------------
    // B. WEB ADSENSE H5 GAME ADS INTERSTITIAL
    // ------------------------------------------------------------------------
    if (!this.isNative && typeof window !== 'undefined' && (window as any).adBreak) {
      this.analyticsManager.recordAdStarted('interstitial', 'adsense');
      let adShowed = false;
      try {
        (window as any).adBreak({
          type: 'next',
          name: 'game_over_interstitial',
          beforeAd: () => {
            adShowed = true;
          },
          afterAd: () => {
            this.analyticsManager.recordAdCompleted('interstitial', 'adsense');
            if (onComplete) onComplete();
          },
          adBreakDone: (placementInfo: any) => {
            if (!adShowed && placementInfo?.breakStatus === 'notReady') {
              // AdSense had no fill, trigger modal fallback
              this.showFallbackInterstitialModal(scene, onComplete);
            }
          }
        });
        return;
      } catch (webAdError) {
        console.warn('[AdManager] Web AdSense break notice:', webAdError);
      }
    }

    // ------------------------------------------------------------------------
    // C. HIGH-POLISH INTERACTIVE FALLBACK MODAL
    // ------------------------------------------------------------------------
    this.showFallbackInterstitialModal(scene, onComplete);
  }

  private async showFallbackInterstitialModal(scene: Phaser.Scene, onComplete?: () => void): Promise<void> {
    this.analyticsManager.recordAdStarted('interstitial', 'fallback');
    try {
      const { RewardedAdModal } = await import('../ui/modals/RewardedAdModal');
      new RewardedAdModal(
        scene,
        'Sponsored Interstitial',
        'Supporting free casual gaming for everyone',
        5,
        () => {
          this.analyticsManager.recordAdCompleted('interstitial', 'fallback');
          if (onComplete) onComplete();
        },
        false // non-rewarded
      );
    } catch (e) {
      if (onComplete) onComplete();
    }
  }

  /**
   * Shows a rewarded ad for either Revive or Free 50 Coins.
   */
  public async showRewardedAd(
    scene: Phaser.Scene,
    type: AdRewardType,
    onResult: (success: boolean) => void
  ): Promise<void> {
    if (type === 'coins' && !this.saveManager.canWatchRewardedAd()) {
      onResult(false);
      return;
    }

    // ------------------------------------------------------------------------
    // A. NATIVE ANDROID ADMOB REWARDED VIDEO
    // ------------------------------------------------------------------------
    if (this.isNative && this.isAdMobInitialized) {
      this.analyticsManager.recordAdStarted('rewarded', 'admob');
      try {
        if (!this.isRewardedAdReady) {
          await AdMob.prepareRewardVideoAd({
            adId: MONETIZATION_CONFIG.admob.units.rewarded,
            isTesting: MONETIZATION_CONFIG.isTesting
          });
        }

        let rewardClaimed = false;
        const rewardListener = await AdMob.addListener(
          RewardAdPluginEvents.Rewarded,
          (reward: AdMobRewardItem) => {
            rewardClaimed = true;
            if (type === 'coins') {
              this.saveManager.addCoins(MONETIZATION_CONFIG.rules.rewardedCoinsAmount);
              this.saveManager.recordRewardedAdWatched();
            }
            this.analyticsManager.recordAdCompleted('rewarded', 'admob', type);
          }
        );

        await AdMob.showRewardVideoAd();
        rewardListener.remove();
        this.preloadAds();

        if (rewardClaimed) {
          onResult(true);
          return;
        }
      } catch (nativeRewardedError) {
        console.warn('[AdManager] Native Rewarded Ad fallback to modal:', nativeRewardedError);
      }
    }

    // ------------------------------------------------------------------------
    // B. WEB ADSENSE / H5 GAME ADS REWARDED BREAK
    // ------------------------------------------------------------------------
    if (!this.isNative && typeof window !== 'undefined' && (window as any).adBreak) {
      this.analyticsManager.recordAdStarted('rewarded', 'adsense');
      let rewardedViewComplete = false;
      let adBreakStarted = false;
      try {
        (window as any).adBreak({
          type: 'reward',
          name: `rewarded_${type}`,
          beforeReward: (showAdFn: () => void) => {
            adBreakStarted = true;
            showAdFn();
          },
          adViewed: () => {
            rewardedViewComplete = true;
            if (type === 'coins') {
              this.saveManager.addCoins(MONETIZATION_CONFIG.rules.rewardedCoinsAmount);
              this.saveManager.recordRewardedAdWatched();
            }
            this.analyticsManager.recordAdCompleted('rewarded', 'adsense', type);
            onResult(true);
          },
          adDismissed: () => {
            if (!rewardedViewComplete) {
              this.analyticsManager.recordAdSkipped('rewarded');
              onResult(false);
            }
          },
          adBreakDone: (placementInfo: any) => {
            if (!adBreakStarted && !rewardedViewComplete && placementInfo?.breakStatus === 'notReady') {
              // No fill from H5 Ads, use high-polish fallback modal
              this.showFallbackRewardedModal(scene, type, onResult);
            }
          }
        });
        return;
      } catch (h5Error) {
        console.warn('[AdManager] Web H5 adBreak notice:', h5Error);
      }
    }

    // ------------------------------------------------------------------------
    // C. HIGH-POLISH INTERACTIVE FALLBACK REWARDED MODAL
    // ------------------------------------------------------------------------
    this.showFallbackRewardedModal(scene, type, onResult);
  }

  private async showFallbackRewardedModal(
    scene: Phaser.Scene,
    type: AdRewardType,
    onResult: (success: boolean) => void
  ): Promise<void> {
    const title = type === 'revive' ? 'Watch Ad to Continue Match' : 'Watch Ad for +50 🪙 Coins';
    const subtitle = type === 'revive' ? 'Resume with your active score and fresh pieces!' : 'Earn free gold coins to unlock premium themes!';

    this.analyticsManager.recordAdStarted('rewarded', 'fallback');

    try {
      const { RewardedAdModal } = await import('../ui/modals/RewardedAdModal');
      new RewardedAdModal(
        scene,
        title,
        subtitle,
        5,
        (completed) => {
          if (completed) {
            if (type === 'coins') {
              this.saveManager.addCoins(MONETIZATION_CONFIG.rules.rewardedCoinsAmount);
              this.saveManager.recordRewardedAdWatched();
            }
            this.analyticsManager.recordAdCompleted('rewarded', 'fallback', type);
            onResult(true);
          } else {
            this.analyticsManager.recordAdSkipped('rewarded');
            onResult(false);
          }
        },
        true // is rewarded ad
      );
    } catch (e) {
      onResult(false);
    }
  }

  /**
   * Shows a native mobile banner ad or manages web banner placement.
   */
  public async showBanner(position: 'top' | 'bottom' = 'bottom'): Promise<void> {
    if (this.isNative && this.isAdMobInitialized) {
      try {
        const options: BannerAdOptions = {
          adId: MONETIZATION_CONFIG.admob.units.banner,
          adSize: BannerAdSize.BANNER,
          position: position === 'top' ? BannerAdPosition.TOP_CENTER : BannerAdPosition.BOTTOM_CENTER,
          isTesting: MONETIZATION_CONFIG.isTesting
        };
        await AdMob.showBanner(options);
        this.isBannerShowing = true;
      } catch (e) {
        console.warn('[AdManager] Native Banner show error:', e);
      }
    }
  }

  /**
   * Hides active banner ad.
   */
  public async hideBanner(): Promise<void> {
    if (this.isNative && this.isBannerShowing) {
      try {
        await AdMob.hideBanner();
        this.isBannerShowing = false;
      } catch (e) {
        console.warn('[AdManager] Native Banner hide error:', e);
      }
    }
  }

  /**
   * Removes active banner ad completely from DOM.
   */
  public async removeBanner(): Promise<void> {
    if (this.isNative && this.isBannerShowing) {
      try {
        await AdMob.removeBanner();
        this.isBannerShowing = false;
      } catch (e) {
        console.warn('[AdManager] Native Banner remove error:', e);
      }
    }
  }

  public getRemainingRewardedCoinsAds(): number {
    return this.saveManager.getRemainingRewardedAdsToday();
  }

  public canWatchRewardedAd(): boolean {
    return this.saveManager.canWatchRewardedAd();
  }

  public isNativePlatform(): boolean {
    return this.isNative;
  }
}
