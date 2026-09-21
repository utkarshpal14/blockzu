import { MissionDefinition } from '../types/Mission';

/**
 * MISSION TEMPLATES CATALOG
 * Scaled Tiers:
 * - Easy: 25 - 50 Coins (Quick session objectives)
 * - Medium: 75 - 100 Coins (Mid session objectives)
 * - Hard: 150 - 250 Coins (Multi-session dedication challenges)
 * 5 Diverse Categories: score, lines, blocks, games, combos.
 */
export const MISSION_TEMPLATES: MissionDefinition[] = [
  // --- Easy Missions (25 - 50 Coins) ---
  {
    id: 'easy_score_300',
    title: 'Score 300 Points',
    description: 'Score 300 points in any match.',
    type: 'score',
    target: 300,
    rewardCoins: 35,
    tier: 'easy'
  },
  {
    id: 'easy_clear_5_lines',
    title: 'Clear 5 Lines',
    description: 'Clear a total of 5 lines across your games.',
    type: 'lines',
    target: 5,
    rewardCoins: 35,
    tier: 'easy'
  },
  {
    id: 'easy_place_30_blocks',
    title: 'Place 30 Blocks',
    description: 'Place 30 individual block tiles on the board.',
    type: 'blocks',
    target: 30,
    rewardCoins: 25,
    tier: 'easy'
  },
  {
    id: 'easy_play_2_games',
    title: 'Play 2 Games',
    description: 'Play and finish 2 game sessions.',
    type: 'games',
    target: 2,
    rewardCoins: 35,
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

  // --- Medium Missions (75 - 100 Coins) ---
  {
    id: 'med_score_1000',
    title: 'Score 1,000 Points',
    description: 'Score 1,000 points in any match.',
    type: 'score',
    target: 1000,
    rewardCoins: 75,
    tier: 'medium'
  },
  {
    id: 'med_clear_20_lines',
    title: 'Clear 20 Lines',
    description: 'Clear a total of 20 lines.',
    type: 'lines',
    target: 20,
    rewardCoins: 100,
    tier: 'medium'
  },
  {
    id: 'med_place_100_blocks',
    title: 'Place 100 Blocks',
    description: 'Place 100 individual block tiles on the board.',
    type: 'blocks',
    target: 100,
    rewardCoins: 75,
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
    id: 'med_get_6_combos',
    title: 'Get 6 Combos',
    description: 'Perform 6 multi-line combos.',
    type: 'combos',
    target: 6,
    rewardCoins: 100,
    tier: 'medium'
  },

  // --- Hard Missions (150 - 250 Coins - Multi-Session Challenges) ---
  {
    id: 'hard_score_5000',
    title: 'Score 5,000 Points',
    description: 'Score 5,000 points in any match.',
    type: 'score',
    target: 5000,
    rewardCoins: 200,
    tier: 'hard'
  },
  {
    id: 'hard_clear_150_lines',
    title: 'Clear 150 Lines',
    description: 'Clear an impressive total of 150 lines.',
    type: 'lines',
    target: 150,
    rewardCoins: 250,
    tier: 'hard'
  },
  {
    id: 'hard_place_500_blocks',
    title: 'Place 500 Blocks',
    description: 'Place 500 individual block tiles on the board.',
    type: 'blocks',
    target: 500,
    rewardCoins: 200,
    tier: 'hard'
  },
  {
    id: 'hard_play_20_games',
    title: 'Play 20 Games',
    description: 'Play and finish 20 complete game matches.',
    type: 'games',
    target: 20,
    rewardCoins: 200,
    tier: 'hard'
  },
  {
    id: 'hard_get_30_combos',
    title: 'Get 30 Combos',
    description: 'Perform 30 multi-line combos across your matches.',
    type: 'combos',
    target: 30,
    rewardCoins: 250,
    tier: 'hard'
  }
];
