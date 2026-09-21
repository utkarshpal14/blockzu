import Phaser from 'phaser';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../../constants/gameplay';
import { AudioManager } from '../../managers/AudioManager';

/**
 * REWARDED / INTERSTITIAL AD MODAL
 * High-polish simulated video ad container for Web/PWA and store testing.
 * Features 5-second countdown timer, animated progress bar, video simulation visuals,
 * sound controls, and reward claim feedback.
 * Milestone 9.
 */
export class RewardedAdModal extends Phaser.GameObjects.Container {
  private backdrop!: Phaser.GameObjects.Rectangle;
  private panel!: Phaser.GameObjects.Container;
  private durationSeconds: number;
  private remainingSeconds: number;
  private onCompleteCallback: (rewarded: boolean) => void;
  private isRewarded: boolean;
  private timerEvent?: Phaser.Time.TimerEvent;
  private countdownText!: Phaser.GameObjects.Text;
  private progressBar!: Phaser.GameObjects.Graphics;
  private actionButtonContainer!: Phaser.GameObjects.Container;
  private isFinished: boolean = false;

  constructor(
    scene: Phaser.Scene,
    title: string,
    subtitle: string,
    durationSeconds: number = 5,
    onComplete: (rewarded: boolean) => void,
    isRewarded: boolean = true
  ) {
    super(scene, 0, 0);
    this.durationSeconds = durationSeconds;
    this.remainingSeconds = durationSeconds;
    this.onCompleteCallback = onComplete;
    this.isRewarded = isRewarded;

    this.createModal(title, subtitle);
    scene.add.existing(this);
    this.setDepth(150); // Above all other modals

    this.animateOpen();
    this.startAdTimer();
  }

  private createModal(title: string, subtitle: string) {
    const width = this.scene.scale.width || CANVAS_WIDTH;
    const height = this.scene.scale.height || CANVAS_HEIGHT;
    const audioManager = AudioManager.getInstance();

    // 1. Dark Backdrop blocker
    this.backdrop = this.scene.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.88);
    this.backdrop.setInteractive();
    this.add(this.backdrop);

    // 2. Panel
    this.panel = this.scene.add.container(width / 2, height / 2);
    this.add(this.panel);

    const panelWidth = 380;
    const panelHeight = 520;

    const bg = this.scene.add.graphics();
    // Drop shadow
    bg.fillStyle(0x000000, 0.7);
    bg.fillRoundedRect(-panelWidth / 2, -panelHeight / 2 + 6, panelWidth, panelHeight, 24);

    // Card Body (Deep Royal Navy)
    bg.fillStyle(0x0F172A, 0.98);
    bg.fillRoundedRect(-panelWidth / 2, -panelHeight / 2, panelWidth, panelHeight, 24);

    // Cyan/Gold Border
    bg.lineStyle(2, this.isRewarded ? 0xF59E0B : 0x38BDF8, 0.9);
    bg.strokeRoundedRect(-panelWidth / 2, -panelHeight / 2, panelWidth, panelHeight, 24);

    // Top Gloss
    bg.fillStyle(0xffffff, 0.08);
    bg.fillRoundedRect(-panelWidth / 2 + 2, -panelHeight / 2 + 2, panelWidth - 4, 38, 22);
    this.panel.add(bg);

    // Header Bar: "SPONSORED ADVERTISEMENT"
    const headerPill = this.scene.add.graphics();
    headerPill.fillStyle(0x1E293B, 0.9);
    headerPill.fillRoundedRect(-140, -panelHeight / 2 + 18, 280, 26, 13);
    headerPill.lineStyle(1, 0x475569, 0.8);
    headerPill.strokeRoundedRect(-140, -panelHeight / 2 + 18, 280, 26, 13);
    this.panel.add(headerPill);

    const sponsorText = this.scene.add.text(0, -panelHeight / 2 + 31, this.isRewarded ? '🎬  REWARDED ADVERTISEMENT' : '📢  SPONSORED PROMOTION', {
      fontFamily: 'Poppins, sans-serif',
      fontSize: '11px',
      fontStyle: 'bold',
      color: this.isRewarded ? '#FDE047' : '#93C5FD'
    }).setOrigin(0.5);
    this.panel.add(sponsorText);

