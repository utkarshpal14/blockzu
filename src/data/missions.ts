import { MissionDefinition } from '../types/Mission';

/**
 * MISSION TEMPLATES CATALOG
 * Defined in Document 05 (Achievements & Missions System).
 * Tiers: Easy (50 Coins), Medium (100 Coins), Hard (200 Coins).
 */
export const MISSION_TEMPLATES: MissionDefinition[] = [
  // --- Easy Missions (50 Coins) ---
  {
    id: 'easy_score_300',
    title: 'Score 300 Points',
    description: 'Score 300 points in any match.',
    type: 'score',
    target: 300,
    rewardCoins: 50,
    tier: 'easy'
  },
  {
    id: 'easy_clear_5_lines',
    title: 'Clear 5 Lines',
    description: 'Clear a total of 5 lines across your games.',
    type: 'lines',
    target: 5,
    rewardCoins: 50,
    tier: 'easy'
  },
  {
    id: 'easy_place_50_blocks',
    title: 'Place 50 Blocks',
    description: 'Place 50 individual block tiles on the board.',
    type: 'blocks',
    target: 50,
    rewardCoins: 50,
    tier: 'easy'
  },
  {
    id: 'easy_play_3_games',
    title: 'Play 3 Games',
    description: 'Play and finish 3 game sessions.',
    type: 'games',
    target: 3,
    rewardCoins: 50,
    tier: 'easy'
  },
  {
    id: 'easy_get_2_combos',
    title: 'Get 2 Combos',
    description: 'Perform 2 multi-line combos.',
    type: 'combos',
    target: 2,
    rewardCoins: 50,
    tier: 'easy'
  },

  // --- Medium Missions (100 Coins) ---
  {
    id: 'med_score_500',
    title: 'Score 500 Points',
    description: 'Score 500 points in any match.',
    type: 'score',
    target: 500,
    rewardCoins: 100,
    tier: 'medium'
  },
  {
    id: 'med_clear_10_lines',
    title: 'Clear 10 Lines',
    description: 'Clear a total of 10 lines.',
    type: 'lines',
    target: 10,
    rewardCoins: 100,
    tier: 'medium'
  },
  {
    id: 'med_place_100_blocks',
    title: 'Place 100 Blocks',
    description: 'Place 100 individual block tiles on the board.',
    type: 'blocks',
    target: 100,
    rewardCoins: 100,
    tier: 'medium'
  },
  {
    id: 'med_play_5_games',
    title: 'Play 5 Games',
    description: 'Play and finish 5 game sessions.',
    type: 'games',
    target: 5,
    rewardCoins: 100,
    tier: 'medium'
  },
  {
    id: 'med_get_5_combos',
    title: 'Get 5 Combos',
    description: 'Perform 5 multi-line combos.',
    type: 'combos',
    target: 5,
    rewardCoins: 100,
    tier: 'medium'
  },

  // --- Hard Missions (200 Coins) ---
  {
    id: 'hard_score_1000',
    title: 'Score 1,000 Points',
    description: 'Score 1,000 points in any match.',
    type: 'score',
    target: 1000,
    rewardCoins: 200,
    tier: 'hard'
  },
  {
    id: 'hard_clear_25_lines',
    title: 'Clear 25 Lines',
    description: 'Clear a total of 25 lines.',
    type: 'lines',
    target: 25,
    rewardCoins: 200,
    tier: 'hard'
  },
  {
    id: 'hard_place_250_blocks',
    title: 'Place 250 Blocks',
    description: 'Place 250 individual block tiles on the board.',
    type: 'blocks',
    target: 250,
    rewardCoins: 200,
    tier: 'hard'
  },
  {
    id: 'hard_play_10_games',
    title: 'Play 10 Games',
    description: 'Play and finish 10 game sessions.',
    type: 'games',
    target: 10,
    rewardCoins: 200,
    tier: 'hard'
  },
  {
    id: 'hard_get_10_combos',
    title: 'Get 10 Combos',
    description: 'Perform 10 multi-line combos.',
    type: 'combos',
    target: 10,
    rewardCoins: 200,
    tier: 'hard'
  }
];
