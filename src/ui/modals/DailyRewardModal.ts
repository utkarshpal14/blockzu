import Phaser from 'phaser';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../../constants/gameplay';
import { DailyRewardManager, DAILY_REWARD_SCHEDULE } from '../../managers/DailyRewardManager';
import { SaveManager } from '../../managers/SaveManager';
import { AudioManager } from '../../managers/AudioManager';

/**
 * DAILY REWARD MODAL
 * 7-day progressive streak calendar with live claiming, countdown timers, and celebration FX.
 * Milestone 7.4.
 */
export class DailyRewardModal extends Phaser.GameObjects.Container {
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
    const panelHeight = 520;

    const bg = this.scene.add.graphics();
    // Shadow
    bg.fillStyle(0x000000, 0.6);
    bg.fillRoundedRect(-panelWidth / 2, -panelHeight / 2 + 6, panelWidth, panelHeight, 24);

    // Body (Deep Royal Navy)
    bg.fillStyle(0x172554, 0.96);
    bg.fillRoundedRect(-panelWidth / 2, -panelHeight / 2, panelWidth, panelHeight, 24);

    // Gold Bezel Border
    bg.lineStyle(2, 0xF59E0B, 0.9);
    bg.strokeRoundedRect(-panelWidth / 2, -panelHeight / 2, panelWidth, panelHeight, 24);

    // Top Gloss
    bg.fillStyle(0xffffff, 0.12);
    bg.fillRoundedRect(-panelWidth / 2 + 2, -panelHeight / 2 + 2, panelWidth - 4, 38, 22);
    this.panel.add(bg);