    // Main Ad Video Simulation Box
    const videoWidth = panelWidth - 40;
    const videoHeight = 240;
    const videoY = -panelHeight / 2 + 185;

    const videoBox = this.scene.add.graphics();
    videoBox.fillStyle(0x020617, 1);
    videoBox.fillRoundedRect(-videoWidth / 2, videoY - videoHeight / 2, videoWidth, videoHeight, 16);
    videoBox.lineStyle(1.5, 0x334155, 0.9);
    videoBox.strokeRoundedRect(-videoWidth / 2, videoY - videoHeight / 2, videoWidth, videoHeight, 16);
    this.panel.add(videoBox);

    // Inside Video Animation: Animated Blockzu Showcase
    const videoContainer = this.scene.add.container(0, videoY);
    this.panel.add(videoContainer);

    // Animated glowing rings in video
    const pulseRing = this.scene.add.graphics();
    pulseRing.lineStyle(2, 0x38BDF8, 0.4);
    pulseRing.strokeCircle(0, -10, 48);
    videoContainer.add(pulseRing);

    this.scene.tweens.add({
      targets: pulseRing,
      scale: 1.35,
      alpha: 0,
      duration: 1200,
      repeat: -1,
      ease: 'Sine.easeOut'
    });

    const adLogo = this.scene.add.text(0, -15, '🎮 BLOCKZU', {
      fontFamily: 'Poppins, sans-serif',
      fontSize: '28px',
      fontStyle: 'bold',
      color: '#FFFFFF',
      stroke: '#2563EB',
      strokeThickness: 3
    }).setOrigin(0.5);
    videoContainer.add(adLogo);

    const adSub = this.scene.add.text(0, 22, 'The Ultimate Casual Puzzle Experience', {
      fontFamily: 'Poppins, sans-serif',
      fontSize: '12px',
      fontStyle: 'bold',
      color: '#38BDF8'
    }).setOrigin(0.5);
    videoContainer.add(adSub);

    const starsText = this.scene.add.text(0, 46, '⭐⭐⭐⭐⭐', {
      fontSize: '16px'
    }).setOrigin(0.5);
    videoContainer.add(starsText);

    const freeText = this.scene.add.text(0, 72, '100% Free to Play • Offline First', {
      fontFamily: 'Poppins, sans-serif',
      fontSize: '11px',
      color: '#94A3B8'
    }).setOrigin(0.5);
    videoContainer.add(freeText);

    // Ad Title & Subtitle Below Video
    const adTitleText = this.scene.add.text(0, videoY + videoHeight / 2 + 25, title, {
      fontFamily: 'Poppins, sans-serif',
      fontSize: '15px',
      fontStyle: 'bold',
      color: '#FFFFFF'
    }).setOrigin(0.5);
    this.panel.add(adTitleText);

    const adDescText = this.scene.add.text(0, videoY + videoHeight / 2 + 48, subtitle, {
      fontFamily: 'Poppins, sans-serif',
      fontSize: '11px',
      color: '#94A3B8',
      align: 'center',
      wordWrap: { width: panelWidth - 48 }
    }).setOrigin(0.5);
    this.panel.add(adDescText);

    // Video Progress Bar
    this.progressBar = this.scene.add.graphics();
    this.panel.add(this.progressBar);
    this.updateProgressBar(0);

    // Countdown Badge
    this.countdownText = this.scene.add.text(0, panelHeight / 2 - 80, `Reward in ${this.remainingSeconds}s`, {
      fontFamily: 'Poppins, sans-serif',
      fontSize: '12px',
      fontStyle: 'bold',
      color: '#FDE047'
    }).setOrigin(0.5);
    this.panel.add(this.countdownText);

