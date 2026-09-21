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
import { AudioManager } from '../../managers/AudioManager';
import { PieceMatrix } from '../../types/Piece';
import { BlockRenderer } from './BlockRenderer';

/**
 * BOARD VIEW COMPONENT
 * Renders 3D glossy jewel blocks, deep recessed grid pockets, elevated glassmorphic
 * board framing, placement squash-and-stretch juice, and explosive line clears.
 * Defined in Document 02, 03 & Milestone 6.5.
 */
export class BoardView {
  private scene: Phaser.Scene;
  private boardManager: BoardManager;
  private themeManager: ThemeManager;

  private container: Phaser.GameObjects.Container;
  private bgGraphics: Phaser.GameObjects.Graphics;
  private dangerGlowGraphics: Phaser.GameObjects.Graphics;
  private emptyCellsGraphics: Phaser.GameObjects.Graphics;
  private impendingHighlightGraphics: Phaser.GameObjects.Graphics;
  private previewGraphics: Phaser.GameObjects.Graphics;
  private filledTilesContainer: Phaser.GameObjects.Container;
  private flashOverlayGraphics: Phaser.GameObjects.Graphics;
  private shockwaveGraphics: Phaser.GameObjects.Graphics;
  private particlesContainer: Phaser.GameObjects.Container;

  private filledTileObjects: (Phaser.GameObjects.Container | null)[][];
  private currentDangerTier: number = 0; // 0: none, 1: amber, 2: crimson, 3: critical
  private dangerTween: Phaser.Tweens.Tween | null = null;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.boardManager = BoardManager.getInstance();
    this.themeManager = ThemeManager.getInstance();

    this.container = this.scene.add.container(0, 0);
    this.dangerGlowGraphics = this.scene.add.graphics().setDepth(5);
    this.bgGraphics = this.scene.add.graphics().setDepth(8);
    this.emptyCellsGraphics = this.scene.add.graphics().setDepth(10);
    this.impendingHighlightGraphics = this.scene.add.graphics().setDepth(15);
    this.previewGraphics = this.scene.add.graphics().setDepth(18);
    this.filledTilesContainer = this.scene.add.container(0, 0).setDepth(20);
    this.flashOverlayGraphics = this.scene.add.graphics().setDepth(25);
    this.shockwaveGraphics = this.scene.add.graphics().setDepth(28);
    this.particlesContainer = this.scene.add.container(0, 0).setDepth(30);

    this.container.add([
      this.dangerGlowGraphics,
      this.bgGraphics,
      this.emptyCellsGraphics,
      this.impendingHighlightGraphics,
      this.previewGraphics,
      this.filledTilesContainer,
      this.flashOverlayGraphics,
      this.shockwaveGraphics,
      this.particlesContainer
    ]);

    this.filledTileObjects = [];
    for (let r = 0; r < GRID_SIZE; r++) {
      this.filledTileObjects[r] = new Array(GRID_SIZE).fill(null);
    }

