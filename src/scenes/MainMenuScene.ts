import Phaser from 'phaser';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../constants/gameplay';
import { ThemeManager } from '../managers/ThemeManager';
import { SaveManager } from '../managers/SaveManager';
import { AudioManager } from '../managers/AudioManager';
import { DailyRewardManager } from '../managers/DailyRewardManager';
import { MissionManager } from '../managers/MissionManager';
import { AchievementManager } from '../managers/AchievementManager';
import { AmbientParticles } from '../ui/components/AmbientParticles';
import { ThemesModal } from '../ui/modals/ThemesModal';
import { StatsModal } from '../ui/modals/StatsModal';
import { SettingsModal } from '../ui/modals/SettingsModal';
import { DailyRewardModal } from '../ui/modals/DailyRewardModal';
import { MissionsModal } from '../ui/modals/MissionsModal';
import { AchievementsModal } from '../ui/modals/AchievementsModal';
import { AdManager } from '../managers/AdManager';
import { BannerAd } from '../ui/components/BannerAd';

/**
 * MAIN MENU SCENE
 * High-energy, colorful Block Blast-inspired home hub featuring 3D cartoon puffy logo,
 * gold crown, ambient drifting particles, hero score cards, vibrant progression action hub,
 * rewarded ads for free coins, and live notification badges for Daily Rewards, Missions, and Achievements.
 * Defined in Document 04 (Section 6) & Milestone 9.
 */
export class MainMenuScene extends Phaser.Scene {
  private static hasPromptedDailySession: boolean = false;
  private coinText!: Phaser.GameObjects.Text;
  private adBtnText?: Phaser.GameObjects.Text;
  private missionBadge?: Phaser.GameObjects.Container;
  private achievementBadge?: Phaser.GameObjects.Container;
  private dailyBadge?: Phaser.GameObjects.Container;

  constructor() {
    super('MainMenuScene');
  }

