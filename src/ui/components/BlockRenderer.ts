import Phaser from 'phaser';

/**
 * BLOCK RENDERER
 * High-performance vector graphics pipeline for rendering 3D glossy jewel blocks,
 * recessed board grid pockets, and ghost placement indicators.
 * Implements Milestone 6.5 Premium Visual Polish.
 */
export class BlockRenderer {
  /**
   * Renders a tactile, 3D glossy jewel block with bevels, top glass highlight,
   * drop shadow, and corner specular glint.
   */
  public static renderJewelBlock(
    graphics: Phaser.GameObjects.Graphics,
    x: number,
    y: number,
    size: number,
    radius: number,
    colorHex: string,
    alpha: number = 1
  ): void {
    const baseColor = Phaser.Display.Color.HexStringToColor(colorHex).color;
    const shadowColor = this.darkenColor(baseColor, 0.45);
    const deepBodyColor = this.darkenColor(baseColor, 0.15);

    // 1. 3D Bottom Drop Shadow / Base Bevel
    const shadowOffset = Math.max(Math.round(size * 0.08), 3);
    graphics.fillStyle(shadowColor, alpha);
    graphics.fillRoundedRect(x, y + shadowOffset, size, size - shadowOffset, radius);

    // 2. Main Block Body (Top surface)
    graphics.fillStyle(baseColor, alpha);
    graphics.fillRoundedRect(x, y, size, size - shadowOffset, radius);

    // 3. Inner Bottom Bevel (Creates 3D curvature)
    graphics.fillStyle(deepBodyColor, alpha * 0.5);
    graphics.fillRoundedRect(x + 2, y + size - shadowOffset - 4, size - 4, 3, Math.max(radius - 2, 2));

    // 4. Top Glass Pill Gloss Highlight (Reflective shine)
    const glossHeight = Math.max(Math.round((size - shadowOffset) * 0.38), 6);
    graphics.fillStyle(0xffffff, alpha * 0.32);
    graphics.fillRoundedRect(x + 3, y + 2, size - 6, glossHeight, Math.max(radius - 3, 2));

    // 5. Specular Glint (Top-left diamond spark)
    const glintSize = Math.max(size * 0.05, 1.8);
    graphics.fillStyle(0xffffff, alpha * 0.75);
    graphics.fillCircle(x + 6, y + 5, glintSize);

    // 6. Crisp Outer Bevel Outline
    graphics.lineStyle(1, 0xffffff, alpha * 0.28);
    graphics.strokeRoundedRect(x, y, size, size - shadowOffset, radius);
  }

  /**
   * Renders a deep recessed grid pocket with inner pocket shadow and groove lips.
   */
  public static renderRecessedSlot(
    graphics: Phaser.GameObjects.Graphics,
    x: number,
    y: number,
    size: number,
    radius: number,
    emptyColorHex: string
  ): void {
    const emptyColor = Phaser.Display.Color.HexStringToColor(emptyColorHex).color;
    const innerShadowColor = 0x000000;

    // 1. Base Dark Pocket
    graphics.fillStyle(emptyColor, 0.7);
    graphics.fillRoundedRect(x, y, size, size, radius);

    // 2. Top-Left Inset Shadow (Creates physical depth)
    graphics.lineStyle(1.5, innerShadowColor, 0.4);
    graphics.strokeRoundedRect(x + 0.5, y + 0.5, size - 1, size - 1, radius);

    // 3. Bottom-Right Inset Rim Light
    graphics.fillStyle(0xffffff, 0.08);
    graphics.fillRoundedRect(x + 2, y + size - 3, size - 4, 2, Math.max(radius - 2, 1));
  }

  /**
   * Renders green/red ghost placement preview tiles with glossy pulse.
   */
  public static renderGhostBlock(
    graphics: Phaser.GameObjects.Graphics,
    x: number,
    y: number,
    size: number,
    radius: number,
    isValid: boolean
  ): void {
    const color = isValid ? 0x22c55e : 0xef4444; // Green vs Red
    const alpha = isValid ? 0.55 : 0.45;

    graphics.fillStyle(color, alpha);
    graphics.fillRoundedRect(x, y, size, size, radius);

    // Bright glowing boundary
    graphics.lineStyle(2, isValid ? 0x86efac : 0xfca5a5, 0.9);
    graphics.strokeRoundedRect(x, y, size, size, radius);

    // Inner gloss sheen
    graphics.fillStyle(0xffffff, 0.25);
    graphics.fillRoundedRect(x + 2, y + 2, size - 4, size * 0.35, Math.max(radius - 2, 2));
  }

  /**
   * Utility to darken hex color by factor (0.0 to 1.0).
   */
  public static darkenColor(color: number, factor: number): number {
    const r = Math.max(0, Math.round(((color >> 16) & 0xff) * (1 - factor)));
    const g = Math.max(0, Math.round(((color >> 8) & 0xff) * (1 - factor)));
    const b = Math.max(0, Math.round((color & 0xff) * (1 - factor)));
    return (r << 16) | (g << 8) | b;
  }

  /**
   * Utility to lighten hex color by factor (0.0 to 1.0).
   */
  public static lightenColor(color: number, factor: number): number {
    const r = Math.min(255, Math.round(((color >> 16) & 0xff) + (255 - ((color >> 16) & 0xff)) * factor));
    const g = Math.min(255, Math.round(((color >> 8) & 0xff) + (255 - ((color >> 8) & 0xff)) * factor));
    const b = Math.min(255, Math.round((color & 0xff) + (255 - (color & 0xff)) * factor));
    return (r << 16) | (g << 8) | b;
  }
}
