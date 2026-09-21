import Phaser from 'phaser';

export interface ComboBannerOptions {
  x: number;
  y: number;
  linesCleared: number;
  scoreAwarded: number;
  customText?: string;
}

/**
 * COMBO & APPRECIATION BANNER
 * Colorful, tactile rotating 3D popups with expanding shockwaves,
 * golden starbursts, glowing score badges, and cheerful visual feedback.
 */
export class ComboBanner {
  public static show(scene: Phaser.Scene, options: ComboBannerOptions): void {
    const { x, y, linesCleared, scoreAwarded, customText } = options;

    // Palette & Title resolution per line count
    let title = customText || 'GOOD! ✨';
    let themeColor = 0x38BDF8; // Cyan
    let gradientBorder = 0x00F0FF;
    let particleColors = [0x38BDF8, 0x67E8F9, 0xFFFFFF];

    if (linesCleared === 2) {
      title = 'GREAT! 🌟';
      themeColor = 0x10B981; // Emerald Green
      gradientBorder = 0x34D399;
      particleColors = [0x10B981, 0x34D399, 0xFFD700, 0xFFFFFF];
    } else if (linesCleared === 3) {
      title = 'AMAZING! 🔥';
      themeColor = 0xF97316; // Fiery Orange
      gradientBorder = 0xFB923C;
      particleColors = [0xF97316, 0xEF4444, 0xFFD700, 0xFFFFFF];
    } else if (linesCleared >= 4) {
      title = 'UNBELIEVABLE! 👑';
      themeColor = 0xF59E0B; // Golden Crown
      gradientBorder = 0xFCD34D;
      particleColors = [0xF59E0B, 0xFCD34D, 0xFFFFFF, 0xEC4899];
    }

    const container = scene.add.container(x, y).setDepth(85);

    // 1. Expanding Radial Shockwave Ring
    const shockwave = scene.add.graphics();
    shockwave.lineStyle(4, themeColor, 0.95);
    shockwave.strokeCircle(0, 0, 32);
    container.add(shockwave);

    scene.tweens.add({
      targets: shockwave,
      scale: linesCleared >= 3 ? 3.5 : 2.8,
      alpha: 0,
      duration: 480,
      ease: 'Cubic.easeOut'
    });

    // 2. Banner Container (with rotating 3D motion)
    const banner = scene.add.container(0, 0);
    container.add(banner);

    const bannerWidth = linesCleared >= 4 ? 260 : 230;
    const bannerHeight = 64;

    const bg = scene.add.graphics();
    // Drop Shadow
    bg.fillStyle(0x000000, 0.45);
    bg.fillRoundedRect(-bannerWidth / 2, -bannerHeight / 2 + 5, bannerWidth, bannerHeight, 20);

    // Card Body
    bg.fillStyle(0x0f172a, 0.98);
    bg.fillRoundedRect(-bannerWidth / 2, -bannerHeight / 2, bannerWidth, bannerHeight, 20);

    // Glowing Neon Border
    bg.lineStyle(3, gradientBorder, 1);
    bg.strokeRoundedRect(-bannerWidth / 2, -bannerHeight / 2, bannerWidth, bannerHeight, 20);

    bg.lineStyle(1, 0xffffff, 0.4);
    bg.strokeRoundedRect(-bannerWidth / 2 + 1, -bannerHeight / 2 + 1, bannerWidth - 2, bannerHeight - 2, 19);
    banner.add(bg);

    // Appreciation Title
    const titleText = scene.add.text(0, -11, title, {
      fontFamily: 'Poppins, sans-serif',
      fontSize: linesCleared >= 4 ? '20px' : '18px',
      fontStyle: 'bold',
      color: '#' + themeColor.toString(16).padStart(6, '0'),
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5);
    banner.add(titleText);

    // Highlighted Point Gain Badge
    const scoreText = scene.add.text(0, 14, `+${scoreAwarded} PTS`, {
      fontFamily: 'Poppins, sans-serif',
      fontSize: '15px',
      fontStyle: 'bold',
      color: '#FFFFFF',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5);
    banner.add(scoreText);

    // 3. Golden Starburst & Rainbow Spark Particles
    const particleCount = linesCleared >= 3 ? 22 : 14;
    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount + (Math.random() * 0.4 - 0.2);
      const speed = Phaser.Math.Between(75, 175);
      const col = particleColors[Phaser.Math.Between(0, particleColors.length - 1)];

      const spark = scene.add.circle(0, 0, Phaser.Math.Between(3, 5), col);
      container.add(spark);

      scene.tweens.add({
        targets: spark,
        x: Math.cos(angle) * speed,
        y: Math.sin(angle) * speed,
        scale: { from: 1.5, to: 0 },
        alpha: { from: 1, to: 0 },
        duration: Phaser.Math.Between(380, 650),
        ease: 'Cubic.easeOut'
      });
    }

    // 4. Rotating 3D Pop-In Motion (-14deg -> +6deg -> 0deg)
    banner.setScale(0.2);
    banner.setAngle(-14);
    banner.setAlpha(0);

    scene.tweens.add({
      targets: banner,
      scale: 1.25,
      angle: 6,
      alpha: 1,
      duration: 140,
      ease: 'Back.easeOut',
      onComplete: () => {
        scene.tweens.add({
          targets: banner,
          scale: 1.0,
          angle: 0,
          duration: 90,
          ease: 'Sine.easeInOut'
        });
      }
    });

    // Exit Floating Fade-Out after 500ms
    scene.time.delayedCall(520, () => {
      scene.tweens.add({
        targets: container,
        scale: 1.15,
        y: y - 28,
        alpha: 0,
        duration: 180,
        ease: 'Quad.easeIn',
        onComplete: () => {
          container.destroy();
        }
      });
    });
  }
}
