import Phaser from 'phaser';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../../constants/gameplay';
import { MissionManager } from '../../managers/MissionManager';
import { SaveManager } from '../../managers/SaveManager';
import { AudioManager } from '../../managers/AudioManager';

/**
 * MISSIONS MODAL
 * 3-Card dynamic mission board showcasing Easy, Medium, and Hard active objectives.
 * Instant slot replenishment upon reward claiming.
 * Milestone 7.3.
 */
export class MissionsModal extends Phaser.GameObjects.Container {
  private backdrop!: Phaser.GameObjects.Rectangle;
  private panel!: Phaser.GameObjects.Container;
  private coinText!: Phaser.GameObjects.Text;
  private onCloseCallback?: () => void;
  private onClaimCallback?: (coins: number) => void;
  private cardsContainer!: Phaser.GameObjects.Container;

  constructor(scene: Phaser.Scene, onClose?: () => void, onClaim?: (coins: number) => void) {
    super(scene, 0, 0);
    this.onCloseCallback = onClose;
    this.onClaimCallback = onClaim;

    this.createModal();
    scene.add.existing(this);
    this.setDepth(100);

    this.animateOpen();
  }

  private createModal() {
    const width = this.scene.scale.width || CANVAS_WIDTH;
    const height = this.scene.scale.height || CANVAS_HEIGHT;
    const saveManager = SaveManager.getInstance();
    const audioManager = AudioManager.getInstance();

    // 1. Backdrop
    this.backdrop = this.scene.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.75);
    this.backdrop.setInteractive();
    this.backdrop.on('pointerdown', () => this.close());
    this.add(this.backdrop);

    // 2. Center Panel
    this.panel = this.scene.add.container(width / 2, height / 2);
    this.add(this.panel);

    const panelWidth = 384;
    const panelHeight = 540;

    const bg = this.scene.add.graphics();
    // Shadow
    bg.fillStyle(0x000000, 0.6);
    bg.fillRoundedRect(-panelWidth / 2, -panelHeight / 2 + 6, panelWidth, panelHeight, 24);

    // Body (Deep Royal Navy)
    bg.fillStyle(0x172554, 0.96);
    bg.fillRoundedRect(-panelWidth / 2, -panelHeight / 2, panelWidth, panelHeight, 24);

    // Cyan Bezel Border
    bg.lineStyle(2, 0x06B6D4, 0.85);
    bg.strokeRoundedRect(-panelWidth / 2, -panelHeight / 2, panelWidth, panelHeight, 24);

    // Top Gloss
    bg.fillStyle(0xffffff, 0.12);
    bg.fillRoundedRect(-panelWidth / 2 + 2, -panelHeight / 2 + 2, panelWidth - 4, 38, 22);
    this.panel.add(bg);

    // Header Title
    const title = this.scene.add.text(-panelWidth / 2 + 24, -panelHeight / 2 + 34, '🎯  MISSIONS', {
      fontFamily: 'Poppins, sans-serif',
      fontSize: '20px',
      fontStyle: 'bold',
      color: '#FFFFFF'
    }).setOrigin(0, 0.5);
    this.panel.add(title);

    // Header Coin Pill
    const coinPill = this.scene.add.container(panelWidth / 2 - 95, -panelHeight / 2 + 34);
    const coinBg = this.scene.add.graphics();
    coinBg.fillStyle(0x0F172A, 0.9);
    coinBg.lineStyle(1.5, 0xF59E0B, 0.9);
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

    // Subtitle
    const subText = this.scene.add.text(0, -panelHeight / 2 + 72, 'Complete active missions to earn instant coin bounties!', {
      fontFamily: 'Poppins, sans-serif',
      fontSize: '12px',
      color: '#93C5FD'
    }).setOrigin(0.5);
    this.panel.add(subText);

    // Cards Grid Container
    this.cardsContainer = this.scene.add.container(0, 0);
    this.panel.add(this.cardsContainer);

