/**
 * MISSION DEFINITION INTERFACES
 */

export type MissionType = 
  | 'score'
  | 'lines'
  | 'blocks'
  | 'combos'
  | 'games';

export type MissionTier = 'easy' | 'medium' | 'hard';

export interface MissionDefinition {
  id: string;
  title: string;
  description: string;
  type: MissionType;
  target: number;
  rewardCoins: number;
  tier: MissionTier;
}
