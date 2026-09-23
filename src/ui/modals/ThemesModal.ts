import Phaser from 'phaser';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../../constants/gameplay';
import { ThemeManager } from '../../managers/ThemeManager';
import { SaveManager } from '../../managers/SaveManager';
import { AudioManager } from '../../managers/AudioManager';
import { Theme } from '../../types/Theme';
import { BlockRenderer } from '../components/BlockRenderer';
import { BackButtonManager } from '../../managers/BackButtonManager';

/**
 * THEMES MODAL
 * High-quality 2-column theme gallery featuring Mini Board Previews,
 * gold particle unlock animations, and instant theme switching.
 * Defined in Document 04 (Section 23), Document 05 & Milestone 6.
 */
export class ThemesModal extends Phaser.GameObjects.Container {
  private backdrop!: Phaser.GameObjects.Rectangle;
  private panel!: Phaser.GameObjects.Container;
  private coinText!: Phaser.GameObjects.Text;
  private onCloseCallback?: () => void;
  private onThemeChanged?: (themeId: string) => void;
  private cardsContainer!: Phaser.GameObjects.Container;

  constructor(scene: Phaser.Scene, onClose?: () => void, onThemeChanged?: (themeId: string) => void) {
    super(scene, 0, 0);
    this.onCloseCallback = onClose;
    this.onThemeChanged = onThemeChanged;

    this.createModal();
    scene.add.existing(this);
    this.setDepth(100);

    BackButtonManager.getInstance().pushModal(this, () => this.close());
    this.animateOpen();
  }

  private createModal() {
    const width = this.scene.scale.width || CANVAS_WIDTH;
    const height = this.scene.scale.height || CANVAS_HEIGHT;
    const saveManager = SaveManager.getInstance();
    const audioManager = AudioManager.getInstance();

    // 1. Semi-transparent click-blocker backdrop
    this.backdrop = this.scene.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.75);
    this.backdrop.setInteractive();
    this.backdrop.on('pointerdown', () => this.close());
    this.add(this.backdrop);

    // 2. Modal Panel
    this.panel = this.scene.add.container(width / 2, height / 2);
    this.add(this.panel);

    const panelWidth = 404;
    const panelHeight = 670;

    const bg = this.scene.add.graphics();
    // Drop shadow
    bg.fillStyle(0x000000, 0.6);
    bg.fillRoundedRect(-panelWidth / 2, -panelHeight / 2 + 6, panelWidth, panelHeight, 24);

    // Body
    bg.fillStyle(0x1E293B, 0.96);
    bg.fillRoundedRect(-panelWidth / 2, -panelHeight / 2, panelWidth, panelHeight, 24);

    // Violet/Pink Bezel
    bg.lineStyle(2, 0x8B5CF6, 0.85);
    bg.strokeRoundedRect(-panelWidth / 2, -panelHeight / 2, panelWidth, panelHeight, 24);

    // Top Gloss
    bg.fillStyle(0xffffff, 0.08);
    bg.fillRoundedRect(-panelWidth / 2 + 2, -panelHeight / 2 + 2, panelWidth - 4, 38, 22);
    this.panel.add(bg);

    // Header Title
    const title = this.scene.add.text(-panelWidth / 2 + 24, -panelHeight / 2 + 34, '🎨  THEMES', {
      fontFamily: 'Poppins, sans-serif',
      fontSize: '20px',
      fontStyle: 'bold',
      color: '#FFFFFF'
    }).setOrigin(0, 0.5);
    this.panel.add(title);

    // Header Coin Pill (Live Gold Coin Display)
    const coinPill = this.scene.add.container(panelWidth / 2 - 95, -panelHeight / 2 + 34);
    const coinBg = this.scene.add.graphics();
    coinBg.fillStyle(0x0F172A, 0.9);
    coinBg.lineStyle(1.5, 0xF59E0B, 0.9); // Gold border
    coinBg.fillRoundedRect(-50, -14, 100, 28, 14);
    coinBg.strokeRoundedRect(-50, -14, 100, 28, 14);
    coinPill.add(coinBg);

    this.coinText = this.scene.add.text(0, -1, `🪙 ${saveManager.getCoins().toLocaleString()}`, {
      fontFamily: 'Poppins, sans-serif',
      fontSize: '13px',
      fontStyle: 'bold',
      color: '#FDE047'
    }).setOrigin(0.5);
    coinPill.add(this.coinText);
    this.panel.add(coinPill);

