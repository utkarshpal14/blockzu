import { AchievementDefinition } from '../types/Achievement';

/**
 * ACHIEVEMENT CATALOG (Bronze, Silver, Gold, Legendary Tiers)
 * Bronze: 25-50 Coins
 * Silver: 75-150 Coins
 * Gold: 200-300 Coins
 * Legendary: 500 Coins (Long-term aspirational milestones)
 */
export const ACHIEVEMENT_CATALOG: AchievementDefinition[] = [
  // ================= BRONZE TIER (25 - 50 Coins) =================
  {
    id: 'first_placement',
    title: 'First Step',
    description: 'Place your first block piece on the board.',
    category: 'beginner',
    target: 1,
    rewardCoins: 25,
    icon: 'play'
  },
  {
    id: 'first_game',
    title: 'First Match',
    description: 'Finish your first game match.',
    category: 'beginner',
    target: 1,
    rewardCoins: 35,
    icon: 'trophy'
  },
  {
    id: 'first_combo',
    title: 'Double Trouble',
    description: 'Clear 2 or more lines simultaneously in one move.',
    category: 'beginner',
    target: 1,
    rewardCoins: 50,
    icon: 'zap'
  },
  {
    id: 'score_100',
    title: 'Warming Up',
    description: 'Reach a score of 100 points in a single game.',
    category: 'score',
    target: 100,
    rewardCoins: 25,
    icon: 'star'
  },
  {
    id: 'clear_10_lines',
    title: 'Apprentice Sweeper',
    description: 'Clear a total of 10 lines.',
    category: 'lines',
    target: 10,
    rewardCoins: 35,
    icon: 'grid'
  },
  {
    id: 'unlock_first_theme',
    title: 'Fashion Statement',
    description: 'Unlock your first custom board theme.',
    category: 'themes',
    target: 1,
    rewardCoins: 50,
    icon: 'palette'
  },

  // ================= SILVER TIER (75 - 150 Coins) =================
  {
    id: 'score_500',
    title: 'Skilled Strategist',
    description: 'Reach a score of 500 points in a single game.',
    category: 'score',
    target: 500,
    rewardCoins: 75,
    icon: 'award'
  },
  {
    id: 'score_1000',
    title: 'Puzzle Expert',
    description: 'Reach a score of 1,000 points in a single game.',
    category: 'score',
    target: 1000,
    rewardCoins: 100,
    icon: 'shield'
  },
  {
    id: 'play_10_games',
    title: 'Casual Regular',
    description: 'Play a total of 10 matches.',
    category: 'gameplay',
    target: 10,
    rewardCoins: 75,
    icon: 'gamepad'
  },
  {
    id: 'play_25_games',
    title: 'Dedicated Player',
    description: 'Play a total of 25 matches.',
    category: 'gameplay',
    target: 25,
    rewardCoins: 100,
    icon: 'flame'
  },
  {
    id: 'clear_50_lines',
    title: 'Line Eliminator',
    description: 'Clear a total of 50 lines.',
    category: 'lines',
    target: 50,
    rewardCoins: 100,
    icon: 'layers'
  },
  {
    id: 'clear_100_lines',
    title: 'Grid Cleaner',
    description: 'Clear a total of 100 lines.',
    category: 'lines',
    target: 100,
    rewardCoins: 150,
    icon: 'target'
  },
  {
    id: 'combo_10',
    title: 'Combo Striker',
    description: 'Perform a total of 10 combos.',
    category: 'combos',
    target: 10,
    rewardCoins: 75,
    icon: 'activity'
  },
  {
    id: 'combo_25',
    title: 'Chain Reactor',
    description: 'Perform a total of 25 combos.',
    category: 'combos',
    target: 25,
    rewardCoins: 125,
    icon: 'zap-off'
  },

  // ================= GOLD TIER (200 - 300 Coins) =================
  {
    id: 'score_2500',
    title: 'Grandmaster Mind',
    description: 'Reach a score of 2,500 points in a single game.',
    category: 'score',
    target: 2500,
    rewardCoins: 200,
    icon: 'crown'
  },
  {
    id: 'score_5000',
    title: 'Blockzu Champion',
    description: 'Reach a score of 5,000 points in a single game.',
    category: 'score',
    target: 5000,
    rewardCoins: 300,
    icon: 'gem'
  },
  {
    id: 'play_50_games',
    title: 'Seasoned Veteran',
    description: 'Play a total of 50 matches.',
    category: 'gameplay',
    target: 50,
    rewardCoins: 200,
    icon: 'medal'
  },
  {
    id: 'play_100_games',
    title: 'Centurion',
    description: 'Play a total of 100 matches.',
    category: 'gameplay',
    target: 100,
    rewardCoins: 300,
    icon: 'award'
  },
  {
    id: 'clear_250_lines',
    title: 'Master Sweeper',
    description: 'Clear a total of 250 lines.',
    category: 'lines',
    target: 250,
    rewardCoins: 200,
    icon: 'layers'
  },
  {
    id: 'clear_500_lines',
    title: 'Grid Destroyer',
    description: 'Clear a total of 500 lines.',
    category: 'lines',
    target: 500,
    rewardCoins: 300,
    icon: 'sparkles'
  },
  {
    id: 'combo_50',
    title: 'Combo Maestro',
    description: 'Perform a total of 50 combos.',
    category: 'combos',
    target: 50,
    rewardCoins: 200,
    icon: 'battery-charging'
  },
  {
    id: 'combo_100',
    title: 'Combo Sovereign',
    description: 'Perform a total of 100 combos.',
    category: 'combos',
    target: 100,
    rewardCoins: 300,
    icon: 'zap'
  },

  // ================= LEGENDARY & MASTERY TIER (500 Coins) =================
  {
    id: 'score_10000',
    title: 'Mythic Puzzle God',
    description: 'Reach a monumental score of 10,000 points in a single game.',
    category: 'score',
    target: 10000,
    rewardCoins: 500,
    icon: 'gem'
  },
  {
    id: 'score_25000',
    title: 'Cosmic Deity',
    description: 'Reach the ultimate pinnacle score of 25,000 points.',
    category: 'score',
    target: 25000,
    rewardCoins: 500,
    icon: 'sun'
  },
  {
    id: 'play_250_games',
    title: 'Eternal Dedicated',
    description: 'Play a grand total of 250 game matches.',
    category: 'gameplay',
    target: 250,
    rewardCoins: 500,
    icon: 'medal'
  },
  {
    id: 'clear_1000_lines',
    title: 'Vortex Annihilator',
    description: 'Clear a grand total of 1,000 lines across your career.',
    category: 'lines',
    target: 1000,
    rewardCoins: 500,
    icon: 'grid'
  },
  {
    id: 'clear_3000_lines',
    title: 'Dimensional Eraser',
    description: 'Clear an astounding total of 3,000 lines.',
    category: 'lines',
    target: 3000,
    rewardCoins: 500,
    icon: 'sparkles'
  },
  {
    id: 'place_3500_blocks',
    title: 'Architect of Eternity',
    description: 'Place 3,500 block tiles onto the board.',
    category: 'gameplay',
    target: 3500,
    rewardCoins: 500,
    icon: 'layers'
  },
  {
    id: 'collector',
    title: 'Grandmaster Collector',
    description: 'Unlock all 7 purchasable themes in the shop.',
    category: 'themes',
    target: 7,
    rewardCoins: 0, // Unlocks Secret Golden Theme!
    icon: 'sun'
  }
];