    // Header Title
    const title = this.scene.add.text(-panelWidth / 2 + 24, -panelHeight / 2 + 34, '🎁  DAILY REWARDS', {
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
    const subText = this.scene.add.text(0, -panelHeight / 2 + 72, 'Log in every day to collect bigger rewards!', {
      fontFamily: 'Poppins, sans-serif',
      fontSize: '12px',
      color: '#93C5FD'
    }).setOrigin(0.5);
    this.panel.add(subText);

    // Cards Grid Container
    this.cardsContainer = this.scene.add.container(0, 0);
    this.panel.add(this.cardsContainer);

    this.renderRewardCards();
  }

  private renderRewardCards() {
    this.cardsContainer.removeAll(true);
    const dailyManager = DailyRewardManager.getInstance();
    const isAvailable = dailyManager.isRewardAvailable();
    const eligibleDay = dailyManager.getEligibleDay();
    const currentStreak = SaveManager.getInstance().getData().dailyReward?.currentStreak ?? 0;

    // Layout: Days 1-4 on row 1, Days 5-6 on row 2, Day 7 as double-width mega card
    DAILY_REWARD_SCHEDULE.forEach((tier) => {
      let x = 0;
      let y = 0;
      let cardWidth = 76;
      const cardHeight = 104;

      if (tier.day <= 4) {
        // Row 1 (Days 1 to 4)
        const col = tier.day - 1;
        x = -126 + col * 84;
        y = -115;
      } else if (tier.day <= 6) {
        // Row 2 (Days 5 to 6)
        const col = tier.day - 5;
        x = -84 + col * 84;
        y = 15;
      } else {
        // Day 7 (Big Gold Chest Card)
        x = 84;
        y = 15;
        cardWidth = 160;
      }

      const card = this.scene.add.container(x, y);
      this.cardsContainer.add(card);

      const isClaimed = !isAvailable ? tier.day <= currentStreak : tier.day < eligibleDay;
      const isToday = isAvailable && tier.day === eligibleDay;

      const bg = this.scene.add.graphics();
      // Drop Shadow
      bg.fillStyle(0x000000, 0.35);
      bg.fillRoundedRect(-cardWidth / 2, -cardHeight / 2 + 3, cardWidth, cardHeight, 12);

      if (isToday) {
        // Glowing Gold Active Card
        bg.fillStyle(0x78350f, 0.9);
        bg.fillRoundedRect(-cardWidth / 2, -cardHeight / 2, cardWidth, cardHeight, 12);
        bg.lineStyle(2, 0xF59E0B, 1);
        bg.strokeRoundedRect(-cardWidth / 2, -cardHeight / 2, cardWidth, cardHeight, 12);
      } else if (isClaimed) {
        // Claimed Emerald Card
        bg.fillStyle(0x064e3b, 0.6);
        bg.fillRoundedRect(-cardWidth / 2, -cardHeight / 2, cardWidth, cardHeight, 12);
        bg.lineStyle(1.5, 0x10b981, 0.7);
        bg.strokeRoundedRect(-cardWidth / 2, -cardHeight / 2, cardWidth, cardHeight, 12);
      } else {
        // Locked Slate Card
        bg.fillStyle(0x0F172A, 0.7);
        bg.fillRoundedRect(-cardWidth / 2, -cardHeight / 2, cardWidth, cardHeight, 12);
        bg.lineStyle(1.5, 0x334155, 0.6);
        bg.strokeRoundedRect(-cardWidth / 2, -cardHeight / 2, cardWidth, cardHeight, 12);
      }
      card.add(bg);

      // Day Label
      const dayLabel = this.scene.add.text(0, -cardHeight / 2 + 16, `DAY ${tier.day}`, {
        fontFamily: 'Poppins, sans-serif',
        fontSize: '11px',
        fontStyle: 'bold',
        color: isToday ? '#FDE047' : isClaimed ? '#6EE7B7' : '#94A3B8'
      }).setOrigin(0.5);
      card.add(dayLabel);

      // Icon
      const icon = this.scene.add.text(0, -cardHeight / 2 + 42, isClaimed ? '✅' : tier.icon, {
        fontSize: tier.day === 7 ? '28px' : '22px'
      }).setOrigin(0.5);
      card.add(icon);

      // Reward Coins
      const rewardText = this.scene.add.text(0, -cardHeight / 2 + 70, `+${tier.coins}`, {
        fontFamily: 'Poppins, sans-serif',
        fontSize: '13px',
        fontStyle: 'bold',
        color: isToday ? '#FDE047' : isClaimed ? '#34D399' : '#FFFFFF'
      }).setOrigin(0.5);
      card.add(rewardText);

      // Status Pill
      const statusText = isClaimed ? 'CLAIMED' : isToday ? 'READY!' : 'LOCKED';
      const statusLabel = this.scene.add.text(0, cardHeight / 2 - 14, statusText, {
        fontFamily: 'Poppins, sans-serif',
        fontSize: '9px',
        fontStyle: 'bold',
        color: isToday ? '#F59E0B' : isClaimed ? '#10B981' : '#64748B'
      }).setOrigin(0.5);
      card.add(statusLabel);

      if (isToday) {
        // Pulse animation on today's active card
        this.scene.tweens.add({
          targets: card,
          scale: 1.04,
          duration: 800,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut'
        });
      }
    });

    // Big Bottom Claim Button or Next Cooldown Timer
    const btnY = 185;
    const btnWidth = 280;
    const btnHeight = 52;

    if (isAvailable) {
      const claimBtn = this.scene.add.container(0, btnY);
      this.cardsContainer.add(claimBtn);

      const btnBg = this.scene.add.graphics();
      // Drop Shadow
      btnBg.fillStyle(0x000000, 0.4);
      btnBg.fillRoundedRect(-btnWidth / 2, -btnHeight / 2 + 3, btnWidth, btnHeight, 16);

      // Body
      btnBg.fillStyle(0xF59E0B, 1);
      btnBg.fillRoundedRect(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight, 16);

      // Border Glow
      btnBg.lineStyle(2, 0xFDE047, 0.9);
      btnBg.strokeRoundedRect(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight, 16);

      // Gloss
      btnBg.fillStyle(0xffffff, 0.28);
      btnBg.fillRoundedRect(-btnWidth / 2 + 2, -btnHeight / 2 + 2, btnWidth - 4, btnHeight * 0.45, 12);
      claimBtn.add(btnBg);

      const targetTier = DAILY_REWARD_SCHEDULE.find((r) => r.day === eligibleDay) || DAILY_REWARD_SCHEDULE[0];
      const claimText = this.scene.add.text(0, -1, `CLAIM ${targetTier.coins} COINS 🪙`, {
        fontFamily: 'Poppins, sans-serif',
        fontSize: '16px',
        fontStyle: 'bold',
        color: '#000000'
      }).setOrigin(0.5);
      claimBtn.add(claimText);

      claimBtn.setSize(btnWidth, btnHeight);
      claimBtn.setInteractive({ useHandCursor: true });

      claimBtn.on('pointerdown', () => {
        AudioManager.getInstance().playCombo();
        const res = dailyManager.claimDailyReward();
        if (res) {
          this.triggerGoldBurstAnimation(0, btnY, () => {
            if (this.onClaimCallback) this.onClaimCallback(res.coins);
            this.refreshCoins();
            this.renderRewardCards();
          });
        }
      });
    } else {
      // Cooldown Timer Banner
      const timerContainer = this.scene.add.container(0, btnY);
      this.cardsContainer.add(timerContainer);

      const timerBg = this.scene.add.graphics();
      timerBg.fillStyle(0x0F172A, 0.85);
      timerBg.lineStyle(1.5, 0x334155, 0.8);
      timerBg.fillRoundedRect(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight, 16);
      timerBg.strokeRoundedRect(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight, 16);
      timerContainer.add(timerBg);

      const remainingMs = dailyManager.getTimeUntilNextClaimMs();
      const hours = Math.floor(remainingMs / (1000 * 60 * 60));
      const mins = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));

      const timerText = this.scene.add.text(0, 0, `⏳ Next reward in ${hours}h ${mins}m`, {
        fontFamily: 'Poppins, sans-serif',
        fontSize: '14px',
        fontStyle: 'bold',
        color: '#93C5FD'
      }).setOrigin(0.5);
      timerContainer.add(timerText);
    }
  }

  private triggerGoldBurstAnimation(centerX: number, centerY: number, onComplete: () => void) {
    const particleCount = 28;
    const colors = [0xFFD700, 0xFACC15, 0xF59E0B, 0xFFFFFF, 0x34D399];

    for (let i = 0; i < particleCount; i++) {
      const angle = Phaser.Math.Between(0, 360) * (Math.PI / 180);
      const speed = Phaser.Math.Between(80, 240);
      const col = colors[Phaser.Math.Between(0, colors.length - 1)];

      const spark = this.scene.add.circle(centerX + this.panel.x, centerY + this.panel.y, Phaser.Math.Between(3, 6), col);
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