    // Close Button (✕)
    const closeBtn = this.scene.add.text(panelWidth / 2 - 24, -panelHeight / 2 + 34, '✕', {
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

    // Cards Grid Container
    this.cardsContainer = this.scene.add.container(0, 0);
    this.panel.add(this.cardsContainer);

    this.renderThemeCards();
  }

  private renderThemeCards() {
    this.cardsContainer.removeAll(true);

    const themeManager = ThemeManager.getInstance();
    const saveManager = SaveManager.getInstance();
    const themes = themeManager.getAllThemes();
    const activeTheme = themeManager.getActiveTheme();
    const bestScore = saveManager.getBestScore();
    const coins = saveManager.getCoins();

    const cardWidth = 178;
    const cardHeight = 132;
    const colSpacing = 188;
    const rowSpacing = 142;
    const startX = -colSpacing / 2;
    const startY = -180;

    themes.forEach((t, index) => {
      const col = index % 2;
      const row = Math.floor(index / 2);
      const x = startX + col * colSpacing;
      const y = startY + row * rowSpacing;

      const isUnlocked = themeManager.isThemeUnlocked(t.id);
      const isActive = t.id === activeTheme.id;
      const canBuy = !isUnlocked && !t.isSecret && bestScore >= t.unlockScore && coins >= t.coinCost;
      const scoreLocked = !isUnlocked && !t.isSecret && bestScore < t.unlockScore;
      const coinsLocked = !isUnlocked && !t.isSecret && bestScore >= t.unlockScore && coins < t.coinCost;

      const card = this.scene.add.container(x, y);
      this.cardsContainer.add(card);

      // Card Background
      const cardBg = this.scene.add.graphics();
      // Drop Shadow
      cardBg.fillStyle(0x000000, 0.4);
      cardBg.fillRoundedRect(-cardWidth / 2, -cardHeight / 2 + 3, cardWidth, cardHeight, 14);

      if (isActive) {
        // Glowing Emerald Active Card
        cardBg.fillStyle(0x064e3b, 0.9);
        cardBg.fillRoundedRect(-cardWidth / 2, -cardHeight / 2, cardWidth, cardHeight, 14);
        cardBg.lineStyle(2, 0x10b981, 1);
        cardBg.strokeRoundedRect(-cardWidth / 2, -cardHeight / 2, cardWidth, cardHeight, 14);
      } else {
        cardBg.fillStyle(0x0F172A, 0.8);
        cardBg.fillRoundedRect(-cardWidth / 2, -cardHeight / 2, cardWidth, cardHeight, 14);
        cardBg.lineStyle(1.5, 0x334155, 0.7);
        cardBg.strokeRoundedRect(-cardWidth / 2, -cardHeight / 2, cardWidth, cardHeight, 14);
      }
      card.add(cardBg);

      // Mini Board Preview
      const miniPreview = this.createMiniBoardPreview(t);
      miniPreview.setPosition(-cardWidth / 2 + 12, -cardHeight / 2 + 10);
      card.add(miniPreview);

      // Theme Info & Name
      const nameText = this.scene.add.text(-cardWidth / 2 + 76, -cardHeight / 2 + 18, t.name, {
        fontFamily: 'Poppins, sans-serif',
        fontSize: '14px',
        fontStyle: 'bold',
        color: '#FFFFFF'
      }).setOrigin(0, 0.5);
      card.add(nameText);

      // Subtitle / Req
      let subtext = 'Unlocked';
      let subColor = '#34D399';
      if (isActive) {
        subtext = 'Active';
        subColor = '#34D399';
      } else if (isUnlocked) {
        subtext = 'Tap to apply';
        subColor = '#38BDF8';
      } else if (t.isSecret) {
        subtext = 'Secret Theme';
        subColor = '#94A3B8';
      } else if (scoreLocked) {
        subtext = `Score ≥ ${t.unlockScore}`;
        subColor = '#F87171';
      } else {
        subtext = `🪙 ${t.coinCost} Coins`;
        subColor = '#FDE047';
      }

      const subTextObj = this.scene.add.text(-cardWidth / 2 + 76, -cardHeight / 2 + 38, subtext, {
        fontFamily: 'Poppins, sans-serif',
        fontSize: '11px',
        color: subColor
      }).setOrigin(0, 0.5);
      card.add(subTextObj);

      // Action Button
      this.createCardActionButton(card, t, isUnlocked, isActive, canBuy, scoreLocked, coinsLocked);
    });
  }

  /**
   * Generates a 4x4 Mini Board Preview using the theme's actual colors.
   */
  private createMiniBoardPreview(theme: Theme): Phaser.GameObjects.Container {
    const container = this.scene.add.container(0, 0);
    const size = 52;
    const cells = 4;
    const cellSize = 10;
    const gap = 2;
    const padding = 3;

    // Mini board background
    const bg = this.scene.add.graphics();
    bg.fillStyle(Phaser.Display.Color.HexStringToColor(theme.colors.board).color, 1);
    bg.lineStyle(1, Phaser.Display.Color.HexStringToColor(theme.colors.cellEmpty).color, 0.8);
    bg.fillRoundedRect(0, 0, size, size, 6);
    bg.strokeRoundedRect(0, 0, size, size, 6);
    container.add(bg);

    // Mini pattern: a signature Tetromino / Blockzu shape (e.g. T or L shape filled)
    const pattern = [
      [0, 0, 0, 0],
      [0, 1, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 1, 0]
    ];

    for (let r = 0; r < cells; r++) {
      for (let c = 0; c < cells; c++) {
        const x = padding + c * (cellSize + gap);
        const y = padding + r * (cellSize + gap);
        const cellG = this.scene.add.graphics();

        if (pattern[r][c] === 1) {
          BlockRenderer.renderJewelBlock(cellG, x, y, cellSize, 2.5, theme.colors.cellFilled);
        } else {
          BlockRenderer.renderRecessedSlot(cellG, x, y, cellSize, 2.5, theme.colors.cellEmpty);
        }
        container.add(cellG);
      }
    }

    return container;
  }

  private createCardActionButton(
    card: Phaser.GameObjects.Container,
    theme: Theme,
    isUnlocked: boolean,
    isActive: boolean,
    canBuy: boolean,
    scoreLocked: boolean,
    coinsLocked: boolean
  ) {
    const themeManager = ThemeManager.getInstance();
    const audioManager = AudioManager.getInstance();

    const btnWidth = 154;
    const btnHeight = 32;
    const btnY = 44;

    const btn = this.scene.add.container(0, btnY);
    card.add(btn);

    const btnBg = this.scene.add.graphics();
    btn.add(btnBg);

    let labelText = '';
    let bgColor = 0x334155;
    let borderColor = 0x475569;
    let textColor = '#FFFFFF';
    let isClickable = false;

    if (isActive) {
      labelText = 'ACTIVE ✓';
      bgColor = 0x10B981; // Emerald
      borderColor = 0x34D399;
      textColor = '#FFFFFF';
    } else if (isUnlocked) {
      labelText = 'SELECT';
      bgColor = 0x2563EB; // Royal Blue
      borderColor = 0x38BDF8;
      textColor = '#FFFFFF';
      isClickable = true;
    } else if (canBuy) {
      labelText = `UNLOCK (🪙 ${theme.coinCost})`;
      bgColor = 0xEAB308; // Gold
      borderColor = 0xFDE047;
      textColor = '#000000';
      isClickable = true;
    } else if (coinsLocked) {
      labelText = `NEED 🪙 ${theme.coinCost}`;
      bgColor = 0x1E293B;
      borderColor = 0x475569;
      textColor = '#94A3B8';
    } else if (scoreLocked) {
      labelText = `LOCKED (≥ ${theme.unlockScore})`;
      bgColor = 0x1E293B;
      borderColor = 0x475569;
      textColor = '#94A3B8';
    } else {
      labelText = '🔒 SECRET';
      bgColor = 0x1E293B;
      borderColor = 0x475569;
      textColor = '#94A3B8';
    }

    btnBg.fillStyle(bgColor, 1);
    btnBg.fillRoundedRect(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight, 8);
    btnBg.lineStyle(1.5, borderColor, 0.8);
    btnBg.strokeRoundedRect(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight, 8);

    const label = this.scene.add.text(0, 0, labelText, {
      fontFamily: 'Poppins, sans-serif',
      fontSize: '12px',
      fontStyle: 'bold',
      color: textColor
    }).setOrigin(0.5);
    btn.add(label);

    if (isClickable) {
      btn.setSize(btnWidth, btnHeight);
      btn.setInteractive({ useHandCursor: true });

      btn.on('pointerdown', () => {
        if (isActive) return;

        if (isUnlocked) {
          audioManager.playButtonClick();
          themeManager.selectTheme(theme.id);
          this.refreshAll(theme.id);
        } else if (canBuy) {
          // Unlock Flow with Gold Burst Animation!
          const success = themeManager.purchaseTheme(theme);
          if (success) {
            audioManager.playCombo();
            this.triggerGoldBurstAnimation(card.x + this.panel.x, card.y + this.panel.y + btnY, () => {
              this.refreshAll(theme.id);
            });
          }
        }
      });
    }
  }

  /**
   * Celebratory Gold Burst particle explosion when unlocking a new theme!
   */
  private triggerGoldBurstAnimation(centerX: number, centerY: number, onComplete: () => void) {
    const particleCount = 28;
    const colors = [0xFFD700, 0xFACC15, 0xF59E0B, 0xFFFFFF, 0x34D399];

    for (let i = 0; i < particleCount; i++) {
      const angle = Phaser.Math.Between(0, 360) * (Math.PI / 180);
      const speed = Phaser.Math.Between(80, 240);
      const col = colors[Phaser.Math.Between(0, colors.length - 1)];

      const spark = this.scene.add.circle(centerX, centerY, Phaser.Math.Between(3, 6), col);
      spark.setDepth(150);

      const targetX = centerX + Math.cos(angle) * speed;
      const targetY = centerY + Math.sin(angle) * speed;

      this.scene.tweens.add({
        targets: spark,
        x: targetX,
        y: targetY,
        scale: { from: 1.6, to: 0 },
        alpha: { from: 1, to: 0 },
        duration: Phaser.Math.Between(400, 750),
        ease: 'Cubic.easeOut',
        onComplete: () => {
          spark.destroy();
        }
      });
    }

    this.scene.time.delayedCall(300, onComplete);
  }

  private refreshAll(newThemeId: string) {
    const saveManager = SaveManager.getInstance();
    this.coinText.setText(`🪙 ${saveManager.getCoins().toLocaleString()}`);

    if (this.onThemeChanged) {
      this.onThemeChanged(newThemeId);
    }

    this.renderThemeCards();
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
      duration: 140,
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
