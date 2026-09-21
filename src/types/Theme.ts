/**
 * THEME DATA INTERFACES
 * Defines static catalog entries and color schemes.
 */

export interface ThemeColors {
  background: string;
  board: string;
  cellEmpty: string;
  cellFilled: string;
  accent: string;
  accentSecondary?: string;
  textPrimary: string;
  textSecondary: string;
  cardBackground: string;
  glowColor?: string;
}

export interface Theme {
  id: string;
  name: string;
  unlockScore: number;
  coinCost: number;
  isSecret?: boolean;
  colors: ThemeColors;
}
