import { Theme } from '../types/Theme';

/**
 * THEME CATALOG (7 Launch Themes + 1 Secret Golden Theme)
 * Color specs from Document 04 (Section 23) and economy from Document 05 (Section 27).
 */
export const THEME_CATALOG: Theme[] = [
  {
    id: 'classic',
    name: 'Classic',
    unlockScore: 0,
    coinCost: 0,
    isSecret: false,
    colors: {
      background: '#223BBE',
      board: '#172554',
      cellEmpty: '#1E293B',
      cellFilled: '#3B82F6',
      accent: '#38BDF8',
      textPrimary: '#FFFFFF',
      textSecondary: '#93C5FD',
      cardBackground: '#1E293B',
      glowColor: '#38BDF8'
    }
  },
  {
    id: 'dark',
    name: 'Dark',
    unlockScore: 0,
    coinCost: 1400,
    isSecret: false,
    colors: {
      background: '#090B10',
      board: '#141824',
      cellEmpty: '#1F2438',
      cellFilled: '#6366F1',
      accent: '#818CF8',
      textPrimary: '#F8FAFC',
      textSecondary: '#94A3B8',
      cardBackground: '#111522',
      glowColor: '#6366F1'
    }
  },
  {
    id: 'neon',
    name: 'Neon',
    unlockScore: 0,
    coinCost: 3000,
    isSecret: false,
    colors: {
      background: '#08080C',
      board: '#12121A',
      cellEmpty: '#1C1C28',
      cellFilled: '#00F0FF',
      accent: '#FF007F',
      accentSecondary: '#FF007F',
      textPrimary: '#FFFFFF',
      textSecondary: '#00F0FF',
      cardBackground: '#111118',
      glowColor: '#00F0FF'
    }
  },
  {
    id: 'nature',
    name: 'Nature',
    unlockScore: 0,
    coinCost: 6500,
    isSecret: false,
    colors: {
      background: '#061C14',
      board: '#0C2E22',
      cellEmpty: '#144232',
      cellFilled: '#10B981',
      accent: '#34D399',
      textPrimary: '#ECFDF5',
      textSecondary: '#6EE7B7',
      cardBackground: '#092319',
      glowColor: '#10B981'
    }
  },
  {
    id: 'ocean',
    name: 'Ocean',
    unlockScore: 0,
    coinCost: 11500,
    isSecret: false,
    colors: {
      background: '#061727',
      board: '#0B253E',
      cellEmpty: '#12385C',
      cellFilled: '#06B6D4',
      accent: '#38BDF8',
      textPrimary: '#ECFEFF',
      textSecondary: '#7DD3FC',
      cardBackground: '#081E33',
      glowColor: '#06B6D4'
    }
  },
  {
    id: 'sunset',
    name: 'Sunset',
    unlockScore: 0,
    coinCost: 20000,
    isSecret: false,
    colors: {
      background: '#1A0B0B',
      board: '#2E1313',
      cellEmpty: '#451D1D',
      cellFilled: '#F97316',
      accent: '#FB923C',
      textPrimary: '#FFF7ED',
      textSecondary: '#FDBA74',
      cardBackground: '#220E0E',
      glowColor: '#F97316'
    }
  },
  {
    id: 'galaxy',
    name: 'Galaxy',
    unlockScore: 0,
    coinCost: 27000,
    isSecret: false,
    colors: {
      background: '#0F091E',
      board: '#1E1238',
      cellEmpty: '#2D1B54',
      cellFilled: '#A855F7',
      accent: '#C084FC',
      textPrimary: '#FAF5FF',
      textSecondary: '#D8B4FE',
      cardBackground: '#170E2D',
      glowColor: '#A855F7'
    }
  },
  {
    id: 'golden',
    name: 'Golden',
    unlockScore: 0,
    coinCost: 0,
    isSecret: true,
    colors: {
      background: '#140D04',
      board: '#291B08',
      cellEmpty: '#422C0C',
      cellFilled: '#F59E0B',
      accent: '#FCD34D',
      textPrimary: '#FFFBEB',
      textSecondary: '#FDE68A',
      cardBackground: '#1E1406',
      glowColor: '#F59E0B'
    }
  }
];
