import Phaser from 'phaser';
import { CELL_SIZE, CELL_GAP, CELL_RADIUS, TRAY_SCALE } from '../../constants/gameplay';
import { PieceDefinition } from '../../types/Piece';
import { ThemeManager } from '../../managers/ThemeManager';

/**
 * PIECE VIEW COMPONENT
 * Renders a tactile, glossy polyomino piece as a Phaser Container.
 * Pure view component (receives pure data PieceDefinition).
 */
export class PieceView extends Phaser.GameObjects.Container {
  private definition: PieceDefinition;
  private graphics: Phaser.GameObjects.Graphics;
  private shapeWidth: number = 0;
  private shapeHeight: number = 0;

  constructor(scene: Phaser.Scene, x: number, y: number, definition: PieceDefinition) {
    super(scene, x, y);
    this.definition = definition;
    this.graphics = scene.add.graphics();
    this.add(this.graphics);

    this.renderShape();
    this.setScale(TRAY_SCALE);
    scene.add.existing(this);
  }

  public getDefinition(): PieceDefinition {
    return this.definition;
  }

  public getShapeDimensions(): { width: number; height: number; rows: number; cols: number } {
    const rows = this.definition.cells.length;
    const cols = this.definition.cells[0].length;
    const width = cols * CELL_SIZE + (cols - 1) * CELL_GAP;
    const height = rows * CELL_SIZE + (rows - 1) * CELL_GAP;
    return { width, height, rows, cols };
  }

  /**
   * Redraws the piece blocks with theme colors and gloss highlights.
   */
  public renderShape(): void {
    this.graphics.clear();
    const theme = ThemeManager.getInstance().getActiveColors();
    const tileColor = Phaser.Display.Color.HexStringToColor(theme.cellFilled).color;

    const { width, height, rows, cols } = this.getShapeDimensions();
    this.shapeWidth = width;
    this.shapeHeight = height;

    // Offset blocks so container (0,0) is at the geometric center
    const startX = -width / 2;
    const startY = -height / 2;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (this.definition.cells[r][c] === 1) {
          const x = startX + c * (CELL_SIZE + CELL_GAP);
          const y = startY + r * (CELL_SIZE + CELL_GAP);

          // 1. Base Tile Body
          this.graphics.fillStyle(tileColor, 1);
          this.graphics.fillRoundedRect(x, y, CELL_SIZE, CELL_SIZE, CELL_RADIUS);

          // 2. Gloss highlight (top shine)
          this.graphics.fillStyle(0xffffff, 0.22);
          this.graphics.fillRoundedRect(x + 2, y + 2, CELL_SIZE - 4, CELL_SIZE * 0.35, Math.max(CELL_RADIUS - 2, 2));

          // 3. Subtle stroke border
          this.graphics.lineStyle(1.5, 0xffffff, 0.3);
          this.graphics.strokeRoundedRect(x, y, CELL_SIZE, CELL_SIZE, CELL_RADIUS);
        }
      }
    }

    // Set interactive container hitbox for pointer events
    this.setSize(width, height);
  }
}
