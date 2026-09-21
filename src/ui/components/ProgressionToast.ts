import Phaser from 'phaser';
import { CANVAS_WIDTH } from '../../constants/gameplay';
import { AudioManager } from '../../managers/AudioManager';

export interface ToastData {
  title: string;
  subtitle: string;
  rewardCoins?: number;
  icon?: string;
  color?: number;
}

/**
 * PROGRESSION TOAST
 * Celebratory, non-intrusive pop-in slide banner for achievements & missions completed during play.
 * Defined in Milestone 7.5.
 */
export class ProgressionToast {
  private static queue: { scene: Phaser.Scene; data: ToastData }[] = [];
  private static isShowing: boolean = false;

  public static show(scene: Phaser.Scene, data: ToastData) {
    this.queue.push({ scene, data });
    if (!this.isShowing) {
      this.processQueue();
    }
  }

  private static processQueue() {
    if (this.queue.length === 0) {
      this.isShowing = false;
      return;
    }

    this.isShowing = true;
    const { scene, data } = this.queue.shift()!;
    if (!scene || !scene.sys || !scene.sys.isActive()) {
      this.processQueue();
      return;
    }

    const width = scene.scale.width || CANVAS_WIDTH;
    const toastWidth = 320;
    const toastHeight = 54;
    const targetY = 70;
    const startY = -40;

    const container = scene.add.container(width / 2, startY).setDepth(200);

    const bg = scene.add.graphics();
    // Drop shadow
    bg.fillStyle(0x000000, 0.45);
    bg.fillRoundedRect(-toastWidth / 2, -toastHeight / 2 + 3, toastWidth, toastHeight, 16);

    // Body
    bg.fillStyle(0x172554, 0.96);
    bg.fillRoundedRect(-toastWidth / 2, -toastHeight / 2, toastWidth, toastHeight, 16);

    // Accent Bezel Border
    const accentCol = data.color ?? 0xF59E0B;
    bg.lineStyle(2, accentCol, 0.9);
    bg.strokeRoundedRect(-toastWidth / 2, -toastHeight / 2, toastWidth, toastHeight, 16);

    // Top Gloss
    bg.fillStyle(0xffffff, 0.15);
    bg.fillRoundedRect(-toastWidth / 2 + 2, -toastHeight / 2 + 2, toastWidth - 4, 18, 10);
    container.add(bg);

    // Icon
    const icon = scene.add.text(-toastWidth / 2 + 24, 0, data.icon || '🎉', {
      fontSize: '22px'
    }).setOrigin(0.5);
    container.add(icon);

    // Title
    const title = scene.add.text(-toastWidth / 2 + 48, -10, data.title, {
      fontFamily: 'Poppins, sans-serif',
      fontSize: '13px',
      fontStyle: 'bold',
      color: '#FDE047'
    }).setOrigin(0, 0.5);
    container.add(title);

    // Subtitle
    const sub = scene.add.text(-toastWidth / 2 + 48, 11, data.subtitle, {
      fontFamily: 'Poppins, sans-serif',
      fontSize: '11px',
      color: '#E2E8F0'
    }).setOrigin(0, 0.5);
    container.add(sub);

    // Reward Badge (if applicable)
    if (data.rewardCoins) {
      const rewardPill = scene.add.container(toastWidth / 2 - 44, 0);
      const pillBg = scene.add.graphics();
      pillBg.fillStyle(0x0F172A, 0.85);
      pillBg.lineStyle(1, 0xF59E0B, 0.8);
      pillBg.fillRoundedRect(-32, -12, 64, 24, 12);
      pillBg.strokeRoundedRect(-32, -12, 64, 24, 12);
      rewardPill.add(pillBg);

      const rText = scene.add.text(0, -1, `+${data.rewardCoins} 🪙`, {
        fontFamily: 'Poppins, sans-serif',
        fontSize: '11px',
        fontStyle: 'bold',
        color: '#FDE047'
      }).setOrigin(0.5);
      rewardPill.add(rText);
      container.add(rewardPill);
    }

    // Play chime sound
    AudioManager.getInstance().playAppreciation(1);

    // Slide in tween
    scene.tweens.add({
      targets: container,
      y: targetY,
      duration: 320,
      ease: 'Back.easeOut',
      onComplete: () => {
        // Hold for 2.2s then slide out
        scene.time.delayedCall(2200, () => {
          scene.tweens.add({
            targets: container,
            y: startY,
            alpha: 0,
            duration: 250,
            ease: 'Quad.easeIn',
            onComplete: () => {
              container.destroy();
              this.processQueue();
            }
          });
        });
      }
    });
  }
}
