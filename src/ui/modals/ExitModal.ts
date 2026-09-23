import Phaser from 'phaser';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../../constants/gameplay';
import { AudioManager } from '../../managers/AudioManager';
import { BackButtonManager } from '../../managers/BackButtonManager';
import { App } from '@capacitor/app';

/**
 * EXIT MODAL
 * Prompts player before quitting the game on Android back button press from Main Menu.
 * Features:
 * - Clean glassmorphism container
 * - "Keep Playing" primary action (Green)
 * - "Exit Game" secondary action (Coral Red)
 */
export class ExitModal extends Phaser.GameObjects.Container {
  private backdrop!: Phaser.GameObjects.Rectangle;
  private panel!: Phaser.GameObjects.Container;
  private onCancel?: () => void;

  constructor(scene: Phaser.Scene, onCancel?: () => void) {
    super(scene, 0, 0);
    this.onCancel = onCancel;

    this.createModal();
    scene.add.existing(this);
    this.setDepth(110);

    BackButtonManager.getInstance().pushModal(this, () => this.close());
    this.animateOpen();
  }

  private createModal() {
    const width = this.scene.scale.width || CANVAS_WIDTH;
    const height = this.scene.scale.height || CANVAS_HEIGHT;
    const audioManager = AudioManager.getInstance();

    // 1. Backdrop
    this.backdrop = this.scene.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.75);
    this.backdrop.setInteractive();
    this.backdrop.on('pointerdown', () => this.close());
    this.add(this.backdrop);

    // 2. Panel
    this.panel = this.scene.add.container(width / 2, height / 2);
    this.add(this.panel);

    const panelWidth = 340;
    const panelHeight = 240;

    const bg = this.scene.add.graphics();
    // Drop shadow
    bg.fillStyle(0x000000, 0.6);
    bg.fillRoundedRect(-panelWidth / 2, -panelHeight / 2 + 6, panelWidth, panelHeight, 22);

    // Glass Card Body
    bg.fillStyle(0x1E293B, 0.96);
    bg.fillRoundedRect(-panelWidth / 2, -panelHeight / 2, panelWidth, panelHeight, 22);

    // Bezel
    bg.lineStyle(2, 0xF43F5E, 0.8);
    bg.strokeRoundedRect(-panelWidth / 2, -panelHeight / 2, panelWidth, panelHeight, 22);

    this.panel.add(bg);

    // Title
    const title = this.scene.add.text(0, -panelHeight / 2 + 35, '🚪 EXIT BLOCKZU?', {
      fontFamily: 'Poppins, sans-serif',
      fontSize: '22px',
      fontStyle: 'bold',
      color: '#FFFFFF'
    }).setOrigin(0.5);
    this.panel.add(title);

    // Subtitle
    const subtitle = this.scene.add.text(0, -panelHeight / 2 + 75, 'Are you sure you want to quit the game?', {
      fontFamily: 'Poppins, sans-serif',
      fontSize: '13px',
      color: '#94A3B8',
      align: 'center',
      wordWrap: { width: 280 }
    }).setOrigin(0.5);
    this.panel.add(subtitle);

    const btnWidth = 260;
    const btnHeight = 46;

    // Button 1: KEEP PLAYING (Green)
    this.createButton(0, 15, btnWidth, btnHeight, '🎮  KEEP PLAYING', 0x10B981, 0x34D399, '#FFFFFF', () => {
      audioManager.playButtonClick();
      this.close();
    });

    // Button 2: EXIT GAME (Red)
    this.createButton(0, 72, btnWidth, btnHeight, '❌  EXIT GAME', 0xEF4444, 0xF87171, '#FFFFFF', () => {
      audioManager.playButtonClick();
      this.close(() => {
        try {
          App.exitApp();
        } catch {
          // If in browser, do nothing
        }
      });
    });
  }

  private createButton(
    x: number,
    y: number,
    w: number,
    h: number,
    label: string,
    colorTop: number,
    colorBorder: number,
    textColor: string,
    onClick: () => void
  ) {
    const btn = this.scene.add.container(x, y);

    const bg = this.scene.add.graphics();
    // Shadow
    bg.fillStyle(0x000000, 0.35);
    bg.fillRoundedRect(-w / 2, -h / 2 + 3, w, h, 14);

    // Button Base
    bg.fillStyle(colorTop, 1);
    bg.fillRoundedRect(-w / 2, -h / 2, w, h, 14);

    // Border
    bg.lineStyle(1.5, colorBorder, 0.8);
    bg.strokeRoundedRect(-w / 2, -h / 2, w, h, 14);

    btn.add(bg);

    const text = this.scene.add.text(0, 0, label, {
      fontFamily: 'Poppins, sans-serif',
      fontSize: '14px',
      fontStyle: 'bold',
      color: textColor
    }).setOrigin(0.5);
    btn.add(text);

    btn.setSize(w, h);
    btn.setInteractive({ useHandCursor: true });

    btn.on('pointerdown', () => {
      this.scene.tweens.add({
        targets: btn,
        scale: 0.95,
        duration: 50,
        yoyo: true,
        onComplete: onClick
      });
    });

    this.panel.add(btn);
  }

  public animateOpen() {
    this.backdrop.setAlpha(0);
    this.panel.setScale(0.85).setAlpha(0);

    this.scene.tweens.add({
      targets: this.backdrop,
      alpha: 1,
      duration: 150,
      ease: 'Quad.easeOut'
    });

    this.scene.tweens.add({
      targets: this.panel,
      scale: 1,
      alpha: 1,
      duration: 200,
      ease: 'Back.easeOut'
    });
  }

  public close(onClosed?: () => void) {
    BackButtonManager.getInstance().removeModal(this);

    this.scene.tweens.add({
      targets: [this.backdrop, this.panel],
      alpha: 0,
      scale: 0.9,
      duration: 120,
      ease: 'Quad.easeIn',
      onComplete: () => {
        this.destroy();
        if (this.onCancel) this.onCancel();
        if (onClosed) onClosed();
      }
    });
  }
}
