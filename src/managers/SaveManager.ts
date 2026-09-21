import { StorageService } from '../services/StorageService';
import { PlayerData, SettingsData, ThemeData } from '../types/PlayerData';

/**
 * SAVE MANAGER
 * Manages player profile, high scores, coins, settings, and stats persistence.
 * Canonical model defined in Document 07.
 */
export class SaveManager {
  private static instance: SaveManager;
  private storage: StorageService;
  private data: PlayerData;

  private constructor() {
    this.storage = StorageService.getInstance();
    this.data = this.storage.load();
  }

  public static getInstance(): SaveManager {
    if (!SaveManager.instance) {
      SaveManager.instance = new SaveManager();
    }
    return SaveManager.instance;
  }

  public getData(): PlayerData {
    return this.data;
  }

  public save(): boolean {
    return this.storage.save(this.data);
  }

  public resetProgress(): PlayerData {
    this.data = this.storage.reset();
    return this.data;
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
    this.data.economy.coins = Math.min(this.data.economy.coins + amount, 99999);
    this.save();
    return this.data.economy.coins;
  }

  public spendCoins(amount: number): boolean {
    if (this.data.economy.coins >= amount) {
      this.data.economy.coins -= amount;
      this.save();
      return true;
    }
    return false;
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
