import Phaser from 'phaser';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../../constants/gameplay';
import { AchievementManager } from '../../managers/AchievementManager';
import { SaveManager } from '../../managers/SaveManager';
import { AudioManager } from '../../managers/AudioManager';
import { AchievementCategory } from '../../types/Achievement';

/**
 * ACHIEVEMENTS MODAL
 * 20-Achievement gallery with category filters, live progress tracking, and reward claims.
 * Milestone 7.2.
 */
export class AchievementsModal extends Phaser.GameObjects.Container {
  private backdrop!: Phaser.GameObjects.Rectangle;
  private panel!: Phaser.GameObjects.Container;
  private coinText!: Phaser.GameObjects.Text;
  private onCloseCallback?: () => void;
  private onClaimCallback?: (coins: number) => void;
  private listContainer!: Phaser.GameObjects.Container;
  private selectedCategory: AchievementCategory | 'all' = 'all';
  private currentPage: number = 0;
  private itemsPerPage: number = 4;

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

    const panelWidth = 394;
    const panelHeight = 630;

    const bg = this.scene.add.graphics();
    // Shadow
    bg.fillStyle(0x000000, 0.6);
    bg.fillRoundedRect(-panelWidth / 2, -panelHeight / 2 + 6, panelWidth, panelHeight, 24);

    // Body (Deep Royal Navy)
    bg.fillStyle(0x172554, 0.96);
    bg.fillRoundedRect(-panelWidth / 2, -panelHeight / 2, panelWidth, panelHeight, 24);

    // Gold/Amber Bezel
    bg.lineStyle(2, 0xF59E0B, 0.9);
    bg.strokeRoundedRect(-panelWidth / 2, -panelHeight / 2, panelWidth, panelHeight, 24);

    // Top Gloss
    bg.fillStyle(0xffffff, 0.12);
    bg.fillRoundedRect(-panelWidth / 2 + 2, -panelHeight / 2 + 2, panelWidth - 4, 38, 22);
    this.panel.add(bg);

