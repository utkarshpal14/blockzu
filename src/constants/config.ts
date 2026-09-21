import { PlayerData } from '../types/PlayerData';

/**
 * STORAGE KEYS & CONFIGURATION
 */
export const STORAGE_KEY_PLAYER_DATA = 'blockzu_player_data';
export const STORAGE_KEY_BACKUP_DATA = 'blockzu_backup_data';
export const SAVE_VERSION = '1.0.0';

export const DEFAULT_PLAYER_DATA: PlayerData = {
  version: SAVE_VERSION,
  profile: {
    bestScore: 0,
    totalGamesPlayed: 0
  },
  statistics: {
    highestScore: 0,
    totalScore: 0,
    gamesPlayed: 0,
    linesCleared: 0,
    blocksPlaced: 0,
    longestCombo: 0,
    averageScore: 0
  },
  achievements: [],
  missions: [],
  themes: {
    activeTheme: 'classic',
    unlockedThemes: ['classic']
  },
  economy: {
    coins: 0
  },
  settings: {
    soundEnabled: true,
    musicEnabled: true,
    vibrationEnabled: true
  }
};
