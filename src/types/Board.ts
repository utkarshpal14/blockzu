/**
 * BOARD & GRID DATA INTERFACES
 */

export type CellState = 0 | 1;

export type BoardGrid = CellState[][];

export interface GridCoordinate {
  row: number;
  col: number;
}

export interface LineClearResult {
  clearedRows: number[];
  clearedCols: number[];
  totalLines: number;
  isCombo: boolean;
  scoreAwarded: number;
  placementScore: number;
  lineScore: number;
  comboBonus: number;
}

export interface CellRenderInfo {
  row: number;
  col: number;
  x: number;
  y: number;
  size: number;
  isOccupied: boolean;
  color?: string;
}