    // Header Title
    const title = this.scene.add.text(-panelWidth / 2 + 24, -panelHeight / 2 + 34, '🏆  ACHIEVEMENTS', {
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

    // Category Filter Pills
    this.createCategoryPills(panelWidth);

    // List Container
    this.listContainer = this.scene.add.container(0, 0);
    this.panel.add(this.listContainer);

    this.renderAchievements();
  }

  private createCategoryPills(panelWidth: number) {
    const categories: { key: AchievementCategory | 'all'; label: string }[] = [
      { key: 'all', label: 'All' },
      { key: 'beginner', label: 'Beginner' },
      { key: 'score', label: 'Score' },
      { key: 'lines', label: 'Lines' },
      { key: 'gameplay', label: 'Games' }
    ];

    const pillContainer = this.scene.add.container(0, -panelHeight_half() + 72);
    this.panel.add(pillContainer);

    const pillWidth = 66;
    const startX = -((categories.length - 1) * 72) / 2;

    categories.forEach((cat, idx) => {
      const x = startX + idx * 72;
      const isSelected = this.selectedCategory === cat.key;

      const p = this.scene.add.container(x, 0);
      pillContainer.add(p);

      const bg = this.scene.add.graphics();
      bg.fillStyle(isSelected ? 0xF59E0B : 0x0F172A, isSelected ? 1 : 0.8);
      bg.fillRoundedRect(-pillWidth / 2, -13, pillWidth, 26, 13);
      if (isSelected) {
        bg.lineStyle(1.5, 0xFDE047, 1);
        bg.strokeRoundedRect(-pillWidth / 2, -13, pillWidth, 26, 13);
      }
      p.add(bg);

      const text = this.scene.add.text(0, -1, cat.label, {
        fontFamily: 'Poppins, sans-serif',
        fontSize: '11px',
        fontStyle: 'bold',
        color: isSelected ? '#000000' : '#94A3B8'
      }).setOrigin(0.5);
      p.add(text);

      p.setSize(pillWidth, 26);
      p.setInteractive({ useHandCursor: true });
      p.on('pointerdown', () => {
        AudioManager.getInstance().playButtonClick();
        this.selectedCategory = cat.key;
        this.currentPage = 0;
        pillContainer.destroy();
        this.createCategoryPills(panelWidth);
        this.renderAchievements();
      });
    });
  }

  private renderAchievements() {
    this.listContainer.removeAll(true);
    const achievementManager = AchievementManager.getInstance();
    const allDefs = achievementManager.getAchievementDefinitions();

    const filtered = this.selectedCategory === 'all'
      ? allDefs
      : allDefs.filter((d) => d.category === this.selectedCategory);

    const totalPages = Math.ceil(filtered.length / this.itemsPerPage);
    const pageItems = filtered.slice(this.currentPage * this.itemsPerPage, (this.currentPage + 1) * this.itemsPerPage);

    const cardWidth = 350;
    const cardHeight = 88;
    const startY = -140;
    const spacing = 96;

    pageItems.forEach((def, index) => {
      const y = startY + index * spacing;
      const card = this.scene.add.container(0, y);
      this.listContainer.add(card);

      const state = achievementManager.getAchievementState(def.id) || { progress: 0, completed: false, claimed: false };
      const isClaimable = state.completed && !state.claimed;
      const isClaimed = state.claimed;
      const progressFraction = Math.min(state.progress / def.target, 1);

      const bg = this.scene.add.graphics();
      // Drop Shadow
      bg.fillStyle(0x000000, 0.35);
      bg.fillRoundedRect(-cardWidth / 2, -cardHeight / 2 + 3, cardWidth, cardHeight, 14);

      // Card Body
      if (isClaimable) {
        bg.fillStyle(0x78350f, 0.9); // Gold tint
        bg.lineStyle(1.5, 0xF59E0B, 1);
      } else if (isClaimed) {
        bg.fillStyle(0x064e3b, 0.6); // Emerald tint
        bg.lineStyle(1.5, 0x10b981, 0.7);
      } else {
        bg.fillStyle(0x0F172A, 0.85);
        bg.lineStyle(1.5, 0x334155, 0.5);
      }
      bg.fillRoundedRect(-cardWidth / 2, -cardHeight / 2, cardWidth, cardHeight, 14);
      bg.strokeRoundedRect(-cardWidth / 2, -cardHeight / 2, cardWidth, cardHeight, 14);
      card.add(bg);

      // Icon Box
      const iconBox = this.scene.add.graphics();
      iconBox.fillStyle(0x1E293B, 0.9);
      iconBox.fillRoundedRect(-cardWidth / 2 + 12, -cardHeight / 2 + 14, 42, 42, 10);
      card.add(iconBox);

      const iconText = this.scene.add.text(-cardWidth / 2 + 33, -cardHeight / 2 + 35, isClaimed ? '✅' : '🏆', {
        fontSize: '20px'
      }).setOrigin(0.5);
      card.add(iconText);

      // Title
      const title = this.scene.add.text(-cardWidth / 2 + 64, -cardHeight / 2 + 20, def.title, {
        fontFamily: 'Poppins, sans-serif',
        fontSize: '13px',
        fontStyle: 'bold',
        color: isClaimable ? '#FDE047' : isClaimed ? '#34D399' : '#FFFFFF'
      }).setOrigin(0, 0.5);
      card.add(title);

      // Description
      const desc = this.scene.add.text(-cardWidth / 2 + 64, -cardHeight / 2 + 38, def.description, {
        fontFamily: 'Poppins, sans-serif',
        fontSize: '10px',
        color: '#94A3B8',
        wordWrap: { width: 175 }
      }).setOrigin(0, 0.5);
      card.add(desc);

      // Progress Bar
      const barWidth = 160;
      const barHeight = 6;
      const barX = -cardWidth / 2 + 64;
      const barY = -cardHeight / 2 + 65;

      const pBg = this.scene.add.graphics();
      pBg.fillStyle(0x1E293B, 1);
      pBg.fillRoundedRect(barX, barY, barWidth, barHeight, 3);
      card.add(pBg);

      const pFill = this.scene.add.graphics();
      pFill.fillStyle(isClaimable ? 0xF59E0B : isClaimed ? 0x10B981 : 0x38BDF8, 1);
      pFill.fillRoundedRect(barX, barY, barWidth * progressFraction, barHeight, 3);
      card.add(pFill);

      const pText = this.scene.add.text(barX + barWidth + 8, barY + 3, `${state.progress}/${def.target}`, {
        fontFamily: 'Poppins, sans-serif',
        fontSize: '10px',
        fontStyle: 'bold',
        color: '#CBD5E1'
      }).setOrigin(0, 0.5);
      card.add(pText);

      // Right Action / Badge
      if (isClaimable) {
        const claimBtn = this.scene.add.container(cardWidth / 2 - 48, 0);
        card.add(claimBtn);

        const btnBg = this.scene.add.graphics();
        btnBg.fillStyle(0xF59E0B, 1);
        btnBg.fillRoundedRect(-40, -16, 80, 32, 10);
        btnBg.lineStyle(1.5, 0xFDE047, 1);
        btnBg.strokeRoundedRect(-40, -16, 80, 32, 10);
        claimBtn.add(btnBg);

        const label = this.scene.add.text(0, -1, def.rewardCoins > 0 ? `CLAIM 🪙` : `CLAIM 👑`, {
          fontFamily: 'Poppins, sans-serif',
          fontSize: '11px',
          fontStyle: 'bold',
          color: '#000000'
        }).setOrigin(0.5);
        claimBtn.add(label);

        claimBtn.setSize(80, 32);
        claimBtn.setInteractive({ useHandCursor: true });

        claimBtn.on('pointerdown', () => {
          AudioManager.getInstance().playCombo();
          const success = achievementManager.claimReward(def.id);
          if (success) {
            this.triggerGoldBurstAnimation(card.x + claimBtn.x, card.y + claimBtn.y, () => {
              if (this.onClaimCallback) this.onClaimCallback(def.rewardCoins);
              this.refreshCoins();
              this.renderAchievements();
            });
          }
        });
      } else if (isClaimed) {
        const badge = this.scene.add.text(cardWidth / 2 - 48, 0, 'CLAIMED ✓', {
          fontFamily: 'Poppins, sans-serif',
          fontSize: '11px',
          fontStyle: 'bold',
          color: '#34D399'
        }).setOrigin(0.5);
        card.add(badge);
      } else {
        const rewardText = this.scene.add.text(cardWidth / 2 - 48, 0, def.rewardCoins > 0 ? `+${def.rewardCoins} 🪙` : '👑 THEME', {
          fontFamily: 'Poppins, sans-serif',
          fontSize: '12px',
          fontStyle: 'bold',
          color: '#FDE047'
        }).setOrigin(0.5);
        card.add(rewardText);
      }
    });

    // Pagination Controls (if more than 1 page)
    if (totalPages > 1) {
      const pageControlY = 255;
      const pageControls = this.scene.add.container(0, pageControlY);
      this.listContainer.add(pageControls);

      // Prev Button
      if (this.currentPage > 0) {
        const prevBtn = this.scene.add.text(-60, 0, '◀ PREV', {
          fontFamily: 'Poppins, sans-serif',
          fontSize: '12px',
          fontStyle: 'bold',
          color: '#38BDF8'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        prevBtn.on('pointerdown', () => {
          AudioManager.getInstance().playButtonClick();
          this.currentPage--;
          this.renderAchievements();
        });
        pageControls.add(prevBtn);
      }

      // Page Number
      const pageLabel = this.scene.add.text(0, 0, `${this.currentPage + 1} / ${totalPages}`, {
        fontFamily: 'Poppins, sans-serif',
        fontSize: '12px',
        color: '#94A3B8'
      }).setOrigin(0.5);
      pageControls.add(pageLabel);

      // Next Button
      if (this.currentPage < totalPages - 1) {
        const nextBtn = this.scene.add.text(60, 0, 'NEXT ▶', {
          fontFamily: 'Poppins, sans-serif',
          fontSize: '12px',
          fontStyle: 'bold',
          color: '#38BDF8'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        nextBtn.on('pointerdown', () => {
          AudioManager.getInstance().playButtonClick();
          this.currentPage++;
          this.renderAchievements();
        });
        pageControls.add(nextBtn);
      }
    }
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

function panelHeight_half(): number {
  return 315;
}
