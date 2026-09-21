import Phaser from 'phaser';
import {
  GRID_SIZE,
  CELL_SIZE,
  CELL_GAP,
  CELL_RADIUS,
  BOARD_CARD_X,
  BOARD_CARD_Y,
  BOARD_CARD_WIDTH,
  BOARD_CARD_HEIGHT,
  LINE_FLASH_DURATION,
  LINE_SHRINK_DURATION,
  LINE_FADE_DURATION
} from '../../constants/gameplay';
import { BoardManager } from '../../managers/BoardManager';
import { ThemeManager } from '../../managers/ThemeManager';
import { PieceMatrix } from '../../types/Piece';

/**
 * BOARD VIEW COMPONENT
 * Handles visual rendering of the 8x8 board card, cell slots, filled blocks, ghost previews,
 * and high-performance 200ms line clear sequences with particle bursts.
 */
export class BoardView {
  private scene: Phaser.Scene;
  private boardManager: BoardManager;
  private themeManager: ThemeManager;

  private container: Phaser.GameObjects.Container;
  private bgGraphics: Phaser.GameObjects.Graphics;
  private emptyCellsGraphics: Phaser.GameObjects.Graphics;
  private previewGraphics: Phaser.GameObjects.Graphics;
  private filledTilesContainer: Phaser.GameObjects.Container;
  private flashOverlayGraphics: Phaser.GameObjects.Graphics;
  private particlesContainer: Phaser.GameObjects.Container;

  private filledTileObjects: (Phaser.GameObjects.Graphics | null)[][];

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.boardManager = BoardManager.getInstance();
    this.themeManager = ThemeManager.getInstance();

    this.container = this.scene.add.container(0, 0);
    this.bgGraphics = this.scene.add.graphics();
    this.emptyCellsGraphics = this.scene.add.graphics();
    this.previewGraphics = this.scene.add.graphics();
    this.filledTilesContainer = this.scene.add.container(0, 0);
    this.flashOverlayGraphics = this.scene.add.graphics().setDepth(20);
    this.particlesContainer = this.scene.add.container(0, 0).setDepth(30);

    this.container.add([
      this.bgGraphics,
      this.emptyCellsGraphics,
      this.previewGraphics,
      this.filledTilesContainer,
      this.flashOverlayGraphics,
      this.particlesContainer
    ]);

    this.filledTileObjects = [];
    for (let r = 0; r < GRID_SIZE; r++) {
      this.filledTileObjects[r] = new Array(GRID_SIZE).fill(null);
    }

