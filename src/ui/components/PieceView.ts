import Phaser from 'phaser';
import { CELL_SIZE, CELL_GAP, CELL_RADIUS, TRAY_SCALE } from '../../constants/gameplay';
import { PieceDefinition } from '../../types/Piece';
import { ThemeManager } from '../../managers/ThemeManager';
import { BlockRenderer } from './BlockRenderer';

/**
 * PIECE VIEW COMPONENT
 * Renders a tactile, 3D glossy jewel polyomino piece as a Phaser Container.
 * Defined in Document 03 & Milestone 6.5.
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
   * Redraws the piece blocks with 3D glossy jewel rendering.
   */
  public renderShape(): void {
    this.graphics.clear();
    const theme = ThemeManager.getInstance().getActiveColors();
    const tileColorHex = this.definition.color || theme.cellFilled;

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

          // 3D Glossy Jewel Block
          BlockRenderer.renderJewelBlock(this.graphics, x, y, CELL_SIZE, CELL_RADIUS, tileColorHex);
        }
      }
    }

    // Set interactive container hitbox for pointer events
    this.setSize(width, height);
  }
}
