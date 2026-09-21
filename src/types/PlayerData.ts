/**
 * CANONICAL SAVE SYSTEM DATA INTERFACES
 * Single Source of Truth as defined in Document 07 (Save System).
 */

export interface PlayerData {
  version: string;
  metadata?: SaveMetadata;
  profile: ProfileData;
  statistics: StatisticsData;
  achievements: AchievementData[];
  missions: MissionData[];
  themes: ThemeData;
  economy: EconomyData;
  settings: SettingsData;
  dailyReward?: DailyRewardData;
  adState?: AdStateData;
}

export interface SaveMetadata {
  version: number;
  createdAt: number;
  updatedAt: number;
  totalPlayTime: number; // in seconds
  totalCoinsEarned: number;
  adsWatched: number;
}

export interface AdStateData {
  lastRewardedDate: string; // YYYY-MM-DD
  rewardedAdsWatchedToday: number;
  lastInterstitialTime: number;
  matchesSinceLastInterstitial: number;
}

export interface DailyRewardData {
  lastClaimTime: number;
  currentStreak: number;
}

export interface ProfileData {
  bestScore: number;
  totalGamesPlayed: number;
}

export interface StatisticsData {
  highestScore: number;
  totalScore: number;
  gamesPlayed: number;
  linesCleared: number;
  blocksPlaced: number;
  longestCombo: number;
  averageScore: number;
  bestSingleMoveScore: number;
}

export interface AchievementData {
  id: string;
  progress: number;
  completed: boolean;
  claimed: boolean;
}

export interface MissionData {
  id: string;
  progress: number;
  target: number;
  claimed: boolean;
}

export interface ThemeData {
  activeTheme: string;
  unlockedThemes: string[];
}

export interface EconomyData {
  coins: number;
}

export interface SettingsData {
  soundEnabled: boolean;
  musicEnabled: boolean;
  vibrationEnabled: boolean;
}
