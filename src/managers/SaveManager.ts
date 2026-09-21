import { StorageService } from '../services/StorageService';
import { PlayerData, SaveMetadata, SettingsData, ThemeData, AdStateData } from '../types/PlayerData';

/**
 * SAVE MANAGER
 * Manages player profile, high scores, coins, settings, metadata, ad state, and stats persistence.
 * Canonical model defined in Document 07 & Milestone 9.
 */
export class SaveManager {
  private static instance: SaveManager;
  private storage: StorageService;
  private data: PlayerData;
  private sessionStartTime: number = Date.now();

  private constructor() {
    this.storage = StorageService.getInstance();
    this.data = this.storage.load();
    this.bindLifecycleEvents();
  }

  public static getInstance(): SaveManager {
    if (!SaveManager.instance) {
      SaveManager.instance = new SaveManager();
    }
    return SaveManager.instance;
  }

  private bindLifecycleEvents() {
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        this.flushSessionPlayTime();
        this.save();
      });
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          this.flushSessionPlayTime();
          this.save();
        } else {
          this.sessionStartTime = Date.now();
        }
      });
    }
  }

  public getData(): PlayerData {
    return this.data;
  }

  public save(): boolean {
    return this.storage.save(this.data);
  }

  public resetProgress(): PlayerData {
    this.data = this.storage.reset();
    this.sessionStartTime = Date.now();
    return this.data;
  }

  // --- Metadata & Playtime ---
  public getMetadata(): SaveMetadata {
    if (!this.data.metadata) {
      this.data.metadata = {
        version: 1,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        totalPlayTime: 0,
        totalCoinsEarned: this.data.economy?.coins || 0,
        adsWatched: 0
      };
    }
    return this.data.metadata;
  }

  public addPlayTime(seconds: number): number {
    const meta = this.getMetadata();
    meta.totalPlayTime += Math.max(0, Math.floor(seconds));
    return meta.totalPlayTime;
  }

  public incrementAdsWatched() {
    const meta = this.getMetadata();
    meta.adsWatched += 1;
    this.save();
  }

  public flushSessionPlayTime() {
    const now = Date.now();
    const elapsedSeconds = Math.floor((now - this.sessionStartTime) / 1000);
    if (elapsedSeconds > 0) {
      this.addPlayTime(elapsedSeconds);
      this.sessionStartTime = now;
    }
  }

  // --- Profile & Score ---
  public updateScore(score: number): boolean {
    let isNewBest = false;
    if (score > this.data.profile.bestScore) {
      this.data.profile.bestScore = score;
      this.data.statistics.highestScore = score;
      isNewBest = true;
    }
    this.save();
    return isNewBest;
  }

  public getBestScore(): number {
    return this.data.profile.bestScore;
  }

  // --- Economy ---
  public getCoins(): number {
    return this.data.economy.coins;
  }

  public addCoins(amount: number): number {
    const validAmount = Math.max(0, Math.floor(amount));
    this.data.economy.coins = Math.min(this.data.economy.coins + validAmount, 99999);
    
    // Track lifetime coins earned
    const meta = this.getMetadata();
    meta.totalCoinsEarned += validAmount;
    
    this.save();
    return this.data.economy.coins;
  }

  public spendCoins(amount: number): boolean {
    if (this.data.economy.coins >= amount && amount > 0) {
      this.data.economy.coins = Math.max(0, this.data.economy.coins - amount);
      this.save();
      return true;
    }
    return false;
  }

  // --- Ad State & Monetization Rules (Document 06) ---
  public getAdState(): AdStateData {
    if (!this.data.adState) {
      this.data.adState = {
        lastRewardedDate: '',
        rewardedAdsWatchedToday: 0,
        lastInterstitialTime: 0,
        matchesSinceLastInterstitial: 0
      };
    }
    // Check if new day
    const today = new Date().toISOString().split('T')[0];
    if (this.data.adState.lastRewardedDate !== today) {
      this.data.adState.lastRewardedDate = today;
      this.data.adState.rewardedAdsWatchedToday = 0;
    }
    return this.data.adState;
  }

  public getRemainingRewardedAdsToday(): number {
    const adState = this.getAdState();
    return Math.max(0, 5 - adState.rewardedAdsWatchedToday);
  }

  public canWatchRewardedAd(): boolean {
    return this.getRemainingRewardedAdsToday() > 0;
  }

  public recordRewardedAdWatched(): number {
    const adState = this.getAdState();
    adState.rewardedAdsWatchedToday += 1;
    this.incrementAdsWatched();
    this.save();
    return this.getRemainingRewardedAdsToday();
  }

  /**
   * Called on Game Over.
   * Interstitial triggers on every 4th match AND >= 3 minutes (180s) cooldown.
   */
  public recordMatchFinished(): boolean {
    const adState = this.getAdState();
    adState.matchesSinceLastInterstitial += 1;
    this.save();

    const now = Date.now();
    const cooldownMs = 3 * 60 * 1000; // 3 minutes
    const isFourthMatch = adState.matchesSinceLastInterstitial >= 4;
    const cooldownPassed = now - adState.lastInterstitialTime >= cooldownMs;

    return isFourthMatch && cooldownPassed;
  }

  public recordInterstitialShown() {
    const adState = this.getAdState();
    adState.lastInterstitialTime = Date.now();
    adState.matchesSinceLastInterstitial = 0;
    this.incrementAdsWatched();
    this.save();
  }

  // --- Settings ---
  public getSettings(): SettingsData {
    return this.data.settings;
  }

  public updateSettings(settings: Partial<SettingsData>) {
    this.data.settings = { ...this.data.settings, ...settings };
    this.save();
  }

  // --- Themes ---
  public getThemeData(): ThemeData {
    return this.data.themes;
  }

  public setActiveTheme(themeId: string) {
    if (this.data.themes.unlockedThemes.includes(themeId)) {
      this.data.themes.activeTheme = themeId;
      this.save();
    }
  }

  public unlockTheme(themeId: string) {
    if (!this.data.themes.unlockedThemes.includes(themeId)) {
      this.data.themes.unlockedThemes.push(themeId);
      this.save();
    }
  }
}