    this.renderMissions();
  }

  private renderMissions() {
    this.cardsContainer.removeAll(true);
    const missionManager = MissionManager.getInstance();
    const active = missionManager.getActiveMissions();

    const startY = -125;
    const cardWidth = 340;
    const cardHeight = 115;
    const spacing = 128;

    active.forEach(({ state, definition }, index) => {
      const y = startY + index * spacing;
      const card = this.scene.add.container(0, y);
      this.cardsContainer.add(card);

      const isCompleted = state.progress >= state.target;
      const progressFraction = Math.min(state.progress / state.target, 1);

      // Tier Color Mapping
      let tierColor = 0x10B981; // Easy: Emerald
      let tierLabel = 'EASY';
      if (definition.tier === 'medium') {
        tierColor = 0x06B6D4; // Medium: Cyan
        tierLabel = 'MEDIUM';
      } else if (definition.tier === 'hard') {
        tierColor = 0xEF4444; // Hard: Coral Red
        tierLabel = 'HARD';
      }

      const bg = this.scene.add.graphics();
      // Drop Shadow
      bg.fillStyle(0x000000, 0.35);
      bg.fillRoundedRect(-cardWidth / 2, -cardHeight / 2 + 3, cardWidth, cardHeight, 16);

      // Card Body
      bg.fillStyle(0x0F172A, 0.85);
      bg.fillRoundedRect(-cardWidth / 2, -cardHeight / 2, cardWidth, cardHeight, 16);

      // Left Accent Bar
      bg.fillStyle(tierColor, 1);
      bg.fillRoundedRect(-cardWidth / 2, -cardHeight / 2, 6, cardHeight, { tl: 16, bl: 16, tr: 0, br: 0 });

      // Bezel
      bg.lineStyle(1.5, isCompleted ? 0xF59E0B : tierColor, isCompleted ? 0.9 : 0.45);
      bg.strokeRoundedRect(-cardWidth / 2, -cardHeight / 2, cardWidth, cardHeight, 16);
      card.add(bg);

      // Tier Badge
      const tierBadge = this.scene.add.graphics();
      tierBadge.fillStyle(tierColor, 0.2);
      tierBadge.fillRoundedRect(-cardWidth / 2 + 18, -cardHeight / 2 + 14, 56, 20, 6);
      card.add(tierBadge);

      const tierText = this.scene.add.text(-cardWidth / 2 + 46, -cardHeight / 2 + 24, tierLabel, {
        fontFamily: 'Poppins, sans-serif',
        fontSize: '10px',
        fontStyle: 'bold',
        color: `#${tierColor.toString(16).padStart(6, '0')}`
      }).setOrigin(0.5);
      card.add(tierText);

      // Mission Title
      const title = this.scene.add.text(-cardWidth / 2 + 82, -cardHeight / 2 + 24, definition.title, {
        fontFamily: 'Poppins, sans-serif',
        fontSize: '14px',
        fontStyle: 'bold',
        color: '#FFFFFF'
      }).setOrigin(0, 0.5);
      card.add(title);

      // Description
      const desc = this.scene.add.text(-cardWidth / 2 + 18, -cardHeight / 2 + 50, definition.description, {
        fontFamily: 'Poppins, sans-serif',
        fontSize: '11px',
        color: '#94A3B8'
      }).setOrigin(0, 0.5);
      card.add(desc);

      // Progress Bar
      const barWidth = 200;
      const barHeight = 8;
      const barX = -cardWidth / 2 + 18;
      const barY = -cardHeight / 2 + 76;

      const pBg = this.scene.add.graphics();
      pBg.fillStyle(0x1E293B, 1);
      pBg.fillRoundedRect(barX, barY, barWidth, barHeight, 4);
      card.add(pBg);

      const pFill = this.scene.add.graphics();
      pFill.fillStyle(isCompleted ? 0xF59E0B : tierColor, 1);
      pFill.fillRoundedRect(barX, barY, barWidth * progressFraction, barHeight, 4);
      card.add(pFill);

      // Progress Numbers
      const pText = this.scene.add.text(barX + barWidth + 12, barY + 4, `${state.progress}/${state.target}`, {
        fontFamily: 'Poppins, sans-serif',
        fontSize: '11px',
        fontStyle: 'bold',
        color: isCompleted ? '#FDE047' : '#CBD5E1'
      }).setOrigin(0, 0.5);
      card.add(pText);

      // Action Button (Claim 🪙 N or Bounty Label)
      if (isCompleted) {
        const claimBtn = this.scene.add.container(cardWidth / 2 - 62, 0);
        card.add(claimBtn);

        const btnBg = this.scene.add.graphics();
        btnBg.fillStyle(0xF59E0B, 1);
        btnBg.fillRoundedRect(-52, -18, 104, 36, 12);
        btnBg.lineStyle(1.5, 0xFDE047, 1);
        btnBg.strokeRoundedRect(-52, -18, 104, 36, 12);
        claimBtn.add(btnBg);

        const claimLabel = this.scene.add.text(0, -1, `CLAIM 🪙`, {
          fontFamily: 'Poppins, sans-serif',
          fontSize: '12px',
          fontStyle: 'bold',
          color: '#000000'
        }).setOrigin(0.5);
        claimBtn.add(claimLabel);

        claimBtn.setSize(104, 36);
        claimBtn.setInteractive({ useHandCursor: true });

        // Pulse Claim button
        this.scene.tweens.add({
          targets: claimBtn,
          scale: 1.05,
          duration: 750,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut'
        });

        claimBtn.on('pointerdown', () => {
          AudioManager.getInstance().playCombo();
          const success = missionManager.claimMission(state.id);
          if (success) {
            this.triggerGoldBurstAnimation(card.x + claimBtn.x, card.y + claimBtn.y, () => {
              if (this.onClaimCallback) this.onClaimCallback(definition.rewardCoins);
              this.refreshCoins();
              this.renderMissions();
            });
          }
        });
      } else {
        // Reward bounty indicator
        const bountyContainer = this.scene.add.container(cardWidth / 2 - 55, 0);
        card.add(bountyContainer);

        const bountyBg = this.scene.add.graphics();
        bountyBg.fillStyle(0x1E293B, 0.8);
        bountyBg.fillRoundedRect(-44, -16, 88, 32, 10);
        bountyContainer.add(bountyBg);

        const bountyText = this.scene.add.text(0, 0, `+${definition.rewardCoins} 🪙`, {
          fontFamily: 'Poppins, sans-serif',
          fontSize: '12px',
          fontStyle: 'bold',
          color: '#FDE047'
        }).setOrigin(0.5);
        bountyContainer.add(bountyText);
      }
    });
  }

  private triggerGoldBurstAnimation(centerX: number, centerY: number, onComplete: () => void) {
    const particleCount = 26;
    const colors = [0xFFD700, 0xFACC15, 0xF59E0B, 0xFFFFFF, 0x34D399];

    for (let i = 0; i < particleCount; i++) {
      const angle = Phaser.Math.Between(0, 360) * (Math.PI / 180);
      const speed = Phaser.Math.Between(80, 220);
      const col = colors[Phaser.Math.Between(0, colors.length - 1)];

      const spark = this.scene.add.circle(centerX + this.panel.x, centerY + this.panel.y, Phaser.Math.Between(3, 5), col);
      spark.setDepth(150);

      const targetX = spark.x + Math.cos(angle) * speed;
      const targetY = spark.y + Math.sin(angle) * speed;

      this.scene.tweens.add({
        targets: spark,
        x: targetX,
        y: targetY,
        scale: { from: 1.6, to: 0 },
        alpha: { from: 1, to: 0 },
        duration: Phaser.Math.Between(400, 750),
        ease: 'Cubic.easeOut',
        onComplete: () => spark.destroy()
      });
    }

    this.scene.time.delayedCall(300, onComplete);
  }

  private refreshCoins() {
    const saveManager = SaveManager.getInstance();
    if (this.coinText) {
      this.coinText.setText(`🪙 ${saveManager.getCoins().toLocaleString()}`);
    }
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
