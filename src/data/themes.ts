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
      background: '#F8FAFC',
      board: '#E2E8F0',
      cellEmpty: '#CBD5E1',
      cellFilled: '#3B82F6',
      accent: '#2563EB',
      textPrimary: '#0F172A',
      textSecondary: '#64748B',
      cardBackground: '#FFFFFF'
    }
  },
  {
    id: 'dark',
    name: 'Dark',
    unlockScore: 500,
    coinCost: 500,
    isSecret: false,
    colors: {
      background: '#0F172A',
      board: '#1E293B',
      cellEmpty: '#334155',
      cellFilled: '#6366F1',
      accent: '#818CF8',
      textPrimary: '#F8FAFC',
      textSecondary: '#94A3B8',
      cardBackground: '#1E293B'
    }
  },
  {
    id: 'neon',
    name: 'Neon',
    unlockScore: 1500,
    coinCost: 1000,
    isSecret: false,
    colors: {
      background: '#0A0A0A',
      board: '#111111',
      cellEmpty: '#222222',
      cellFilled: '#00F0FF',
      accent: '#00F0FF',
      accentSecondary: '#FF2E9F',
      textPrimary: '#FFFFFF',
      textSecondary: '#00F0FF',
      cardBackground: '#161616',
      glowColor: '#00F0FF'
    }
  },
  {
    id: 'nature',
    name: 'Nature',
    unlockScore: 3000,
    coinCost: 1500,
    isSecret: false,
    colors: {
      background: '#F0FDF4',
      board: '#DCFCE7',
      cellEmpty: '#BBF7D0',
      cellFilled: '#16A34A',
      accent: '#15803D',
      textPrimary: '#14532D',
      textSecondary: '#166534',
      cardBackground: '#FFFFFF'
    }
  },
  {
    id: 'ocean',
    name: 'Ocean',
    unlockScore: 4000,
    coinCost: 2000,
    isSecret: false,
    colors: {
      background: '#ECFEFF',
      board: '#CFFAFE',
      cellEmpty: '#A5F3FC',
      cellFilled: '#0891B2',
      accent: '#0E7490',
      textPrimary: '#164E63',
      textSecondary: '#155E75',
      cardBackground: '#FFFFFF'
    }
  },
  {
    id: 'sunset',
    name: 'Sunset',
    unlockScore: 5000,
    coinCost: 2500,
    isSecret: false,
    colors: {
      background: '#FFF7ED',
      board: '#FFEDD5',
      cellEmpty: '#FED7AA',
      cellFilled: '#F97316',
      accent: '#EA580C',
      textPrimary: '#7C2D12',
      textSecondary: '#9A3412',
      cardBackground: '#FFFFFF'
    }
  },
  {
    id: 'galaxy',
    name: 'Galaxy',
    unlockScore: 7500,
    coinCost: 3000,
    isSecret: false,
    colors: {
      background: '#1E1B4B',
      board: '#312E81',
      cellEmpty: '#4338CA',
      cellFilled: '#A78BFA',
      accent: '#8B5CF6',
      textPrimary: '#EDE9FE',
      textSecondary: '#C4B5FD',
      cardBackground: '#2E2A72'
    }
  },
  {
    id: 'golden',
    name: 'Golden',
    unlockScore: 0,
    coinCost: 0,
    isSecret: true,
    colors: {
      background: '#1C1408',
      board: '#3D2E0A',
      cellEmpty: '#5C440F',
      cellFilled: '#FFD700',
      accent: '#FFD700',
      textPrimary: '#FFFDF0',
      textSecondary: '#FDE047',
      cardBackground: '#2C2008',
      glowColor: '#FFD700'
    }
  }
];