    this.renderBoard();
  }

  /**
   * Renders the board background card and 64 cell slots.
   */
  public renderBoard(): void {
    const theme = this.themeManager.getActiveColors();
    const boardColor = Phaser.Display.Color.HexStringToColor(theme.board).color;
    const cardBgColor = Phaser.Display.Color.HexStringToColor(theme.cardBackground).color;
    const emptyCellColor = Phaser.Display.Color.HexStringToColor(theme.cellEmpty).color;

    // 1. Board Card (Outer container with elevation effect)
    this.bgGraphics.clear();

    // Soft drop shadow simulation
    this.bgGraphics.fillStyle(0x000000, 0.15);
    this.bgGraphics.fillRoundedRect(BOARD_CARD_X, BOARD_CARD_Y + 4, BOARD_CARD_WIDTH, BOARD_CARD_HEIGHT, 18);

    // Board Card Surface
    this.bgGraphics.fillStyle(cardBgColor, 0.95);
    this.bgGraphics.lineStyle(1.5, boardColor, 0.8);
    this.bgGraphics.fillRoundedRect(BOARD_CARD_X, BOARD_CARD_Y, BOARD_CARD_WIDTH, BOARD_CARD_HEIGHT, 18);
    this.bgGraphics.strokeRoundedRect(BOARD_CARD_X, BOARD_CARD_Y, BOARD_CARD_WIDTH, BOARD_CARD_HEIGHT, 18);

    // 2. 64 Empty Cell Slots
    this.emptyCellsGraphics.clear();
    this.emptyCellsGraphics.fillStyle(emptyCellColor, 0.35);

    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        const pos = this.boardManager.getCellTopLeft(r, c);
        this.emptyCellsGraphics.fillRoundedRect(pos.x, pos.y, CELL_SIZE, CELL_SIZE, CELL_RADIUS);
      }
    }

    this.updateFilledTiles();
  }

  /**
   * Synchronizes visual filled tiles with the BoardManager grid state.
   */
  public updateFilledTiles(): void {
    const grid = this.boardManager.getGrid();
    const colorGrid = this.boardManager.getColorGrid();
    const theme = this.themeManager.getActiveColors();
    const defaultColor = theme.cellFilled;

    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (grid[r][c] === 1) {
          if (!this.filledTileObjects[r][c]) {
            const pos = this.boardManager.getCellTopLeft(r, c);
            const tileColorHex = colorGrid[r][c] || defaultColor;
            const tileColor = Phaser.Display.Color.HexStringToColor(tileColorHex).color;

            const tile = this.scene.add.graphics();
            tile.fillStyle(tileColor, 1);
            tile.fillRoundedRect(pos.x, pos.y, CELL_SIZE, CELL_SIZE, CELL_RADIUS);

            // Subtle gloss border
            tile.lineStyle(1.5, 0xffffff, 0.25);
            tile.strokeRoundedRect(pos.x, pos.y, CELL_SIZE, CELL_SIZE, CELL_RADIUS);

            this.filledTilesContainer.add(tile);
            this.filledTileObjects[r][c] = tile;
          }
        } else {
          if (this.filledTileObjects[r][c]) {
            this.filledTileObjects[r][c]?.destroy();
            this.filledTileObjects[r][c] = null;
          }
        }
      }
    }
  }

  /**
   * Draws real-time green/red placement ghost preview over target cells.
   */
  public drawGhostPreview(shape: PieceMatrix, startRow: number, startCol: number, isValid: boolean): void {
    this.previewGraphics.clear();
    const color = isValid ? 0x22c55e : 0xef4444; // Green vs Red
    const alpha = isValid ? 0.45 : 0.35;

    const shapeRows = shape.length;
    const shapeCols = shape[0].length;

    for (let r = 0; r < shapeRows; r++) {
      for (let c = 0; c < shapeCols; c++) {
        if (shape[r][c] === 1) {
          const targetRow = startRow + r;
          const targetCol = startCol + c;

          if (this.boardManager.isInside(targetRow, targetCol)) {
            const pos = this.boardManager.getCellTopLeft(targetRow, targetCol);
            this.previewGraphics.fillStyle(color, alpha);
            this.previewGraphics.fillRoundedRect(pos.x, pos.y, CELL_SIZE, CELL_SIZE, CELL_RADIUS);
            this.previewGraphics.lineStyle(2, color, 0.8);
            this.previewGraphics.strokeRoundedRect(pos.x, pos.y, CELL_SIZE, CELL_SIZE, CELL_RADIUS);
          }
        }
      }
    }
  }

  /**
   * Clears ghost placement preview.
   */
  public clearGhostPreview(): void {
    this.previewGraphics.clear();
  }

  /**
   * Fast, punchy 200ms line clear sequence:
   * 1. 50ms White Flash on unique cells (Set<string> deduplication)
   * 2. 100ms Shrink + 8-12 Particle Sparks
   * 3. 50ms Fade to empty
   */
  public animateLineClears(rows: number[], cols: number[], onComplete?: () => void): void {
    // 1. Deduplicate unique cells using Set<string> ("row-col")
    const uniqueCellKeys = new Set<string>();
    const uniqueCells: { row: number; col: number; obj: Phaser.GameObjects.Graphics }[] = [];

    rows.forEach((r) => {
      for (let c = 0; c < GRID_SIZE; c++) {
        const key = `${r}-${c}`;
        if (!uniqueCellKeys.has(key)) {
          uniqueCellKeys.add(key);
          const obj = this.filledTileObjects[r][c];
          if (obj) {
            uniqueCells.push({ row: r, col: c, obj });
          }
        }
      }
    });

    cols.forEach((c) => {
      for (let r = 0; r < GRID_SIZE; r++) {
        const key = `${r}-${c}`;
        if (!uniqueCellKeys.has(key)) {
          uniqueCellKeys.add(key);
          const obj = this.filledTileObjects[r][c];
          if (obj) {
            uniqueCells.push({ row: r, col: c, obj });
          }
        }
      }
    });

    if (uniqueCells.length === 0) {
      if (onComplete) onComplete();
      return;
    }

    const theme = this.themeManager.getActiveColors();
    const particleColor = Phaser.Display.Color.HexStringToColor(theme.accent).color;

    // Step 1: 50ms Flash Overlay
    this.flashOverlayGraphics.clear();
    this.flashOverlayGraphics.fillStyle(0xffffff, 0.7);
    uniqueCells.forEach(({ row, col }) => {
      const pos = this.boardManager.getCellTopLeft(row, col);
      this.flashOverlayGraphics.fillRoundedRect(pos.x, pos.y, CELL_SIZE, CELL_SIZE, CELL_RADIUS);
    });

    this.scene.time.delayedCall(LINE_FLASH_DURATION, () => {
      this.flashOverlayGraphics.clear();

      // Step 2: Spawn 8-10 lightweight particle sparks per unique cell
      uniqueCells.forEach(({ row, col }) => {
        const center = this.boardManager.getCellCenter(row, col);
        this.spawnCellSparks(center.x, center.y, particleColor);
      });

      // Step 3: Shrink (100ms) & Fade (50ms)
      const tileObjects = uniqueCells.map((c) => c.obj);
      this.scene.tweens.add({
        targets: tileObjects,
        scale: 0.1,
        alpha: 0,
        duration: LINE_SHRINK_DURATION + LINE_FADE_DURATION,
        ease: 'Quad.easeIn',
        onComplete: () => {
          this.boardManager.clearLines(rows, cols);
          this.updateFilledTiles();
          if (onComplete) onComplete();
        }
      });
    });
  }

  /**
   * Lightweight particle sparks (8-10 particles, 250ms lifetime).
   */
  private spawnCellSparks(x: number, y: number, color: number): void {
    const count = 8;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() * 0.4 - 0.2);
      const speed = Math.random() * 35 + 25;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;

      const spark = this.scene.add.graphics();
      spark.fillStyle(color, 1);
      spark.fillCircle(0, 0, Math.random() * 2.5 + 2);
      spark.x = x;
      spark.y = y;

      this.particlesContainer.add(spark);

      this.scene.tweens.add({
        targets: spark,
        x: x + vx,
        y: y + vy,
        alpha: 0,
        scale: 0.2,
        duration: 250,
        ease: 'Quad.easeOut',
        onComplete: () => {
          spark.destroy();
        }
      });
    }
  }

  public destroy(): void {
    this.container.destroy();
  }
}
