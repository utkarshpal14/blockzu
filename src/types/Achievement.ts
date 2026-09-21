/**
 * ACHIEVEMENT DEFINITION INTERFACES
 */

export type AchievementCategory = 
  | 'beginner'
  | 'score'
  | 'gameplay'
  | 'lines'
  | 'combos'
  | 'themes';

export interface AchievementDefinition {
  id: string;
  title: string;
  description: string;
  category: AchievementCategory;
  target: number;
  rewardCoins: number;
  icon: string;
}