  create() {
    const width = this.scale.width || CANVAS_WIDTH;
    const height = this.scale.height || CANVAS_HEIGHT;
    const theme = ThemeManager.getInstance().getActiveColors();
    const saveManager = SaveManager.getInstance();
    const audioManager = AudioManager.getInstance();
    const dailyRewardManager = DailyRewardManager.getInstance();
    const adManager = AdManager.getInstance();

    // Camera transition: Fast 200ms Fade-In
    this.cameras.main.fadeIn(200, 0, 0, 0);

    // Set Menu Ambient Atmosphere (Warm bass pad + soft arcade synth + light sparkle bells)
    audioManager.setAudioState('menu');

    // 0. Top In-Game Sponsored Banner Bar
    new BannerAd(this, width / 2, 22);

    // 1. Dynamic Vibrant Background with Top/Bottom Gradient Depth (Cohesive Royal Sapphire to Deep Navy)
    const bgGraphics = this.add.graphics();
    const bgTop = Phaser.Display.Color.HexStringToColor(theme.background).color; // 0x223BBE
    const bgBottom = 0x172554; // Deep Royal Navy (Interconnected)
    bgGraphics.fillGradientStyle(bgTop, bgTop, bgBottom, bgBottom, 1);
    bgGraphics.fillRect(0, 0, width, height);

    // 2. Ambient Multi-Color Floating Particles & Sparkles
    new AmbientParticles(this, 28, true);

    // 3. Floating Subtle Polyomino Gems in Background (Adds physical toy feeling)
    this.createFloatingBackgroundGems(width, height);

    // 4. 3D Colorful Puffy Logo Container
    const logoContainer = this.add.container(width / 2, 100);

    // Crown
    const crown = this.add.text(0, -34, '👑', {
      fontSize: '28px'
    }).setOrigin(0.5);
    logoContainer.add(crown);

    const letters = [
      { char: 'B', color: '#FB923C' }, // Orange
      { char: 'L', color: '#38BDF8' }, // Cyan
      { char: 'O', color: '#EF4444' }, // Red
      { char: 'C', color: '#FBBF24' }, // Yellow
      { char: 'K', color: '#C084FC' }, // Purple
      { char: 'Z', color: '#34D399' }, // Emerald
      { char: 'U', color: '#F472B6' }  // Pink
    ];

    const startX = -120;
    const charSpacing = 40;

    letters.forEach((item, idx) => {
      const charX = startX + idx * charSpacing;
      // Drop Shadow
      const shadow = this.add.text(charX + 2, 4, item.char, {
        fontFamily: 'Poppins, sans-serif',
        fontSize: '40px',
        fontStyle: 'bold',
        color: '#070A14'
      }).setOrigin(0.5);
      logoContainer.add(shadow);

      // Main Letter with crisp white outline
      const letter = this.add.text(charX, 0, item.char, {
        fontFamily: 'Poppins, sans-serif',
        fontSize: '40px',
        fontStyle: 'bold',
        color: item.color,
        stroke: '#FFFFFF',
        strokeThickness: 3.5
      }).setOrigin(0.5);
      logoContainer.add(letter);
    });

    // Subtitle Badge
    const subBadge = this.add.text(0, 34, '⚡ PUZZLE MASTER ⚡', {
      fontFamily: 'Poppins, sans-serif',
      fontSize: '10px',
      fontStyle: 'bold',
      color: '#93C5FD',
      letterSpacing: 2
    }).setOrigin(0.5);
    logoContainer.add(subBadge);

    // Gentle logo breathing animation
    this.tweens.add({
      targets: logoContainer,
      scale: 1.03,
      duration: 900,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // 5. Top Status Bar: Live Coins Pill (Left) & Rewarded Free Coins Ad Pill (Right)
    const pillY = 176;

    // A. Coins Pill (Left)
    const coinContainer = this.add.container(width / 2 - 76, pillY);
    const coinBg = this.add.graphics();
    coinBg.fillStyle(0x000000, 0.35);
    coinBg.fillRoundedRect(-62, -14, 124, 28, 14);
    coinBg.fillStyle(0x172554, 0.95);
    coinBg.lineStyle(1.5, 0xF59E0B, 0.85); // Gold outline
    coinBg.fillRoundedRect(-62, -16, 124, 28, 14);
    coinBg.strokeRoundedRect(-62, -16, 124, 28, 14);
    coinContainer.add(coinBg);

    this.coinText = this.add.text(0, -2, `🪙 ${saveManager.getCoins().toLocaleString()}`, {
      fontFamily: 'Poppins, sans-serif',
      fontSize: '13px',
      fontStyle: 'bold',
      color: '#FDE047'
    }).setOrigin(0.5);
    coinContainer.add(this.coinText);

    // B. Free Coins Video Ad Pill (Right)
    const adContainer = this.add.container(width / 2 + 76, pillY);
    const adBg = this.add.graphics();
    adBg.fillStyle(0x000000, 0.35);
    adBg.fillRoundedRect(-62, -14, 124, 28, 14);
    adBg.fillStyle(0x172554, 0.95);
    adBg.lineStyle(1.5, 0x38BDF8, 0.85); // Cyan outline
    adBg.fillRoundedRect(-62, -16, 124, 28, 14);
    adBg.strokeRoundedRect(-62, -16, 124, 28, 14);
    adContainer.add(adBg);

    const remainingAds = adManager.getRemainingRewardedCoinsAds();
    this.adBtnText = this.add.text(0, -2, `🎬 +50 🪙 (${remainingAds}/5)`, {
      fontFamily: 'Poppins, sans-serif',
      fontSize: '11px',
      fontStyle: 'bold',
      color: remainingAds > 0 ? '#38BDF8' : '#64748B'
    }).setOrigin(0.5);
    adContainer.add(this.adBtnText);

    adContainer.setSize(124, 28);
    adContainer.setInteractive({ useHandCursor: true });
    adContainer.on('pointerdown', () => {
      audioManager.playButtonClick();
      if (adManager.canWatchRewardedAd()) {
        adManager.showRewardedAd(this, 'coins', (rewarded) => {
          if (rewarded) {
            this.refreshCoins();
            this.updateBadges();
            const left = adManager.getRemainingRewardedCoinsAds();
            this.adBtnText?.setText(`🎬 +50 🪙 (${left}/5)`);
          }
        });
      }
    });

    // 6. Best Score Hero Card (Elevated Glassmorphism with Glowing Gold Accents)
    const cardY = 270;
    const cardWidth = 316;
    const cardHeight = 96;

    const bestCard = this.add.graphics();
    // Drop Shadow
    bestCard.fillStyle(0x000000, 0.45);
    bestCard.fillRoundedRect(width / 2 - cardWidth / 2, cardY - cardHeight / 2 + 5, cardWidth, cardHeight, 20);

    // Glass Body (Deep Royal Navy)
    bestCard.fillStyle(0x172554, 0.95);
    bestCard.fillRoundedRect(width / 2 - cardWidth / 2, cardY - cardHeight / 2, cardWidth, cardHeight, 20);

    // Gold Bezel Border
    bestCard.lineStyle(2, 0xF59E0B, 0.85);
    bestCard.strokeRoundedRect(width / 2 - cardWidth / 2, cardY - cardHeight / 2, cardWidth, cardHeight, 20);

    // Top Gloss
    bestCard.fillStyle(0xffffff, 0.12);
    bestCard.fillRoundedRect(width / 2 - cardWidth / 2 + 2, cardY - cardHeight / 2 + 2, cardWidth - 4, 30, 18);

    this.add.text(width / 2, cardY - 22, '👑 BEST SCORE', {
      fontFamily: 'Poppins, sans-serif',
      fontSize: '13px',
      fontStyle: 'bold',
      color: '#F59E0B'
    }).setOrigin(0.5);

    const scoreNum = this.add.text(width / 2, cardY + 14, `${saveManager.getBestScore().toLocaleString()}`, {
      fontFamily: 'Poppins, sans-serif',
      fontSize: '36px',
      fontStyle: 'bold',
      color: '#FFFFFF'
    }).setOrigin(0.5);

    // Subtle breathing on score
    this.tweens.add({
      targets: scoreNum,
      scale: 1.04,
      duration: 1200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // 7. Progression Retention Action Row: [ 🎁 Daily | 🎯 Missions | 🏆 Badges ]
    const progY = 372;
    const progBtnWidth = 98;
    const progBtnHeight = 50;

    // Daily Reward Button (Emerald Green #059669 / #10B981)
    const dailyBtn = this.createColorfulButton(
      width / 2 - 108,
      progY,
      progBtnWidth,
      progBtnHeight,
      '🎁 Daily',
      0x059669,
      0x34D399,
      '#FFFFFF',
      () => {
        audioManager.playButtonClick();
        new DailyRewardModal(this, () => {
          this.refreshCoins();
          this.updateBadges();
        }, () => {
          this.refreshCoins();
          this.updateBadges();
        });
      }
    );
    this.dailyBadge = this.createNotificationBadge(dailyBtn, progBtnWidth / 2 - 4, -progBtnHeight / 2 + 4);

    // Missions Button (Vivid Amber #D97706 / #F59E0B)
    const missionBtn = this.createColorfulButton(
      width / 2,
      progY,
      progBtnWidth,
      progBtnHeight,
      '🎯 Quests',
      0xD97706,
      0xFBBF24,
      '#FFFFFF',
      () => {
        audioManager.playButtonClick();
        new MissionsModal(this, () => {
          this.refreshCoins();
          this.updateBadges();
        }, () => {
          this.refreshCoins();
          this.updateBadges();
        });
      }
    );
    this.missionBadge = this.createNotificationBadge(missionBtn, progBtnWidth / 2 - 4, -progBtnHeight / 2 + 4);

    // Badges / Achievements Button (Deep Violet #7C3AED / #A78BFA)
    const achBtn = this.createColorfulButton(
      width / 2 + 108,
      progY,
      progBtnWidth,
      progBtnHeight,
      '🏆 Badges',
      0x7C3AED,
      0xC084FC,
      '#FFFFFF',
      () => {
        audioManager.playButtonClick();
        new AchievementsModal(this, () => {
          this.refreshCoins();
          this.updateBadges();
        }, () => {
          this.refreshCoins();
          this.updateBadges();
        });
      }
    );
    this.achievementBadge = this.createNotificationBadge(achBtn, progBtnWidth / 2 - 4, -progBtnHeight / 2 + 4);

    // Update badges visibility
    this.updateBadges();

    // 8. PLAY NOW Button (Primary CTA with glossy sheen, pulsing scale, & traveling light glint)
    const playBtn = this.add.container(width / 2, 478);
    const playBg = this.add.graphics();

    // Shadow
    playBg.fillStyle(0x000000, 0.5);
    playBg.fillRoundedRect(-144, -30, 288, 64, 22);

    // Outer Glow Ring
    playBg.lineStyle(3, 0x38BDF8, 0.75);
    playBg.strokeRoundedRect(-144, -32, 288, 64, 22);

    // Button body (Vibrant Royal Blue Gradient)
    playBg.fillStyle(0x2563EB, 1);
    playBg.fillRoundedRect(-144, -32, 288, 64, 22);

    // Gloss top shine
    playBg.fillStyle(0xffffff, 0.32);
    playBg.fillRoundedRect(-140, -30, 280, 26, 18);
    playBtn.add(playBg);

    const playText = this.add.text(0, 0, '▶  PLAY NOW', {
      fontFamily: 'Poppins, sans-serif',
      fontSize: '22px',
      fontStyle: 'bold',
      color: '#FFFFFF'
    }).setOrigin(0.5);
    playBtn.add(playText);

    // Glint Light Sweep across Play Button
    const glint = this.add.graphics();
    glint.fillStyle(0xffffff, 0.45);
    glint.fillRoundedRect(-15, -32, 30, 64, 8);
    glint.setAlpha(0);
    playBtn.add(glint);

    this.time.addEvent({
      delay: 3200,
      loop: true,
      callback: () => {
        glint.x = -160;
        glint.setAlpha(0.6);
        this.tweens.add({
          targets: glint,
          x: 160,
          alpha: 0,
          duration: 650,
          ease: 'Quad.easeOut'
        });
      }
    });

    playBtn.setSize(288, 64);
    playBtn.setInteractive({ useHandCursor: true });

    this.tweens.add({
      targets: playBtn,
      scale: 1.04,
      duration: 750,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    playBtn.on('pointerdown', () => {
      audioManager.playButtonClick();
      this.tweens.add({
        targets: playBtn,
        scale: 0.93,
        duration: 70,
        yoyo: true,
        onComplete: () => {
          this.cameras.main.fadeOut(200, 0, 0, 0);
          this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('GameScene');
          });
        }
      });
    });

    // 9. Utility Action Row: [ 🎨 Themes | 📊 Stats | ⚙️ Settings ]
    const btnY = 585;
    const btnWidth = 98;
    const btnHeight = 46;

    // Themes (Vibrant Indigo #6366F1)
    this.createColorfulButton(width / 2 - 108, btnY, btnWidth, btnHeight, '🎨 Themes', 0x6366F1, 0x818CF8, '#FFFFFF', () => {
      audioManager.playButtonClick();
      new ThemesModal(this, () => {
        this.refreshCoins();
        this.updateBadges();
      }, () => {
        this.scene.restart();
      });
    });

    // Stats (Vivid Cyan #0284C7)
    this.createColorfulButton(width / 2, btnY, btnWidth, btnHeight, '📊 Stats', 0x0284C7, 0x38BDF8, '#FFFFFF', () => {
      audioManager.playButtonClick();
      new StatsModal(this);
    });

    // Settings (Slate / Neutral #475569)
    this.createColorfulButton(width / 2 + 108, btnY, btnWidth, btnHeight, '⚙️ Settings', 0x475569, 0x94A3B8, '#FFFFFF', () => {
      audioManager.playButtonClick();
      new SettingsModal(this, () => {
        this.refreshCoins();
        this.updateBadges();
      }, () => {
        this.scene.restart();
      });
    });

    // 10. Auto-Prompt Daily Reward if available on session boot
    if (dailyRewardManager.isRewardAvailable() && !MainMenuScene.hasPromptedDailySession) {
      MainMenuScene.hasPromptedDailySession = true;
      this.time.delayedCall(450, () => {
        new DailyRewardModal(this, () => {
          this.refreshCoins();
          this.updateBadges();
        }, () => {
          this.refreshCoins();
          this.updateBadges();
        });
      });
    }
  }

  /**
   * Update notification badge indicators for Daily Reward, Missions, and Achievements.
   */
  private updateBadges() {
    const dailyAvailable = DailyRewardManager.getInstance().isRewardAvailable();
    const missionAvailable = MissionManager.getInstance().hasUnclaimedMissions();
    const achAvailable = AchievementManager.getInstance().hasUnclaimedAchievements();

    if (this.dailyBadge) {
      this.dailyBadge.setVisible(dailyAvailable);
    }
    if (this.missionBadge) {
      this.missionBadge.setVisible(missionAvailable);
    }
    if (this.achievementBadge) {
      this.achievementBadge.setVisible(achAvailable);
    }
  }

  /**
   * Creates a notification dot badge with a pulsing animation.
   */
  private createNotificationBadge(parent: Phaser.GameObjects.Container, x: number, y: number): Phaser.GameObjects.Container {
    const badge = this.add.container(x, y);

    const glow = this.add.graphics();
    glow.fillStyle(0xEF4444, 0.4);
    glow.fillCircle(0, 0, 11);
    badge.add(glow);

    const dot = this.add.graphics();
    dot.fillStyle(0xEF4444, 1);
    dot.lineStyle(1.5, 0xFFFFFF, 1);
    dot.fillCircle(0, 0, 7);
    dot.strokeCircle(0, 0, 7);
    badge.add(dot);

    const exclamation = this.add.text(0, -0.5, '!', {
      fontFamily: 'Poppins, sans-serif',
      fontSize: '9px',
      fontStyle: 'bold',
      color: '#FFFFFF'
    }).setOrigin(0.5);
    badge.add(exclamation);

    parent.add(badge);

    // Pulse animation
    this.tweens.add({
      targets: glow,
      scale: 1.4,
      alpha: 0.1,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    return badge;
  }

  /**
   * Drifting soft colorful block jewels in the background.
   */
  private createFloatingBackgroundGems(width: number, height: number) {
    const gemColors = [0xEF4444, 0x38BDF8, 0xFACC15, 0x34D399, 0xC084FC];
    for (let i = 0; i < 6; i++) {
      const g = this.add.graphics();
      const col = gemColors[i % gemColors.length];
      const size = Phaser.Math.Between(18, 28);
      g.fillStyle(col, 0.12);
      g.fillRoundedRect(-size / 2, -size / 2, size, size, 6);
      g.lineStyle(1.5, col, 0.25);
      g.strokeRoundedRect(-size / 2, -size / 2, size, size, 6);

      g.x = Phaser.Math.Between(30, width - 30);
      g.y = Phaser.Math.Between(50, height - 50);

      this.tweens.add({
        targets: g,
        y: g.y - Phaser.Math.Between(30, 60),
        angle: Phaser.Math.Between(-30, 30),
        duration: Phaser.Math.Between(3000, 6000),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }
  }

  private refreshCoins() {
    const saveManager = SaveManager.getInstance();
    if (this.coinText) {
      this.coinText.setText(`🪙 ${saveManager.getCoins().toLocaleString()}`);
    }
  }

  private createColorfulButton(
    x: number,
    y: number,
    width: number,
    height: number,
    label: string,
    bgColor: number,
    borderColor: number,
    textColor: string,
    onClick: () => void
  ): Phaser.GameObjects.Container {
    const container = this.add.container(x, y);

    const bg = this.add.graphics();
    // Shadow
    bg.fillStyle(0x000000, 0.4);
    bg.fillRoundedRect(-width / 2, -height / 2 + 4, width, height, 16);

    // Body
    bg.fillStyle(bgColor, 1);
    bg.fillRoundedRect(-width / 2, -height / 2, width, height, 16);

    // Border Glow
    bg.lineStyle(1.5, borderColor, 0.85);
    bg.strokeRoundedRect(-width / 2, -height / 2, width, height, 16);

    // Gloss
    bg.fillStyle(0xffffff, 0.26);
    bg.fillRoundedRect(-width / 2 + 3, -height / 2 + 2, width - 6, height * 0.45, 12);
    container.add(bg);

    const text = this.add.text(0, 0, label, {
      fontFamily: 'Poppins, sans-serif',
      fontSize: '12px',
      fontStyle: 'bold',
      color: textColor
    }).setOrigin(0.5);
    container.add(text);

    container.setSize(width, height);
    container.setInteractive({ useHandCursor: true });

    container.on('pointerdown', () => {
      this.tweens.add({
        targets: container,
        scale: 0.93,
        duration: 70,
        yoyo: true,
        onComplete: onClick
      });
    });

    return container;
  }
}

