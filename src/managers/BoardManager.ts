import { GRID_SIZE, CELL_SIZE, CELL_GAP, BOARD_GRID_START_X, BOARD_GRID_START_Y } from '../constants/gameplay';
import { CellState, BoardGrid, GridCoordinate, LineClearResult } from '../types/Board';
import { PieceMatrix, PlacedTile } from '../types/Piece';

/**
 * BOARD MANAGER
 * Manages the 8x8 grid data model, spatial calculations, and placement validation.
 * Architecture defined in Document 03 (Technical Architecture) & Document 02 (GDD).
 */
export class BoardManager {
  private static instance: BoardManager;
  private grid: BoardGrid;
  private cellColors: (string | null)[][];

  private constructor() {
    this.grid = this.createEmptyGrid();
    this.cellColors = this.createEmptyColorGrid();
  }

  public static getInstance(): BoardManager {
    if (!BoardManager.instance) {
      BoardManager.instance = new BoardManager();
    }
    return BoardManager.instance;
  }

  private createEmptyGrid(): BoardGrid {
    const grid: BoardGrid = [];
    for (let r = 0; r < GRID_SIZE; r++) {
      grid[r] = new Array(GRID_SIZE).fill(0);
    }
    return grid;
  }

  private createEmptyColorGrid(): (string | null)[][] {
    const colors: (string | null)[][] = [];
    for (let r = 0; r < GRID_SIZE; r++) {
      colors[r] = new Array(GRID_SIZE).fill(null);
    }
    return colors;
  }

  /**
   * Resets the board to an empty state.
   */
  public reset(): void {
    this.grid = this.createEmptyGrid();
    this.cellColors = this.createEmptyColorGrid();
  }

  public getGrid(): BoardGrid {
    return this.grid;
  }

  public getColorGrid(): (string | null)[][] {
    return this.cellColors;
  }

  public isInside(row: number, col: number): boolean {
    return row >= 0 && row < GRID_SIZE && col >= 0 && col < GRID_SIZE;
  }

  public isCellOccupied(row: number, col: number): boolean {
    if (!this.isInside(row, col)) return true;
    return this.grid[row][col] === 1;
  }

  /**
   * Gets top-left world coordinates for a given cell.
   */
  public getCellTopLeft(row: number, col: number): { x: number; y: number } {
    const x = BOARD_GRID_START_X + col * (CELL_SIZE + CELL_GAP);
    const y = BOARD_GRID_START_Y + row * (CELL_SIZE + CELL_GAP);
    return { x, y };
  }

  /**
   * Gets center world coordinates for a given cell.
   */
  public getCellCenter(row: number, col: number): { x: number; y: number } {
    const topLeft = this.getCellTopLeft(row, col);
    return {
      x: topLeft.x + CELL_SIZE / 2,
      y: topLeft.y + CELL_SIZE / 2
    };
  }

  /**
   * Maps world pixel position to closest cell row & col.
   */
  public getGridCoordinateFromWorld(worldX: number, worldY: number): GridCoordinate | null {
    const col = Math.floor((worldX - BOARD_GRID_START_X + CELL_GAP / 2) / (CELL_SIZE + CELL_GAP));
    const row = Math.floor((worldY - BOARD_GRID_START_Y + CELL_GAP / 2) / (CELL_SIZE + CELL_GAP));

    if (this.isInside(row, col)) {
      return { row, col };
    }
    return null;
  }

  /**
   * Validates if a polyomino piece can be placed starting at (startRow, startCol).
   */
  public canPlacePiece(shape: PieceMatrix, startRow: number, startCol: number): boolean {
    const shapeRows = shape.length;
    const shapeCols = shape[0].length;

    for (let r = 0; r < shapeRows; r++) {
      for (let c = 0; c < shapeCols; c++) {
        if (shape[r][c] === 1) {
          const targetRow = startRow + r;
          const targetCol = startCol + c;

          // Must be within 8x8 boundaries
          if (!this.isInside(targetRow, targetCol)) {
            return false;
          }

          // Must not overlap an occupied cell
          if (this.grid[targetRow][targetCol] === 1) {
            return false;
          }
        }
      }
    }
    return true;
  }