    // Bottom Action / Claim Button
    this.actionButtonContainer = this.scene.add.container(0, panelHeight / 2 - 42);
    this.panel.add(this.actionButtonContainer);
    this.renderActionButton();
  }

  private startAdTimer() {
    this.timerEvent = this.scene.time.addEvent({
      delay: 1000,
      repeat: this.durationSeconds - 1,
      callback: () => {
        this.remainingSeconds -= 1;
        const elapsed = this.durationSeconds - this.remainingSeconds;
        this.updateProgressBar(elapsed / this.durationSeconds);

        if (this.remainingSeconds > 0) {
          this.countdownText.setText(this.isRewarded ? `Reward in ${this.remainingSeconds}s` : `Skip in ${this.remainingSeconds}s`);
        } else {
          this.isFinished = true;
          this.countdownText.setText('✓ REWARD UNLOCKED!');
          this.countdownText.setColor('#34D399');
          this.renderActionButton();
        }
      }
    });
  }

  private updateProgressBar(progress: number) {
    const width = 340;
    const y = 145;
    this.progressBar.clear();

    // Track
    this.progressBar.fillStyle(0x1E293B, 1);
    this.progressBar.fillRoundedRect(-width / 2, y, width, 6, 3);

    // Fill
    const fillWidth = Math.max(0, width * progress);
    this.progressBar.fillStyle(this.isRewarded ? 0xF59E0B : 0x38BDF8, 1);
    this.progressBar.fillRoundedRect(-width / 2, y, fillWidth, 6, 3);
  }

  private renderActionButton() {
    this.actionButtonContainer.removeAll(true);
    const audioManager = AudioManager.getInstance();
    const btnWidth = 320;
    const btnHeight = 44;

    const bg = this.scene.add.graphics();
    this.actionButtonContainer.add(bg);

    if (this.isFinished) {
      // Completed State (Bright pulsing emerald / gold)
      bg.fillStyle(0x059669, 1);
      bg.fillRoundedRect(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight, 14);
      bg.lineStyle(2, 0x34D399, 1);
      bg.strokeRoundedRect(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight, 14);

      const label = this.scene.add.text(0, 0, this.isRewarded ? '✓  CLAIM REWARD' : '✕  CLOSE AD', {
        fontFamily: 'Poppins, sans-serif',
        fontSize: '15px',
        fontStyle: 'bold',
        color: '#FFFFFF'
      }).setOrigin(0.5);
      this.actionButtonContainer.add(label);

      this.scene.tweens.add({
        targets: this.actionButtonContainer,
        scale: 1.03,
        duration: 600,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });

      this.actionButtonContainer.setSize(btnWidth, btnHeight);
      this.actionButtonContainer.setInteractive({ useHandCursor: true });
      this.actionButtonContainer.on('pointerdown', () => {
        audioManager.playButtonClick();
        this.close(true);
      });
    } else {
      // Waiting / Skip Early State
      bg.fillStyle(0x1E293B, 0.7);
      bg.fillRoundedRect(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight, 14);
      bg.lineStyle(1.5, 0x475569, 0.7);
      bg.strokeRoundedRect(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight, 14);

      const label = this.scene.add.text(0, 0, `Please wait ${this.remainingSeconds}s...`, {
        fontFamily: 'Poppins, sans-serif',
        fontSize: '13px',
        fontStyle: 'bold',
        color: '#94A3B8'
      }).setOrigin(0.5);
      this.actionButtonContainer.add(label);
    }
  }

  private animateOpen() {
    this.panel.setScale(0.85);
    this.panel.setAlpha(0);
    this.backdrop.setAlpha(0);

    this.scene.tweens.add({
      targets: this.backdrop,
      alpha: 0.88,
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

  public close(rewarded: boolean = false) {
    if (this.timerEvent) {
      this.timerEvent.destroy();
    }

    this.scene.tweens.add({
      targets: [this.panel, this.backdrop],
      alpha: 0,
      scale: 0.9,
      duration: 140,
      ease: 'Quad.easeIn',
      onComplete: () => {
        this.onCompleteCallback(rewarded);
        this.destroy();
      }
    });
  }
}
