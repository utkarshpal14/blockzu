import Phaser from 'phaser';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../../constants/gameplay';

/**
 * AMBIENT PARTICLES
 * Multi-colored dreamy drifting glowing dust particles and sparkles in the background.
 * Adds vibrant life, rich color accents, and magical depth to menus and gameplay scenes.
 */
export class AmbientParticles extends Phaser.GameObjects.Container {
  private particles: {
    obj: Phaser.GameObjects.Shape | Phaser.GameObjects.Text;
    baseX: number;
    baseY: number;
    speedX: number;
    speedY: number;
    wobbleSpeed: number;
    wobbleDist: number;
    phase: number;
  }[] = [];

  constructor(scene: Phaser.Scene, count: number = 22, multiColor: boolean = true) {
    super(scene, 0, 0);
    this.createParticles(count, multiColor);
    scene.add.existing(this);
    this.setDepth(1); // Above background, below board & UI
  }

  private createParticles(count: number, multiColor: boolean) {
    const width = this.scene.scale.width || CANVAS_WIDTH;
    const height = this.scene.scale.height || CANVAS_HEIGHT;

    const colors = multiColor
      ? [0xFACC15, 0x38BDF8, 0xC084FC, 0x34D399, 0xFB923C, 0xF472B6, 0x60A5FA]
      : [0x38BDF8, 0x60A5FA];

    const sparkleIcons = ['✦', '★', '•', '◆'];

    for (let i = 0; i < count; i++) {
      const x = Phaser.Math.Between(10, width - 10);
      const y = Phaser.Math.Between(10, height - 10);
      const col = colors[i % colors.length];
      const isSparkle = i % 4 === 0;

      let obj: Phaser.GameObjects.Shape | Phaser.GameObjects.Text;

      if (isSparkle) {
        const icon = sparkleIcons[Phaser.Math.Between(0, sparkleIcons.length - 1)];
        const text = this.scene.add.text(x, y, icon, {
          fontSize: `${Phaser.Math.Between(10, 16)}px`,
          color: `#${col.toString(16).padStart(6, '0')}`
        }).setOrigin(0.5).setAlpha(Phaser.Math.FloatBetween(0.25, 0.6));
        this.add(text);
        obj = text;
      } else {
        const radius = Phaser.Math.FloatBetween(2, 4.5);
        const alpha = Phaser.Math.FloatBetween(0.2, 0.55);
        const circle = this.scene.add.circle(x, y, radius, col, alpha);
        this.add(circle);
        obj = circle;
      }

      this.particles.push({
        obj,
        baseX: x,
        baseY: y,
        speedX: Phaser.Math.FloatBetween(-0.2, 0.2),
        speedY: Phaser.Math.FloatBetween(-0.35, -0.08), // Float gently upward
        wobbleSpeed: Phaser.Math.FloatBetween(0.001, 0.003),
        wobbleDist: Phaser.Math.FloatBetween(10, 28),
        phase: Math.random() * Math.PI * 2
      });

      // Subtle breathing twinkle / scale pulse
      this.scene.tweens.add({
        targets: obj,
        alpha: { from: obj.alpha * 0.5, to: Math.min(obj.alpha * 1.4, 0.85) },
        scale: { from: 0.7, to: 1.3 },
        duration: Phaser.Math.Between(1600, 3000),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
        delay: Phaser.Math.Between(0, 1500)
      });
    }

    // Continuous update loop
    this.scene.events.on('update', this.updateParticles, this);
  }

  private updateParticles(_time: number, delta: number) {
    const width = this.scene.scale.width || CANVAS_WIDTH;
    const height = this.scene.scale.height || CANVAS_HEIGHT;

    this.particles.forEach((p) => {
      p.baseY += p.speedY * (delta / 16);
      p.baseX += p.speedX * (delta / 16);
      p.phase += p.wobbleSpeed * delta;

      if (p.baseY < -15) p.baseY = height + 15;
      if (p.baseX < -15) p.baseX = width + 15;
      if (p.baseX > width + 15) p.baseX = -15;

      p.obj.x = p.baseX + Math.sin(p.phase) * p.wobbleDist;
      p.obj.y = p.baseY;
    });
  }

  public destroy(fromScene?: boolean): void {
    if (this.scene) {
      this.scene.events.off('update', this.updateParticles, this);
    }
    super.destroy(fromScene);
  }
}
