import Phaser from 'phaser';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../../constants/gameplay';
import { AudioManager } from '../../managers/AudioManager';
import { SaveManager } from '../../managers/SaveManager';
import { BackButtonManager } from '../../managers/BackButtonManager';

/**
 * SETTINGS MODAL
 * Colorful settings hub with distinct vibrant color-themed rows:
 * - Sound Effects: Electric Cyan (#06B6D4)
 * - Theme Music: Royal Violet (#8B5CF6)
 * - Vibration: Sunset Amber (#F97316)
 * + Protected Advanced Reset Progress flow.
 * Defined in Milestone 6 & Document 04.
 */
export class SettingsModal extends Phaser.GameObjects.Container {
  private backdrop!: Phaser.GameObjects.Rectangle;
  private panel!: Phaser.GameObjects.Container;
  private onCloseCallback?: () => void;
  private onResetCallback?: () => void;

  private isAdvancedOpen: boolean = false;
  private advancedContainer!: Phaser.GameObjects.Container;

  constructor(scene: Phaser.Scene, onClose?: () => void, onReset?: () => void) {
    super(scene, 0, 0);
    this.onCloseCallback = onClose;
    this.onResetCallback = onReset;

    this.createModal();
    scene.add.existing(this);
    this.setDepth(100);

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

    const panelWidth = 380;
    const panelHeight = 520;

    const bg = this.scene.add.graphics();
    // Drop shadow
    bg.fillStyle(0x000000, 0.6);
    bg.fillRoundedRect(-panelWidth / 2, -panelHeight / 2 + 6, panelWidth, panelHeight, 24);

    // Glass Card Body
    bg.fillStyle(0x1E293B, 0.96);
    bg.fillRoundedRect(-panelWidth / 2, -panelHeight / 2, panelWidth, panelHeight, 24);

    // Orange/Amber Bezel
    bg.lineStyle(2, 0xF97316, 0.85);
    bg.strokeRoundedRect(-panelWidth / 2, -panelHeight / 2, panelWidth, panelHeight, 24);

    // Top Gloss
    bg.fillStyle(0xffffff, 0.08);
    bg.fillRoundedRect(-panelWidth / 2 + 2, -panelHeight / 2 + 2, panelWidth - 4, 38, 22);
    this.panel.add(bg);

    // Header Title
    const title = this.scene.add.text(0, -panelHeight / 2 + 36, '⚙️  SETTINGS', {
      fontFamily: 'Poppins, sans-serif',
      fontSize: '22px',
      fontStyle: 'bold',
      color: '#FFFFFF'
    }).setOrigin(0.5);
    this.panel.add(title);

    // Close Button (✕)
    const closeBtn = this.scene.add.text(panelWidth / 2 - 32, -panelHeight / 2 + 34, '✕', {
      fontFamily: 'Poppins, sans-serif',
      fontSize: '20px',
      fontStyle: 'bold',
      color: '#94A3B8'
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    closeBtn.on('pointerdown', () => {
      audioManager.playButtonClick();
      this.close();
    });
    this.panel.add(closeBtn);

    // Setting Toggles with colorful themes
    const startY = -panelHeight / 2 + 82;
    const rowHeight = 58;
    const rowWidth = panelWidth - 40;

    // 1. Sound Effects Toggle (Electric Cyan)
    this.createToggleRow(
      0,
      startY,
      rowWidth,
      rowHeight,
      '🔊 Sound Effects',
      0x06B6D4,
      '#A5F3FC',
      audioManager.isSoundEnabled(),
      (enabled) => {
        audioManager.toggleSound();
      }
    );

    // 2. Theme Music Toggle (Royal Violet)
    this.createToggleRow(
      0,
      startY + rowHeight + 12,
      rowWidth,
      rowHeight,
      '🎵 Theme Music',
      0x8B5CF6,
      '#E9D5FF',
      audioManager.isMusicEnabled(),
      (enabled) => {
        audioManager.toggleMusic();
      }
    );

    // 3. Vibration / Haptics Toggle (Sunset Amber)
    this.createToggleRow(
      0,
      startY + (rowHeight + 12) * 2,
      rowWidth,
      rowHeight,
      '📳 Vibration',
      0xF97316,
      '#FED7AA',
      audioManager.isVibrationEnabled(),
      (enabled) => {
        audioManager.toggleVibration();
      }
    );

    // Advanced Section Container
    const advY = startY + (rowHeight + 12) * 3 + 14;
    this.advancedContainer = this.scene.add.container(0, advY);
    this.panel.add(this.advancedContainer);

    this.renderAdvancedButton(rowWidth);

    // 4. Branding & Privacy Policy Footer
    const footerY = panelHeight / 2 - 28;
    const versionText = this.scene.add.text(0, footerY - 14, 'Blockzu v1.0.0 • Developed by PriorApp Games', {
      fontFamily: 'Poppins, sans-serif',
      fontSize: '11px',
      color: '#64748B'
    }).setOrigin(0.5);
    this.panel.add(versionText);

    const privacyLink = this.scene.add.text(0, footerY + 4, '🔒  Privacy Policy & Terms', {
      fontFamily: 'Poppins, sans-serif',
      fontSize: '11px',
      fontStyle: 'bold',
      color: '#38BDF8'
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    privacyLink.on('pointerdown', () => {
      audioManager.playButtonClick();
      if (typeof window !== 'undefined') {
        window.open('/privacy.html', '_blank');
      }
    });
    this.panel.add(privacyLink);
  }

  private createToggleRow(
    x: number,
    y: number,
    width: number,
    height: number,
    label: string,
    accentColor: number,
    textColor: string,
    initialState: boolean,
    onToggle: (state: boolean) => void
  ) {
    const audioManager = AudioManager.getInstance();

    const rowContainer = this.scene.add.container(x, y);
    this.panel.add(rowContainer);

    const card = this.scene.add.graphics();
    // Subtle tinted background
    card.fillStyle(accentColor, 0.16);
    card.fillRoundedRect(-width / 2, 0, width, height, 14);

    // Left accent pill
    card.fillStyle(accentColor, 1);
    card.fillRoundedRect(-width / 2, 0, 6, height, { tl: 14, bl: 14, tr: 0, br: 0 });

    // Border
    card.lineStyle(1.5, accentColor, 0.5);
    card.strokeRoundedRect(-width / 2, 0, width, height, 14);
    rowContainer.add(card);

    const text = this.scene.add.text(-width / 2 + 20, height / 2, label, {
      fontFamily: 'Poppins, sans-serif',
      fontSize: '15px',
      fontStyle: 'bold',
      color: textColor
    }).setOrigin(0, 0.5);
    rowContainer.add(text);

    // Pill Switch
    const switchWidth = 58;
    const switchHeight = 30;
    const switchX = width / 2 - 42;
    const switchY = height / 2;

    const switchBg = this.scene.add.graphics();
    const switchThumb = this.scene.add.graphics();
    rowContainer.add(switchBg);
    rowContainer.add(switchThumb);

    let isEnabled = initialState;

    const renderSwitch = (active: boolean) => {
      switchBg.clear();
      switchThumb.clear();

      const bgCol = active ? accentColor : 0x334155;
      switchBg.fillStyle(bgCol, 1);
      switchBg.fillRoundedRect(switchX - switchWidth / 2, switchY - switchHeight / 2, switchWidth, switchHeight, switchHeight / 2);

      const thumbX = active ? switchX + 14 : switchX - 14;
      switchThumb.fillStyle(0xffffff, 1);
      switchThumb.fillCircle(thumbX, switchY, 12);
    };

    renderSwitch(isEnabled);

    // Interactive hotspot
    const hotspot = this.scene.add.rectangle(switchX, switchY, switchWidth, switchHeight, 0x000000, 0.001);
    hotspot.setInteractive({ useHandCursor: true });
    rowContainer.add(hotspot);

    hotspot.on('pointerdown', () => {
      audioManager.playButtonClick();
      isEnabled = !isEnabled;
      renderSwitch(isEnabled);
      onToggle(isEnabled);
    });
  }

  private renderAdvancedButton(width: number) {
    this.advancedContainer.removeAll(true);
    const audioManager = AudioManager.getInstance();

    if (!this.isAdvancedOpen) {
      // Accordion trigger: "Advanced Settings ▾"
      const advBtn = this.scene.add.container(0, 0);
      this.advancedContainer.add(advBtn);

      const bg = this.scene.add.graphics();
      bg.fillStyle(0x0F172A, 0.7);
      bg.lineStyle(1.5, 0x475569, 0.7);
      bg.fillRoundedRect(-width / 2, 0, width, 46, 12);
      bg.strokeRoundedRect(-width / 2, 0, width, 46, 12);
      advBtn.add(bg);

      const text = this.scene.add.text(0, 23, '🛠️ Advanced Settings ▾', {
        fontFamily: 'Poppins, sans-serif',
        fontSize: '13px',
        fontStyle: 'bold',
        color: '#94A3B8'
      }).setOrigin(0.5);
      advBtn.add(text);

      advBtn.setSize(width, 46);
      advBtn.setInteractive({ useHandCursor: true });
      advBtn.on('pointerdown', () => {
        audioManager.playButtonClick();
        this.isAdvancedOpen = true;
        this.renderAdvancedButton(width);
      });
    } else {
      // Advanced view: Danger Zone with Reset Progress button
      const resetBtn = this.scene.add.container(0, 0);
      this.advancedContainer.add(resetBtn);

      const bg = this.scene.add.graphics();
      bg.fillStyle(0x450a0a, 0.9); // Dark red
      bg.lineStyle(2, 0xef4444, 0.9);
      bg.fillRoundedRect(-width / 2, 0, width, 50, 12);
      bg.strokeRoundedRect(-width / 2, 0, width, 50, 12);
      resetBtn.add(bg);

      const text = this.scene.add.text(0, 25, '⚠️ Reset All Game Progress', {
        fontFamily: 'Poppins, sans-serif',
        fontSize: '14px',
        fontStyle: 'bold',
        color: '#F87171'
      }).setOrigin(0.5);
      resetBtn.add(text);

      resetBtn.setSize(width, 50);
      resetBtn.setInteractive({ useHandCursor: true });
      resetBtn.on('pointerdown', () => {
        audioManager.playButtonClick();
        this.showResetConfirmation();
      });
    }
  }

  private showResetConfirmation() {
    const width = this.scene.scale.width || CANVAS_WIDTH;
    const height = this.scene.scale.height || CANVAS_HEIGHT;
    const audioManager = AudioManager.getInstance();

    // Confirmation sub-overlay
    const confirmOverlay = this.scene.add.container(0, 0);
    this.add(confirmOverlay);
    confirmOverlay.setDepth(110);

    const blocker = this.scene.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.7);
    blocker.setInteractive();
    confirmOverlay.add(blocker);

    const dialog = this.scene.add.container(width / 2, height / 2);
    confirmOverlay.add(dialog);

    const dialogBg = this.scene.add.graphics();
    dialogBg.fillStyle(0x0f172a, 0.98);
    dialogBg.lineStyle(2, 0xef4444, 1);
    dialogBg.fillRoundedRect(-165, -115, 330, 230, 18);
    dialogBg.strokeRoundedRect(-165, -115, 330, 230, 18);
    dialog.add(dialogBg);

    const title = this.scene.add.text(0, -78, '⚠️ RESET PROGRESS?', {
      fontFamily: 'Poppins, sans-serif',
      fontSize: '18px',
      fontStyle: 'bold',
      color: '#EF4444'
    }).setOrigin(0.5);
    dialog.add(title);

    const desc = this.scene.add.text(0, -25, 'This will permanently wipe your high scores, statistics, coins, and custom themes.\n\nAre you sure?', {
      fontFamily: 'Poppins, sans-serif',
      fontSize: '12px',
      color: '#CBD5E1',
      align: 'center',
      wordWrap: { width: 280 }
    }).setOrigin(0.5);
    dialog.add(desc);

    // Cancel Button (Slate)
    const cancelBtn = this.scene.add.container(-75, 65);
    const cancelBg = this.scene.add.graphics();
    cancelBg.fillStyle(0x334155, 1);
    cancelBg.fillRoundedRect(-60, -20, 120, 42, 10);
    cancelBtn.add(cancelBg);

    const cancelText = this.scene.add.text(0, 0, 'CANCEL', {
      fontFamily: 'Poppins, sans-serif',
      fontSize: '13px',
      fontStyle: 'bold',
      color: '#FFFFFF'
    }).setOrigin(0.5);
    cancelBtn.add(cancelText);

    cancelBtn.setSize(120, 42);
    cancelBtn.setInteractive({ useHandCursor: true });
    cancelBtn.on('pointerdown', () => {
      audioManager.playButtonClick();
      confirmOverlay.destroy();
    });
    dialog.add(cancelBtn);

    // Confirm Button (Crimson)
    const confirmBtn = this.scene.add.container(75, 65);
    const confirmBg = this.scene.add.graphics();
    confirmBg.fillStyle(0xdc2626, 1);
    confirmBg.fillRoundedRect(-60, -20, 120, 42, 10);
    confirmBtn.add(confirmBg);

    const confirmText = this.scene.add.text(0, 0, 'RESET ALL', {
      fontFamily: 'Poppins, sans-serif',
      fontSize: '13px',
      fontStyle: 'bold',
      color: '#FFFFFF'
    }).setOrigin(0.5);
    confirmBtn.add(confirmText);

    confirmBtn.setSize(120, 42);
    confirmBtn.setInteractive({ useHandCursor: true });
    confirmBtn.on('pointerdown', () => {
      audioManager.playButtonClick();
      SaveManager.getInstance().resetProgress();
      AudioManager.getInstance().syncSettings();
      confirmOverlay.destroy();
      this.close();

      if (this.onResetCallback) {
        this.onResetCallback();
      } else {
        this.scene.scene.restart();
      }
    });
    dialog.add(confirmBtn);
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

  public close() {
    BackButtonManager.getInstance().removeModal(this);
    this.scene.tweens.add({
      targets: [this.panel, this.backdrop],
      alpha: 0,
      scale: 0.9,
      duration: 150,
      ease: 'Quad.easeIn',
      onComplete: () => {
        if (this.onCloseCallback) {
          this.onCloseCallback();
        }
        this.destroy();
      }
    });
  }
}
