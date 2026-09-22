import { PlayerData } from '../types/PlayerData';
import { STORAGE_KEY_PLAYER_DATA, STORAGE_KEY_BACKUP_DATA, DEFAULT_PLAYER_DATA, SAVE_VERSION } from '../constants/config';

/**
 * STORAGE SERVICE
 * Handles persistence to localStorage with validation, migration, and backup recovery.
 * Architecture defined in Document 07 (Save System).
 */
export class StorageService {
  private static instance: StorageService;

  private constructor() {}

  public static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  /**
   * Loads player data with validation and fallback to backup/default.
   */
  public load(): PlayerData {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_PLAYER_DATA);
      if (!raw) {
        return this.initDefaultSave();
      }

      const parsed = JSON.parse(raw);
      if (this.validate(parsed)) {
        return this.migrate(parsed);
      } else {
        console.warn('[StorageService] Save validation failed. Attempting backup restore.');
        return this.restoreBackup();
      }
    } catch (err) {
      console.error('[StorageService] Error loading save data:', err);
      return this.restoreBackup();
    }
  }

  /**
   * Saves player data and updates backup snapshot.
   */
  public save(data: PlayerData): boolean {
    try {
      if (!this.validate(data)) {
        console.error('[StorageService] Refusing to save invalid data.');
        return false;
      }

      // Update metadata timestamp
      if (data.metadata) {
        data.metadata.updatedAt = Date.now();
      } else {
        data.metadata = {
          version: 1,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          totalPlayTime: 0,
          totalCoinsEarned: data.economy?.coins || 0,
          adsWatched: 0
        };
      }

      const serialized = JSON.stringify(data);
      // Backup previous good save
      const current = localStorage.getItem(STORAGE_KEY_PLAYER_DATA);
      if (current) {
        localStorage.setItem(STORAGE_KEY_BACKUP_DATA, current);
      }

      localStorage.setItem(STORAGE_KEY_PLAYER_DATA, serialized);
      return true;
    } catch (err) {
      console.error('[StorageService] Error saving player data:', err);
      return false;
    }
  }

  /**
   * Clears all save data and restores defaults.
   */
  public reset(): PlayerData {
    try {
      localStorage.removeItem(STORAGE_KEY_PLAYER_DATA);
      localStorage.removeItem(STORAGE_KEY_BACKUP_DATA);
    } catch (err) {
      console.error('[StorageService] Error resetting save data:', err);
    }
    return this.initDefaultSave();
  }

  /**
   * Validates structure of PlayerData.
   */
  public validate(data: any): data is PlayerData {
    if (!data || typeof data !== 'object') return false;
    if (typeof data.version !== 'string') return false;
    if (!data.profile || typeof data.profile.bestScore !== 'number') return false;
    if (!data.statistics || typeof data.statistics.highestScore !== 'number') return false;
    if (!Array.isArray(data.achievements)) return false;
    if (!Array.isArray(data.missions)) return false;
    if (!data.themes || typeof data.themes.activeTheme !== 'string' || !Array.isArray(data.themes.unlockedThemes)) return false;
    if (!data.economy || typeof data.economy.coins !== 'number') return false;
    if (!data.settings || typeof data.settings.soundEnabled !== 'boolean') return false;
    return true;
  }

  /**
   * Migrates older save formats to current version.
   */
  private migrate(data: PlayerData): PlayerData {
    let changed = false;
    if (data.version !== SAVE_VERSION) {
      data.version = SAVE_VERSION;
      changed = true;
    }
    if (!data.metadata) {
      data.metadata = {
        version: 1,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        totalPlayTime: 0,
        totalCoinsEarned: data.economy?.coins || 0,
        adsWatched: 0
      };
      changed = true;
    } else {
      if (data.metadata.totalCoinsEarned === undefined) {
        data.metadata.totalCoinsEarned = data.economy?.coins || 0;
        changed = true;
      }
      if (data.metadata.adsWatched === undefined) {
        data.metadata.adsWatched = 0;
        changed = true;
      }
    }
    if (!data.adState) {
      data.adState = {
        lastRewardedDate: '',
        rewardedAdsWatchedToday: 0,
        lastInterstitialTime: 0,
        matchesSinceLastInterstitial: 0
      };
      changed = true;
    }
    if (data.statistics.bestSingleMoveScore === undefined) {
      data.statistics.bestSingleMoveScore = 0;
      changed = true;
    }
    if (!data.dailyReward) {
      data.dailyReward = { lastClaimTime: 0, currentStreak: 0 };
      changed = true;
    }
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
      changed = true;
    }
    if (changed) {
      this.save(data);
    }
    return data;
  }

  private restoreBackup(): PlayerData {
    try {
      const rawBackup = localStorage.getItem(STORAGE_KEY_BACKUP_DATA);
      if (rawBackup) {
        const parsed = JSON.parse(rawBackup);
        if (this.validate(parsed)) {
          console.info('[StorageService] Successfully restored save from backup.');
          this.save(parsed);
          return parsed;
        }
      }
    } catch (e) {
      console.error('[StorageService] Backup restore failed:', e);
    }
    return this.initDefaultSave();
  }

  private initDefaultSave(): PlayerData {
    const freshData = JSON.parse(JSON.stringify(DEFAULT_PLAYER_DATA));
    this.save(freshData);
    return freshData;
  }
}
