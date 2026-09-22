import Phaser from 'phaser';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../../constants/gameplay';
import { StatisticsManager } from '../../managers/StatisticsManager';
import { AudioManager } from '../../managers/AudioManager';
import { SaveManager } from '../../managers/SaveManager';

/**
 * STATISTICS MODAL
 * High-contrast, colorful dashboard for players with individual vibrant color themes for all 8 metrics:
 * - Highest Score: Gold (#EAB308)
 * - Best Move: Ruby Coral (#EF4444)
 * - Games Played: Royal Purple (#A855F7)
 * - Total Score: Electric Cyan (#06B6D4)
 * - Average Score: Emerald Green (#10B981)
 * - Lines Cleared: Vivid Sapphire (#3B82F6)
 * - Blocks Placed: Tangerine Orange (#F97316)
 * - Longest Combo: Hot Rose (#F43F5E)
 * Defined in Document 04 (Section 25) & Milestone 6.5.
 */
export class StatsModal extends Phaser.GameObjects.Container {
  private backdrop!: Phaser.GameObjects.Rectangle;
  private panel!: Phaser.GameObjects.Container;
  private onCloseCallback?: () => void;

  constructor(scene: Phaser.Scene, onClose?: () => void) {
    super(scene, 0, 0);
    this.onCloseCallback = onClose;

    this.createModal();
    scene.add.existing(this);
    this.setDepth(100);

    this.animateOpen();
  }

  private createModal() {
    const width = this.scene.scale.width || CANVAS_WIDTH;
    const height = this.scene.scale.height || CANVAS_HEIGHT;
    const stats = StatisticsManager.getInstance().getStats();
    const audioManager = AudioManager.getInstance();

    // 1. Semi-transparent click blocker
    this.backdrop = this.scene.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.75);
    this.backdrop.setInteractive();
    this.backdrop.on('pointerdown', () => this.close());
    this.add(this.backdrop);

    // 2. Center Panel Container
    this.panel = this.scene.add.container(width / 2, height / 2);
    this.add(this.panel);

    const panelWidth = 384;
    const panelHeight = 540;

    const bg = this.scene.add.graphics();
    // Drop shadow
    bg.fillStyle(0x000000, 0.6);
    bg.fillRoundedRect(-panelWidth / 2, -panelHeight / 2 + 6, panelWidth, panelHeight, 24);

    // Panel body
    bg.fillStyle(0x1E293B, 0.96);
    bg.fillRoundedRect(-panelWidth / 2, -panelHeight / 2, panelWidth, panelHeight, 24);

    // Cyan/Gold Bezel
    bg.lineStyle(2, 0x06B6D4, 0.85);
    bg.strokeRoundedRect(-panelWidth / 2, -panelHeight / 2, panelWidth, panelHeight, 24);

    // Top Gloss
    bg.fillStyle(0xffffff, 0.08);
    bg.fillRoundedRect(-panelWidth / 2 + 2, -panelHeight / 2 + 2, panelWidth - 4, 38, 22);
    this.panel.add(bg);

    // Header Title
    const title = this.scene.add.text(0, -panelHeight / 2 + 36, '📊  STATISTICS', {
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

    // 8 Colorful Stat Cards
    const statItems = [
      { label: 'HIGHEST SCORE', value: stats.highestScore.toLocaleString(), icon: '🏆', color: 0xEAB308, textColor: '#FDE047' },
      { label: 'BEST MOVE', value: `+${(stats.bestSingleMoveScore || 0).toLocaleString()} pts`, icon: '💥', color: 0xEF4444, textColor: '#FCA5A5' },
      { label: 'GAMES PLAYED', value: stats.gamesPlayed.toLocaleString(), icon: '🎮', color: 0xA855F7, textColor: '#E9D5FF' },
      { label: 'TOTAL SCORE', value: stats.totalScore.toLocaleString(), icon: '⚡', color: 0x06B6D4, textColor: '#A5F3FC' },
      { label: 'AVERAGE SCORE', value: stats.averageScore.toLocaleString(), icon: '🎯', color: 0x10B981, textColor: '#A7F3D0' },
      { label: 'LINES CLEARED', value: stats.linesCleared.toLocaleString(), icon: '🧹', color: 0x3B82F6, textColor: '#BFDBFE' },
      { label: 'BLOCKS PLACED', value: stats.blocksPlaced.toLocaleString(), icon: '🧱', color: 0xF97316, textColor: '#FED7AA' },
      { label: 'LONGEST COMBO', value: stats.longestCombo > 1 ? `x${stats.longestCombo}` : 'None', icon: '🔥', color: 0xF43F5E, textColor: '#FECDD3' }
    ];

    const startY = -panelHeight / 2 + 80;
    const itemHeight = 47;
    const itemWidth = panelWidth - 36;

    statItems.forEach((item, index) => {
      const y = startY + index * (itemHeight + 6);

      const card = this.scene.add.graphics();
      // Card body with subtle color tint
      card.fillStyle(item.color, 0.18);
      card.fillRoundedRect(-itemWidth / 2, y, itemWidth, itemHeight, 12);

      // Left colorful accent pill bar
      card.fillStyle(item.color, 1);
      card.fillRoundedRect(-itemWidth / 2, y, 6, itemHeight, { tl: 12, bl: 12, tr: 0, br: 0 });

      // Border
      card.lineStyle(1.5, item.color, 0.55);
      card.strokeRoundedRect(-itemWidth / 2, y, itemWidth, itemHeight, 12);
      this.panel.add(card);

      // Icon & Label
      const labelText = this.scene.add.text(-itemWidth / 2 + 20, y + itemHeight / 2, `${item.icon}  ${item.label}`, {
        fontFamily: 'Poppins, sans-serif',
        fontSize: '12px',
        fontStyle: 'bold',
        color: '#E2E8F0'
      }).setOrigin(0, 0.5);
      this.panel.add(labelText);

      // Value
      const valText = this.scene.add.text(itemWidth / 2 - 16, y + itemHeight / 2, item.value, {
        fontFamily: 'Poppins, sans-serif',
        fontSize: '16px',
        fontStyle: 'bold',
        color: item.textColor
      }).setOrigin(1, 0.5);
      this.panel.add(valText);
    });

    // Playtime & Lifetime Economy Footer Badge
    const saveManager = SaveManager.getInstance();
    const meta = saveManager.getMetadata();
    const formatPlayTime = (sec: number) => {
      const hours = Math.floor(sec / 3600);
      const minutes = Math.floor((sec % 3600) / 60);
      if (hours > 0) return `${hours}h ${minutes}m`;
      return `${Math.max(1, minutes)}m`;
    };

    const footerText = this.scene.add.text(
      0,
      panelHeight / 2 - 24,
      `⏱️ ${formatPlayTime(meta.totalPlayTime)}   🪙 ${meta.totalCoinsEarned.toLocaleString()} Total   🎬 ${meta.adsWatched} Ads`,
      {
        fontFamily: 'Poppins, sans-serif',
        fontSize: '11px',
        fontStyle: 'bold',
        color: '#94A3B8'
      }
    ).setOrigin(0.5);
    this.panel.add(footerText);
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
