import { THEME_CATALOG } from '../data/themes';
import { Theme, ThemeColors } from '../types/Theme';
import { SaveManager } from './SaveManager';
import { AnalyticsManager } from './AnalyticsManager';

/**
 * THEME MANAGER
 * Handles active theme selection, purchasing, unlocking, and color resolution.
 * Documented in Docs 02, 04, 05.
 */
export class ThemeManager {
  private static instance: ThemeManager;
  private saveManager: SaveManager;

  private constructor() {
    this.saveManager = SaveManager.getInstance();
  }

  public static getInstance(): ThemeManager {
    if (!ThemeManager.instance) {
      ThemeManager.instance = new ThemeManager();
    }
    return ThemeManager.instance;
  }

  public getAllThemes(): Theme[] {
    return THEME_CATALOG;
  }

  public getActiveTheme(): Theme {
    const activeId = this.saveManager.getThemeData().activeTheme;
    const found = THEME_CATALOG.find((t) => t.id === activeId);
    return found || THEME_CATALOG[0];
  }

  public getActiveColors(): ThemeColors {
    return this.getActiveTheme().colors;
  }

  public isThemeUnlocked(themeId: string): boolean {
    return this.saveManager.getThemeData().unlockedThemes.includes(themeId);
  }

  public canUnlockTheme(theme: Theme): boolean {
    if (this.isThemeUnlocked(theme.id)) return false;
    if (theme.isSecret) return false; // Unlocked via Collector achievement
    const bestScore = this.saveManager.getBestScore();
    const coins = this.saveManager.getCoins();
    return bestScore >= theme.unlockScore && coins >= theme.coinCost;
  }

  public purchaseTheme(theme: Theme): boolean {
    if (!this.canUnlockTheme(theme)) return false;
    if (this.saveManager.spendCoins(theme.coinCost)) {
      this.saveManager.unlockTheme(theme.id);
      this.saveManager.setActiveTheme(theme.id);
      AnalyticsManager.getInstance().recordThemePurchased(theme.id, theme.coinCost);
      this.checkCollectorAchievement();
      return true;
    }
    return false;
  }

  public selectTheme(themeId: string): boolean {
    if (this.isThemeUnlocked(themeId)) {
      this.saveManager.setActiveTheme(themeId);
      return true;
    }
    return false;
  }

  private checkCollectorAchievement() {
    const unlocked = this.saveManager.getThemeData().unlockedThemes;
    const purchasableCount = THEME_CATALOG.filter((t) => !t.isSecret).length;
    const unlockedPurchasable = unlocked.filter((id) => id !== 'golden').length;
    if (unlockedPurchasable >= purchasableCount) {
      // Unlock secret Golden theme
      this.saveManager.unlockTheme('golden');
    }
  }
}
