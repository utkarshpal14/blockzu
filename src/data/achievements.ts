import { AchievementDefinition } from '../types/Achievement';

/**
 * LAUNCH ACHIEVEMENTS (20 Total)
 * Defined in Document 05 (Achievements & Missions System).
 */
export const ACHIEVEMENT_CATALOG: AchievementDefinition[] = [
  // --- Beginner Achievements ---
  {
    id: 'first_placement',
    title: 'First Placement',
    description: 'Place your first block piece on the board.',
    category: 'beginner',
    target: 1,
    rewardCoins: 50,
    icon: 'play'
  },
  {
    id: 'first_game',
    title: 'First Game',
    description: 'Finish your first game match.',
    category: 'beginner',
    target: 1,
    rewardCoins: 100,
    icon: 'trophy'
  },
  {
    id: 'first_combo',
    title: 'First Combo',
    description: 'Clear 2 or more lines simultaneously in one move.',
    category: 'beginner',
    target: 1,
    rewardCoins: 100,
    icon: 'zap'
  },

  // --- Score Achievements ---
  {
    id: 'score_100',
    title: 'Rising Star',
    description: 'Reach a score of 100 points in a single game.',
    category: 'score',
    target: 100,
    rewardCoins: 100,
    icon: 'star'
  },
  {
    id: 'score_500',
    title: 'Skilled Player',
    description: 'Reach a score of 500 points in a single game.',
    category: 'score',
    target: 500,
    rewardCoins: 150,
    icon: 'award'
  },
  {
    id: 'score_1000',
    title: 'Puzzle Expert',
    description: 'Reach a score of 1,000 points in a single game.',
    category: 'score',
    target: 1000,
    rewardCoins: 250,
    icon: 'shield'
  },
  {
    id: 'score_2500',
    title: 'Master Strategist',
    description: 'Reach a score of 2,500 points in a single game.',
    category: 'score',
    target: 2500,
    rewardCoins: 500,
    icon: 'crown'
  },
  {
    id: 'score_5000',
    title: 'Blockzu Legend',
    description: 'Reach a score of 5,000 points in a single game.',
    category: 'score',
    target: 5000,
    rewardCoins: 1000,
    icon: 'gem'
  },

  // --- Gameplay Achievements ---
  {
    id: 'play_10_games',
    title: 'Casual Player',
    description: 'Play a total of 10 matches.',
    category: 'gameplay',
    target: 10,
    rewardCoins: 150,
    icon: 'gamepad'
  },
  {
    id: 'play_50_games',
    title: 'Dedicated Player',
    description: 'Play a total of 50 matches.',
    category: 'gameplay',
    target: 50,
    rewardCoins: 300,
    icon: 'flame'
  },
  {
    id: 'play_100_games',
    title: 'Veteran Player',
    description: 'Play a total of 100 matches.',
    category: 'gameplay',
    target: 100,
    rewardCoins: 750,
    icon: 'medal'
  },

  // --- Line Clear Achievements ---
  {
    id: 'clear_10_lines',
    title: 'Cleaner',
    description: 'Clear a total of 10 lines.',
    category: 'lines',
    target: 10,
    rewardCoins: 100,
    icon: 'grid'
  },
  {
    id: 'clear_50_lines',
    title: 'Sweeper',
    description: 'Clear a total of 50 lines.',
    category: 'lines',
    target: 50,
    rewardCoins: 250,
    icon: 'layers'
  },
  {
    id: 'clear_100_lines',
    title: 'Eliminator',
    description: 'Clear a total of 100 lines.',
    category: 'lines',
    target: 100,
    rewardCoins: 500,
    icon: 'target'
  },
  {
    id: 'clear_500_lines',
    title: 'Destroyer',
    description: 'Clear a total of 500 lines.',
    category: 'lines',
    target: 500,
    rewardCoins: 1000,
    icon: 'sparkles'
  },

  // --- Combo Achievements ---
  {
    id: 'combo_10',
    title: 'Combo Starter',
    description: 'Perform a total of 10 combos.',
    category: 'combos',
    target: 10,
    rewardCoins: 200,
    icon: 'activity'
  },
  {
    id: 'combo_50',
    title: 'Combo Master',
    description: 'Perform a total of 50 combos.',
    category: 'combos',
    target: 50,
    rewardCoins: 500,
    icon: 'battery-charging'
  },
  {
    id: 'combo_100',
    title: 'Combo King',
    description: 'Perform a total of 100 combos.',
    category: 'combos',
    target: 100,
    rewardCoins: 1000,
    icon: 'zap-off'
  },

  // --- Theme Achievements ---
  {
    id: 'unlock_first_theme',
    title: 'Stylish',
    description: 'Unlock your first custom board theme.',
    category: 'themes',
    target: 1,
    rewardCoins: 100,
    icon: 'palette'
  },
  {
    id: 'collector',
    title: 'Collector',
    description: 'Unlock all 7 purchasable themes.',
    category: 'themes',
    target: 7,
    rewardCoins: 0, // Unlocks Secret Golden Theme
    icon: 'sun'
  }
];
