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
    // Official Google AdMob Sample App ID for Android
    appId: 'ca-app-pub-3940256099942544~3347511713',

    // Ad Unit IDs (Google Sample Test Units)
    units: {
      rewarded: 'ca-app-pub-3940256099942544/5224354917',
      interstitial: 'ca-app-pub-3940256099942544/1033173712',
      banner: 'ca-app-pub-3940256099942544/6300978111'
    }
  },

  // =========================================================================
  // 2. GOOGLE ADSENSE & H5 GAME ADS (Web / PWA)
  // =========================================================================
  adsense: {
    // Publisher ID (e.g. ca-pub-XXXXXXXXXXXXXXXX)
    publisherId: 'ca-pub-3940256099942544',
    
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
