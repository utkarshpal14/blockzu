import Phaser from 'phaser';
import { FLOATING_TEXT_DURATION } from '../../constants/gameplay';
import { ThemeManager } from '../../managers/ThemeManager';

export interface FloatingTextConfig {
  x: number;
  y: number;
  text: string;
  fontSize?: string;
  color?: string;
  duration?: number;
  riseDistance?: number;
  isCombo?: boolean;
}

/**
 * FLOATING TEXT COMPONENT
 * Renders rewarding floating score and combo text popups.
 */
export class FloatingText {
  public static show(scene: Phaser.Scene, config: FloatingTextConfig): Phaser.GameObjects.Container {
    const theme = ThemeManager.getInstance().getActiveColors();
    const container = scene.add.container(config.x, config.y).setDepth(300);

    const isCombo = config.isCombo ?? false;
    const fontSize = config.fontSize || (isCombo ? '26px' : '20px');
    const color = config.color || (isCombo ? '#F59E0B' : theme.accent);
    const duration = config.duration || FLOATING_TEXT_DURATION;
    const riseDistance = config.riseDistance || 40;

    // Optional background pill for big combos
    if (isCombo) {
      const bg = scene.add.graphics();
      bg.fillStyle(0x000000, 0.65);
      bg.fillRoundedRect(-110, -20, 220, 40, 12);
      bg.lineStyle(1.5, 0xF59E0B, 0.8);
      bg.strokeRoundedRect(-110, -20, 220, 40, 12);
      container.add(bg);
    }

    const textObj = scene.add.text(0, 0, config.text, {
      fontFamily: 'Poppins, sans-serif',
      fontSize: fontSize,
      fontStyle: 'bold',
      color: color,
      stroke: isCombo ? '#000000' : undefined,
      strokeThickness: isCombo ? 3 : 0
    }).setOrigin(0.5);

    container.add(textObj);

    // Entrance scale pop
    container.setScale(0.8);

    scene.tweens.add({
      targets: container,
      scale: isCombo ? 1.2 : 1.05,
      y: config.y - riseDistance,
      alpha: { from: 1, to: 0 },
      duration: duration,
      ease: 'Quad.easeOut',
      onComplete: () => {
        container.destroy();
      }
    });

    return container;
  }
}
