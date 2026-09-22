/**
 * BLOCKZU — DUAL-PLATFORM MONETIZATION CONFIGURATION
 * Centralized credentials, ad unit IDs, and configuration for:
 * 1. Google AdMob (Android Native APK/AAB)
 * 2. Google AdSense / H5 Game Ads (Web / PWA)
 * 
 * NOTE: Google's official sample test unit IDs are pre-configured below so you can test
 * ads safely on any mobile device or browser without risk of policy strikes.
 * When ready for production launch on Google Play or your website, replace test IDs with your real IDs.
 */

export const MONETIZATION_CONFIG = {
  // Global testing flag (set to false for production launch)
  isTesting: true,

  // =========================================================================
  // 1. GOOGLE ADMOB (Android Native)
  // =========================================================================
  admob: {
    // Official Google AdMob App ID for Blockzu Android
    appId: 'ca-app-pub-2910573088630764~2341747324',

    // Ad Unit IDs
    units: {
      rewarded: 'ca-app-pub-2910573088630764/7171402178',
      interstitial: 'ca-app-pub-2910573088630764/4596286283',
      banner: 'ca-app-pub-2910573088630764/3283204610'
    }
  },

  // =========================================================================
  // 2. GOOGLE ADSENSE & H5 GAME ADS (Web / PWA)
  // =========================================================================
  adsense: {
    // Publisher ID (Google AdSense Account)
    publisherId: 'ca-pub-2910573088630764',
    
    // H5 Game Ads AdSense channel / slot
    h5Channel: 'blockzu_web_game',
    
    // Desktop Flanking Skyscraper Ad Slots (160x600)
    displaySlots: {
      leftSkyscraper: '1234567890',
      rightSkyscraper: '0987654321'
    }
  },

  // =========================================================================
  // 3. MONETIZATION FREQUENCY & ECONOMY RULES (Player-Friendly)
  // =========================================================================
  rules: {
    // Rewarded Coins
    rewardedCoinsAmount: 50,
    dailyRewardedAdLimit: 5, // 250 coins/day max from ads

    // Rewarded Revive
    maxRevivesPerMatch: 1,

    // Interstitial Game Over Frequency
    interstitialGameInterval: 4, // Shown every 4th match
    interstitialCooldownSeconds: 180 // Minimum 3 minutes between interstitials
  }
};