    this.renderBoard();
  }

  /**
   * Renders elevated glassmorphic board frame and 64 deep recessed grid slots.
   */
  public renderBoard(): void {
    const theme = this.themeManager.getActiveColors();
    const boardColor = Phaser.Display.Color.HexStringToColor(theme.board).color;
    const cardBgColor = Phaser.Display.Color.HexStringToColor(theme.cardBackground).color;

    this.bgGraphics.clear();

    // 1. Deep Drop Shadow for Board Elevation
    this.bgGraphics.fillStyle(0x000000, 0.5);
    this.bgGraphics.fillRoundedRect(BOARD_CARD_X, BOARD_CARD_Y + 6, BOARD_CARD_WIDTH, BOARD_CARD_HEIGHT, 22);

    // 2. Board Frame Surface (Glassmorphic dark container)
    this.bgGraphics.fillStyle(cardBgColor, 0.95);
    this.bgGraphics.fillRoundedRect(BOARD_CARD_X, BOARD_CARD_Y, BOARD_CARD_WIDTH, BOARD_CARD_HEIGHT, 22);

    // 3. Subtle Metallic Bezel Outline
    this.bgGraphics.lineStyle(2, boardColor, 1);
    this.bgGraphics.strokeRoundedRect(BOARD_CARD_X, BOARD_CARD_Y, BOARD_CARD_WIDTH, BOARD_CARD_HEIGHT, 22);

    this.bgGraphics.lineStyle(1, 0xffffff, 0.18);
    this.bgGraphics.strokeRoundedRect(BOARD_CARD_X + 1, BOARD_CARD_Y + 1, BOARD_CARD_WIDTH - 2, BOARD_CARD_HEIGHT - 2, 21);

    // 4. 64 Deep Recessed Empty Cell Pockets
    this.emptyCellsGraphics.clear();
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        const pos = this.boardManager.getCellTopLeft(r, c);
        BlockRenderer.renderRecessedSlot(
          this.emptyCellsGraphics,
          pos.x,
          pos.y,
          CELL_SIZE,
          CELL_RADIUS,
          theme.cellEmpty
        );
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

            // Container for individual block allowing squash & stretch
            const tileContainer = this.scene.add.container(pos.x + CELL_SIZE / 2, pos.y + CELL_SIZE / 2);
            const tileG = this.scene.add.graphics();
            tileContainer.add(tileG);

            // Render 3D Jewel Block centered inside container
            BlockRenderer.renderJewelBlock(
              tileG,
              -CELL_SIZE / 2,
              -CELL_SIZE / 2,
              CELL_SIZE,
              CELL_RADIUS,
              tileColorHex
            );

            this.filledTilesContainer.add(tileContainer);
            this.filledTileObjects[r][c] = tileContainer;
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
   * Triggers a juicy squash-and-stretch tactile pop on placed blocks.
   */
  public animatePlacementJuice(placedCoords: { row: number; col: number }[]): void {
    const theme = this.themeManager.getActiveColors();
    const accentCol = Phaser.Display.Color.HexStringToColor(theme.accent).color;

    placedCoords.forEach(({ row, col }) => {
      const tile = this.filledTileObjects[row]?.[col];
      if (tile) {
        tile.setScale(1.18, 0.85); // Squash
        this.scene.tweens.add({
          targets: tile,
          scaleX: 0.94,
          scaleY: 1.08, // Stretch bounce
          duration: 60,
          ease: 'Quad.easeOut',
          onComplete: () => {
            this.scene.tweens.add({
              targets: tile,
              scaleX: 1.0,
              scaleY: 1.0,
              duration: 50,
              ease: 'Sine.easeInOut'
            });
          }
        });
      }

      // Micro-spark burst
      const center = this.boardManager.getCellCenter(row, col);
      this.spawnPlacementSparks(center.x, center.y, accentCol);
    });
  }

  /**
   * Draws real-time green/red placement ghost preview over target cells.
   */
  public drawGhostPreview(shape: PieceMatrix, startRow: number, startCol: number, isValid: boolean): void {
    this.previewGraphics.clear();

    const shapeRows = shape.length;
    const shapeCols = shape[0].length;

    for (let r = 0; r < shapeRows; r++) {
      for (let c = 0; c < shapeCols; c++) {
        if (shape[r][c] === 1) {
          const targetRow = startRow + r;
          const targetCol = startCol + c;

          if (this.boardManager.isInside(targetRow, targetCol)) {
            const pos = this.boardManager.getCellTopLeft(targetRow, targetCol);
            BlockRenderer.renderGhostBlock(
              this.previewGraphics,
              pos.x,
              pos.y,
              CELL_SIZE,
              CELL_RADIUS,
              isValid
            );
          }
        }
      }
    }
  }

  public clearGhostPreview(): void {
    this.previewGraphics.clear();
  }

  /**
   * Highlights full impending completed rows and columns with a brilliant neon aura,
   * glowing beam overlay, and perimeter sparkles during piece drag.
   * Matches Block Blast live anticipation visual effect.
   */
  public drawImpendingClearHighlight(rows: number[], cols: number[], pieceColorHex?: string): void {
    this.impendingHighlightGraphics.clear();
    if (rows.length === 0 && cols.length === 0) return;

    const theme = this.themeManager.getActiveColors();
    const auraColor = pieceColorHex
      ? Phaser.Display.Color.HexStringToColor(pieceColorHex).color
      : Phaser.Display.Color.HexStringToColor(theme.accent).color;

    const gridWidth = 8 * CELL_SIZE + 7 * CELL_GAP;
    const gridHeight = 8 * CELL_SIZE + 7 * CELL_GAP;

    // 1. Highlight Impending Rows
    rows.forEach((r) => {
      const pos = this.boardManager.getCellTopLeft(r, 0);
      const rx = pos.x - 3;
      const ry = pos.y - 3;
      const rw = gridWidth + 6;
      const rh = CELL_SIZE + 6;

      // Outer wide glow aura
      this.impendingHighlightGraphics.lineStyle(7, auraColor, 0.45);
      this.impendingHighlightGraphics.strokeRoundedRect(rx, ry, rw, rh, CELL_RADIUS + 3);

      // Mid neon stroke
      this.impendingHighlightGraphics.lineStyle(3, 0xffffff, 0.95);
      this.impendingHighlightGraphics.strokeRoundedRect(rx, ry, rw, rh, CELL_RADIUS + 3);

      // Inner color beam
      this.impendingHighlightGraphics.fillStyle(auraColor, 0.28);
      this.impendingHighlightGraphics.fillRoundedRect(rx, ry, rw, rh, CELL_RADIUS + 3);

      // Perimeter glowing sparkle dots along the row
      for (let c = 0; c < 8; c++) {
        const dotPos = this.boardManager.getCellCenter(r, c);
        this.impendingHighlightGraphics.fillStyle(0xffffff, 0.9);
        this.impendingHighlightGraphics.fillCircle(dotPos.x, ry + 1, 2);
        this.impendingHighlightGraphics.fillCircle(dotPos.x, ry + rh - 1, 2);
      }
    });

    // 2. Highlight Impending Columns
    cols.forEach((c) => {
      const pos = this.boardManager.getCellTopLeft(0, c);
      const cx = pos.x - 3;
      const cy = pos.y - 3;
      const cw = CELL_SIZE + 6;
      const ch = gridHeight + 6;

      // Outer wide glow aura
      this.impendingHighlightGraphics.lineStyle(7, auraColor, 0.45);
      this.impendingHighlightGraphics.strokeRoundedRect(cx, cy, cw, ch, CELL_RADIUS + 3);

      // Mid neon stroke
      this.impendingHighlightGraphics.lineStyle(3, 0xffffff, 0.95);
      this.impendingHighlightGraphics.strokeRoundedRect(cx, cy, cw, ch, CELL_RADIUS + 3);

      // Inner color beam
      this.impendingHighlightGraphics.fillStyle(auraColor, 0.28);
      this.impendingHighlightGraphics.fillRoundedRect(cx, cy, cw, ch, CELL_RADIUS + 3);

      // Perimeter glowing sparkle dots along the column
      for (let r = 0; r < 8; r++) {
        const dotPos = this.boardManager.getCellCenter(r, c);
        this.impendingHighlightGraphics.fillStyle(0xffffff, 0.9);
        this.impendingHighlightGraphics.fillCircle(cx + 1, dotPos.y, 2);
        this.impendingHighlightGraphics.fillCircle(cx + cw - 1, dotPos.y, 2);
      }
    });
  }

  public clearImpendingClearHighlight(): void {
    this.impendingHighlightGraphics.clear();
  }

  /**
   * Evaluates grid occupancy and updates multi-tiered danger aura:
   * - < 70% (0-44 cells): Inactive
   * - 70%+ (45-53 cells): Soft amber glow (0xF59E0B)
   * - 85%+ (54-60 cells): Strong crimson pulse (0xEF4444)
   * - 95%+ (61-64 cells): Intense pulse (0xDC2626) + subtle warning audio
   */
  public updateDangerAura(occupiedCount: number): void {
    let newTier = 0;
    if (occupiedCount >= 61) {
      newTier = 3;
    } else if (occupiedCount >= 54) {
      newTier = 2;
    } else if (occupiedCount >= 45) {
      newTier = 1;
    }

    if (newTier === this.currentDangerTier) return;
    this.currentDangerTier = newTier;
    AudioManager.getInstance().setDangerTier(newTier);

    if (this.dangerTween) {
      this.dangerTween.stop();
      this.dangerTween = null;
    }

    this.dangerGlowGraphics.clear();
    this.dangerGlowGraphics.setAlpha(1);

    if (newTier === 0) {
      return;
    }

    const bx = BOARD_CARD_X - 6;
    const by = BOARD_CARD_Y - 6;
    const bw = BOARD_CARD_WIDTH + 12;
    const bh = BOARD_CARD_HEIGHT + 12;

    if (newTier === 1) {
      // 70%: Soft Amber Glow
      this.dangerGlowGraphics.lineStyle(6, 0xF59E0B, 0.45);
      this.dangerGlowGraphics.strokeRoundedRect(bx, by, bw, bh, 26);
      this.dangerGlowGraphics.lineStyle(2, 0xFDE047, 0.6);
      this.dangerGlowGraphics.strokeRoundedRect(bx + 2, by + 2, bw - 4, bh - 4, 24);
    } else if (newTier === 2) {
      // 85%: Strong Crimson Pulse
      this.dangerGlowGraphics.lineStyle(8, 0xEF4444, 0.75);
      this.dangerGlowGraphics.strokeRoundedRect(bx, by, bw, bh, 26);
      this.dangerGlowGraphics.lineStyle(3, 0xF87171, 0.85);
      this.dangerGlowGraphics.strokeRoundedRect(bx + 2, by + 2, bw - 4, bh - 4, 24);

      this.dangerTween = this.scene.tweens.add({
        targets: this.dangerGlowGraphics,
        alpha: 0.35,
        duration: 650,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    } else if (newTier === 3) {
      // 95%: Intense Critical Pulse + Warning Tone
      this.dangerGlowGraphics.lineStyle(10, 0xDC2626, 0.95);
      this.dangerGlowGraphics.strokeRoundedRect(bx, by, bw, bh, 26);
      this.dangerGlowGraphics.lineStyle(4, 0xFFFFFF, 0.9);
      this.dangerGlowGraphics.strokeRoundedRect(bx + 2, by + 2, bw - 4, bh - 4, 24);

      this.dangerTween = this.scene.tweens.add({
        targets: this.dangerGlowGraphics,
        alpha: 0.25,
        duration: 320,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });

      AudioManager.getInstance().playDangerWarning();
    }
  }

  /**
   * Explosive line clear sequence:
   * 1. 50ms Radiant Neon Beam Flash
   * 2. Expanding Shockwave Ring & Star Particles
   * 3. 100ms Shrink + 50ms Fade
   */
  public animateLineClears(rows: number[], cols: number[], onComplete?: () => void): void {
    const uniqueCellKeys = new Set<string>();
    const uniqueCells: { row: number; col: number; obj: Phaser.GameObjects.Container }[] = [];

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

    // 1. Draw Intense Neon Laser Aura around clearing rows and columns
    this.flashOverlayGraphics.clear();

    const gridWidth = 8 * CELL_SIZE + 7 * CELL_GAP;
    const gridHeight = 8 * CELL_SIZE + 7 * CELL_GAP;

    // Rows Laser Aura
    rows.forEach((r) => {
      const pos = this.boardManager.getCellTopLeft(r, 0);
      const rx = pos.x - 3;
      const ry = pos.y - 3;
      const rw = gridWidth + 6;
      const rh = CELL_SIZE + 6;

      this.flashOverlayGraphics.lineStyle(6, particleColor, 0.5);
      this.flashOverlayGraphics.strokeRoundedRect(rx, ry, rw, rh, CELL_RADIUS + 2);
      this.flashOverlayGraphics.lineStyle(3, 0xffffff, 0.9);
      this.flashOverlayGraphics.strokeRoundedRect(rx, ry, rw, rh, CELL_RADIUS + 2);
      this.flashOverlayGraphics.fillStyle(0xffffff, 0.4);
      this.flashOverlayGraphics.fillRoundedRect(rx, ry, rw, rh, CELL_RADIUS + 2);
    });

    // Cols Laser Aura
    cols.forEach((c) => {
      const pos = this.boardManager.getCellTopLeft(0, c);
      const cx = pos.x - 3;
      const cy = pos.y - 3;
      const cw = CELL_SIZE + 6;
      const ch = gridHeight + 6;

      this.flashOverlayGraphics.lineStyle(6, particleColor, 0.5);
      this.flashOverlayGraphics.strokeRoundedRect(cx, cy, cw, ch, CELL_RADIUS + 2);
      this.flashOverlayGraphics.lineStyle(3, 0xffffff, 0.9);
      this.flashOverlayGraphics.strokeRoundedRect(cx, cy, cw, ch, CELL_RADIUS + 2);
      this.flashOverlayGraphics.fillStyle(0xffffff, 0.4);
      this.flashOverlayGraphics.fillRoundedRect(cx, cy, cw, ch, CELL_RADIUS + 2);
    });

    // 2. Expanding Shockwave Ring across Board
    this.triggerShockwaveRing(BOARD_CARD_X + BOARD_CARD_WIDTH / 2, BOARD_CARD_Y + BOARD_CARD_HEIGHT / 2, particleColor);

    this.scene.time.delayedCall(LINE_FLASH_DURATION, () => {
      this.flashOverlayGraphics.clear();

      // 3. Spawn Bursting Star & Sparkle Particles per unique cell
      uniqueCells.forEach(({ row, col }) => {
        const center = this.boardManager.getCellCenter(row, col);
        this.spawnCellFireworks(center.x, center.y, particleColor);
      });

      // 4. Shrink & Fade
      const tileObjects = uniqueCells.map((c) => c.obj);
      this.scene.tweens.add({
        targets: tileObjects,
        scale: 0.05,
        alpha: 0,
        duration: LINE_SHRINK_DURATION + LINE_FADE_DURATION,
        ease: 'Cubic.easeIn',
        onComplete: () => {
          this.boardManager.clearLines(rows, cols);
          this.updateFilledTiles();
          if (onComplete) onComplete();
        }
      });
    });
  }

  /**
   * Generates a dynamic expanding shockwave energy ring across the board.
   */
  private triggerShockwaveRing(centerX: number, centerY: number, color: number) {
    this.shockwaveGraphics.clear();
    const shockwave = { radius: 10, alpha: 0.9, strokeWidth: 5 };

    this.scene.tweens.add({
      targets: shockwave,
      radius: 190,
      alpha: 0,
      strokeWidth: 1,
      duration: 320,
      ease: 'Quad.easeOut',
      onUpdate: () => {
        this.shockwaveGraphics.clear();
        if (shockwave.alpha > 0.01) {
          this.shockwaveGraphics.lineStyle(shockwave.strokeWidth, color, shockwave.alpha);
          this.shockwaveGraphics.strokeCircle(centerX, centerY, shockwave.radius);
          this.shockwaveGraphics.lineStyle(Math.max(1, shockwave.strokeWidth - 2), 0xFFFFFF, shockwave.alpha * 0.8);
          this.shockwaveGraphics.strokeCircle(centerX, centerY, shockwave.radius * 0.94);
        }
      },
      onComplete: () => {
        this.shockwaveGraphics.clear();
      }
    });
  }

  /**
   * Micro-spark pop when a piece is dropped onto the board.
   */
  private spawnPlacementSparks(x: number, y: number, color: number): void {
    const count = 6;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() * 0.4 - 0.2);
      const speed = Math.random() * 20 + 15;
      const spark = this.scene.add.circle(x, y, 2, color);
      this.particlesContainer.add(spark);

      this.scene.tweens.add({
        targets: spark,
        x: x + Math.cos(angle) * speed,
        y: y + Math.sin(angle) * speed,
        alpha: 0,
        scale: 0.2,
        duration: 180,
        ease: 'Quad.easeOut',
        onComplete: () => spark.destroy()
      });
    }
  }

  /**
   * Radiant star bursts and fireworks particle explosion on line clear.
   */
  private spawnCellFireworks(x: number, y: number, color: number): void {
    const count = 12;
    const colors = [color, 0xFFD700, 0xFFFFFF, 0x38BDF8];

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() * 0.5 - 0.25);
      const speed = Math.random() * 55 + 30;
      const col = colors[Phaser.Math.Between(0, colors.length - 1)];

      const spark = this.scene.add.circle(x, y, Phaser.Math.FloatBetween(2, 3.8), col);
      this.particlesContainer.add(spark);

      this.scene.tweens.add({
        targets: spark,
        x: x + Math.cos(angle) * speed,
        y: y + Math.sin(angle) * speed,
        alpha: 0,
        scale: 0.1,
        duration: Phaser.Math.Between(260, 420),
        ease: 'Cubic.easeOut',
        onComplete: () => spark.destroy()
      });
    }
  }

  public destroy(): void {
    if (this.dangerTween) {
      this.dangerTween.stop();
      this.dangerTween = null;
    }
    this.container.destroy();
  }
}
