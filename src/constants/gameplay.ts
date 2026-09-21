/**
 * GAMEPLAY CONSTANTS
 * Grid dimensions, timings, board layout, and scoring rules.
 */

export const GRID_SIZE = 8;
export const TOTAL_CELLS = 64;
export const TRAY_CAPACITY = 3;

export const CANVAS_WIDTH = 450;
export const CANVAS_HEIGHT = 800;

// Board Geometry (Perfect fit for 450x800)
export const CELL_SIZE = 45;
export const CELL_GAP = 5;
export const CELL_RADIUS = 7;

export const BOARD_CARD_WIDTH = 420;
export const BOARD_CARD_HEIGHT = 420;
export const BOARD_CARD_X = (CANVAS_WIDTH - BOARD_CARD_WIDTH) / 2; // 15
export const BOARD_CARD_Y = 105;

// Grid Start Coordinates (Inside Board Card)
export const BOARD_GRID_START_X = BOARD_CARD_X + 12.5;
export const BOARD_GRID_START_Y = BOARD_CARD_Y + 12.5;

// Scoring Constants
export const POINTS_PER_BLOCK = 1;
export const POINTS_PER_LINE = 10;
export const COMBO_MULTIPLIER_PER_LINE = 5;

// Animation Timings (ms)
export const PLACEMENT_ANIM_DURATION = 80;
export const LINE_CLEAR_ANIM_DURATION = 250;
export const COMBO_POPUP_DURATION = 600;
export const TRAY_PICKUP_SCALE = 1.08;

// Ad Frequency Constants
export const INTERSTITIAL_GAME_INTERVAL = 4;
export const REWARDED_COIN_AMOUNT = 100;
export const DAILY_REWARDED_AD_LIMIT = 5;
export const MAX_COIN_CAP = 99999;