  /**
   * Commits placement of a piece onto the grid.
   */
  public placePiece(shape: PieceMatrix, startRow: number, startCol: number, color?: string): PlacedTile[] {
    if (!this.canPlacePiece(shape, startRow, startCol)) {
      return [];
    }

    const placedTiles: PlacedTile[] = [];
    const shapeRows = shape.length;
    const shapeCols = shape[0].length;

    for (let r = 0; r < shapeRows; r++) {
      for (let c = 0; c < shapeCols; c++) {
        if (shape[r][c] === 1) {
          const targetRow = startRow + r;
          const targetCol = startCol + c;
          this.grid[targetRow][targetCol] = 1;
          this.cellColors[targetRow][targetCol] = color || null;
          placedTiles.push({
            row: targetRow,
            col: targetCol,
            color: color || '#3B82F6'
          });
        }
      }
    }

    return placedTiles;
  }

  /**
   * Checks for any completed rows and columns.
   */
  public findCompletedLines(): { rows: number[]; cols: number[] } {
    const rows: number[] = [];
    const cols: number[] = [];

    // Check full rows
    for (let r = 0; r < GRID_SIZE; r++) {
      let full = true;
      for (let c = 0; c < GRID_SIZE; c++) {
        if (this.grid[r][c] === 0) {
          full = false;
          break;
        }
      }
      if (full) rows.push(r);
    }

    // Check full columns
    for (let c = 0; c < GRID_SIZE; c++) {
      let full = true;
      for (let r = 0; r < GRID_SIZE; r++) {
        if (this.grid[r][c] === 0) {
          full = false;
          break;
        }
      }
      if (full) cols.push(c);
    }

    return { rows, cols };
  }

  /**
   * Simulates placing a piece at (startRow, startCol) and returns the completed lines if placed.
   * Used for real-time impending line clear highlights during drag.
   */
  public getPotentialCompletedLines(shape: PieceMatrix, startRow: number, startCol: number): { rows: number[]; cols: number[] } {
    if (!this.canPlacePiece(shape, startRow, startCol)) {
      return { rows: [], cols: [] };
    }

    const rows: number[] = [];
    const cols: number[] = [];
    const shapeRows = shape.length;
    const shapeCols = shape[0].length;

    // Check rows
    for (let r = 0; r < GRID_SIZE; r++) {
      let full = true;
      for (let c = 0; c < GRID_SIZE; c++) {
        let isFilled = this.grid[r][c] === 1;
        if (!isFilled) {
          const pr = r - startRow;
          const pc = c - startCol;
          if (pr >= 0 && pr < shapeRows && pc >= 0 && pc < shapeCols && shape[pr][pc] === 1) {
            isFilled = true;
          }
        }
        if (!isFilled) {
          full = false;
          break;
        }
      }
      if (full) rows.push(r);
    }

    // Check columns
    for (let c = 0; c < GRID_SIZE; c++) {
      let full = true;
      for (let r = 0; r < GRID_SIZE; r++) {
        let isFilled = this.grid[r][c] === 1;
        if (!isFilled) {
          const pr = r - startRow;
          const pc = c - startCol;
          if (pr >= 0 && pr < shapeRows && pc >= 0 && pc < shapeCols && shape[pr][pc] === 1) {
            isFilled = true;
          }
        }
        if (!isFilled) {
          full = false;
          break;
        }
      }
      if (full) cols.push(c);
    }

    return { rows, cols };
  }

  /**
   * Clears specified rows and columns.
   */
  public clearLines(rows: number[], cols: number[]): void {
    rows.forEach((r) => {
      for (let c = 0; c < GRID_SIZE; c++) {
        this.grid[r][c] = 0;
        this.cellColors[r][c] = null;
      }
    });

    cols.forEach((c) => {
      for (let r = 0; r < GRID_SIZE; r++) {
        this.grid[r][c] = 0;
        this.cellColors[r][c] = null;
      }
    });
  }

  /**
   * Checks if a piece shape can fit ANYWHERE on the board.
   * Used for Game Over detection.
   */
  public hasAnyValidPlacement(shape: PieceMatrix): boolean {
    const shapeRows = shape.length;
    const shapeCols = shape[0].length;

    for (let r = 0; r <= GRID_SIZE - shapeRows; r++) {
      for (let c = 0; c <= GRID_SIZE - shapeCols; c++) {
        if (this.canPlacePiece(shape, r, c)) {
          return true;
        }
      }
    }
    return false;
  }

  public getFilledCellCount(): number {
    let count = 0;
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (this.grid[r][c] === 1) count++;
      }
    }
    return count;
  }
}
