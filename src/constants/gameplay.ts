/**
 * GAMEPLAY & VISUAL CONSTANTS (GameConstants)
 * Centralizes all geometry, timing, scaling, and scoring constants.
 */

// Grid & Board Dimensions
export const BOARD_SIZE = 8;
export const GRID_SIZE = 8;
export const TOTAL_CELLS = 64;
export const TRAY_CAPACITY = 3;

export const CANVAS_WIDTH = 450;
export const CANVAS_HEIGHT = 800;

// Board Geometry
export const TILE_SIZE = 45;
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

// Tray Layout & Scaling (Block Blast Style)
export const TRAY_Y = 650;
export const TRAY_SLOT_X_OFFSETS = [85, 225, 365];
export const TRAY_SCALE = 0.55;
export const DRAG_SCALE = 1.0;
export const DRAG_OFFSET_Y = 60; // Configurable finger offset

// Fast Responsive Animation Timings (ms) - Block Blast style
export const SNAP_DURATION = 80;
export const PLACEMENT_ANIM_DURATION = 80;
export const SPRING_BACK_DURATION = 160;

export const LINE_CLEAR_ANIM_DURATION = 200; // 50ms flash + 100ms shrink + 50ms fade
export const LINE_FLASH_DURATION = 50;
export const LINE_SHRINK_DURATION = 100;
export const LINE_FADE_DURATION = 50;

export const FLOATING_TEXT_DURATION = 400;
export const SCREEN_SHAKE_DURATION = 100;

// Scoring Constants
export const POINTS_PER_BLOCK = 1;
export const POINTS_PER_LINE = 10;
export const COMBO_MULTIPLIER_PER_LINE = 5;

// Ad Frequency & Limits
export const INTERSTITIAL_GAME_INTERVAL = 4;
export const REWARDED_COIN_AMOUNT = 100;
export const DAILY_REWARDED_AD_LIMIT = 5;
export const MAX_COIN_CAP = 99999;
