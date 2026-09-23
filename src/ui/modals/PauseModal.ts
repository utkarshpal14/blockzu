import Phaser from 'phaser';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../../constants/gameplay';
import { AudioManager } from '../../managers/AudioManager';
import { SettingsModal } from './SettingsModal';
import { BackButtonManager } from '../../managers/BackButtonManager';

export interface PauseModalCallbacks {
  onResume: () => void;
  onRestart: () => void;
  onMainMenu: () => void;
}

/**
 * PAUSE MODAL
 * High-contrast, colorful pause overlay with uniquely color-coded 3D buttons:
 * - Resume: Emerald Green (#10B981)
 * - Restart: Amber Gold (#F59E0B)
 * - Settings: Electric Cyan (#06B6D4)
 * - Main Menu: Royal Violet (#8B5CF6)
 * Defined in Milestone 6 & Document 04.
 */
export class PauseModal extends Phaser.GameObjects.Container {
  private backdrop!: Phaser.GameObjects.Rectangle;
  private panel!: Phaser.GameObjects.Container;
  private callbacks: PauseModalCallbacks;

  constructor(scene: Phaser.Scene, callbacks: PauseModalCallbacks) {
    super(scene, 0, 0);
    this.callbacks = callbacks;

    this.createModal();
    scene.add.existing(this);
    this.setDepth(100);

    BackButtonManager.getInstance().pushModal(this, () => this.close(() => this.callbacks.onResume()));
    this.animateOpen();
  }

  private createModal() {
    const width = this.scene.scale.width || CANVAS_WIDTH;
    const height = this.scene.scale.height || CANVAS_HEIGHT;
    const audioManager = AudioManager.getInstance();

    // 1. Backdrop
    this.backdrop = this.scene.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.75);
    this.backdrop.setInteractive();
    this.add(this.backdrop);

    // 2. Panel
    this.panel = this.scene.add.container(width / 2, height / 2);
    this.add(this.panel);

    const panelWidth = 350;
    const panelHeight = 400;

    const bg = this.scene.add.graphics();
    // Drop shadow
    bg.fillStyle(0x000000, 0.6);
    bg.fillRoundedRect(-panelWidth / 2, -panelHeight / 2 + 6, panelWidth, panelHeight, 24);

    // Glass Card Body
    bg.fillStyle(0x1E293B, 0.96);
    bg.fillRoundedRect(-panelWidth / 2, -panelHeight / 2, panelWidth, panelHeight, 24);

    // Cyan/Violet Bezel
    bg.lineStyle(2, 0x38BDF8, 0.8);
    bg.strokeRoundedRect(-panelWidth / 2, -panelHeight / 2, panelWidth, panelHeight, 24);

    // Top Gloss
    bg.fillStyle(0xffffff, 0.08);
    bg.fillRoundedRect(-panelWidth / 2 + 2, -panelHeight / 2 + 2, panelWidth - 4, 38, 22);
    this.panel.add(bg);

    // Title
    const title = this.scene.add.text(0, -panelHeight / 2 + 40, '⏸  GAME PAUSED', {
      fontFamily: 'Poppins, sans-serif',
      fontSize: '22px',
      fontStyle: 'bold',
      color: '#FFFFFF'
    }).setOrigin(0.5);
    this.panel.add(title);

    const btnWidth = 270;
    const btnHeight = 50;
    const startY = -panelHeight / 2 + 105;
    const gap = 62;

    // 1. RESUME (Emerald Green)
    this.createColorfulButton(0, startY, btnWidth, btnHeight, '▶  RESUME', 0x10B981, 0x34D399, '#FFFFFF', () => {
      audioManager.playButtonClick();
      this.close(() => this.callbacks.onResume());
    });

    // 2. RESTART (Amber Gold)
    this.createColorfulButton(0, startY + gap, btnWidth, btnHeight, '🔄  RESTART', 0xF59E0B, 0xFDE047, '#FFFFFF', () => {
      audioManager.playButtonClick();
      this.close(() => this.callbacks.onRestart());
    });

    // 3. SETTINGS (Electric Cyan)
    this.createColorfulButton(0, startY + gap * 2, btnWidth, btnHeight, '⚙️  SETTINGS', 0x06B6D4, 0x38BDF8, '#FFFFFF', () => {
      audioManager.playButtonClick();
      new SettingsModal(this.scene);
    });

    // 4. MAIN MENU (Royal Violet)
    this.createColorfulButton(0, startY + gap * 3, btnWidth, btnHeight, '🏠  MAIN MENU', 0x8B5CF6, 0xC084FC, '#FFFFFF', () => {
      audioManager.playButtonClick();
      this.close(() => this.callbacks.onMainMenu());
    });
  }

  private createColorfulButton(
    x: number,
    y: number,
    width: number,
    height: number,
    text: string,
    bgColor: number,
    borderColor: number,
    textColor: string,
    onClick: () => void
  ) {
    const btnContainer = this.scene.add.container(x, y);
    this.panel.add(btnContainer);

    const bg = this.scene.add.graphics();
    // Drop shadow
    bg.fillStyle(0x000000, 0.4);
    bg.fillRoundedRect(-width / 2, -height / 2 + 3, width, height, 16);

    // Body
    bg.fillStyle(bgColor, 1);
    bg.fillRoundedRect(-width / 2, -height / 2, width, height, 16);

    // Glow border
    bg.lineStyle(1.5, borderColor, 0.85);
    bg.strokeRoundedRect(-width / 2, -height / 2, width, height, 16);

    // Top Gloss
    bg.fillStyle(0xffffff, 0.25);
    bg.fillRoundedRect(-width / 2 + 2, -height / 2 + 2, width - 4, height * 0.45, 12);
    btnContainer.add(bg);

    const label = this.scene.add.text(0, -1, text, {
      fontFamily: 'Poppins, sans-serif',
      fontSize: '16px',
      fontStyle: 'bold',
      color: textColor
    }).setOrigin(0.5);
    btnContainer.add(label);

    btnContainer.setSize(width, height);
    btnContainer.setInteractive({ useHandCursor: true });

    btnContainer.on('pointerdown', () => {
      this.scene.tweens.add({
        targets: btnContainer,
        scale: 0.93,
        duration: 70,
        yoyo: true,
        onComplete: onClick
      });
    });
  }

  private animateOpen() {
    this.panel.setScale(0.85);
    this.panel.setAlpha(0);
    this.backdrop.setAlpha(0);

    this.scene.tweens.add({
      targets: this.backdrop,
      alpha: 0.75,
      duration: 180,
      ease: 'Quad.easeOut'
    });

    this.scene.tweens.add({
      targets: this.panel,
      scale: 1,
      alpha: 1,
      duration: 220,
      ease: 'Back.easeOut'
    });
  }

  public close(onComplete?: () => void) {
    BackButtonManager.getInstance().removeModal(this);
    this.scene.tweens.add({
      targets: [this.panel, this.backdrop],
      alpha: 0,
      scale: 0.9,
      duration: 140,
      ease: 'Quad.easeIn',
      onComplete: () => {
        if (onComplete) onComplete();
        this.destroy();
      }
    });
  }
}
