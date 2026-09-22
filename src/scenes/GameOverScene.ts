import Phaser from 'phaser';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../constants/gameplay';
import { ThemeManager } from '../managers/ThemeManager';
import { ScoreManager } from '../managers/ScoreManager';
import { SaveManager } from '../managers/SaveManager';
import { AudioManager } from '../managers/AudioManager';
import { AchievementManager } from '../managers/AchievementManager';
import { MissionManager } from '../managers/MissionManager';
import { AdManager } from '../managers/AdManager';
import { AnalyticsManager } from '../managers/AnalyticsManager';
import { SessionStats } from '../systems/GameFlowSystem';
import { AmbientParticles } from '../ui/components/AmbientParticles';

export interface GameOverData extends SessionStats {
  hasRevived?: boolean;
}

/**
 * GAME OVER SCENE
 * Celebratory screen with odometer score counter, falling confetti,
 * rewarded revive flow (1 continue/match), interstitial triggers, and instant replay.
 * Defined in Document 04 & Document 06 (Monetization).
 */
export class GameOverScene extends Phaser.Scene {
  private sessionStats?: GameOverData;
  private animatedScoreText!: Phaser.GameObjects.Text;

  constructor() {
    super('GameOverScene');
  }

  init(data: GameOverData) {
    this.sessionStats = data;
  }

  create() {
    const width = this.scale.width || CANVAS_WIDTH;
    const height = this.scale.height || CANVAS_HEIGHT;
    const theme = ThemeManager.getInstance().getActiveColors();
    const scoreManager = ScoreManager.getInstance();
    const saveManager = SaveManager.getInstance();
    const audioManager = AudioManager.getInstance();
    const adManager = AdManager.getInstance();

    const finalScore = this.sessionStats?.score ?? scoreManager.getCurrentScore();
    const bestScore = saveManager.getBestScore();
    const linesCleared = this.sessionStats?.linesCleared ?? 0;
    const maxCombo = this.sessionStats?.maxCombo ?? 0;
    const alreadyRevived = !!this.sessionStats?.hasRevived;

    // Economy: Match Completion Coin Bounty (+10 Coins)
    saveManager.addCoins(10);

    // Progression: Match Completion Achievements & Missions
    AchievementManager.getInstance().updateProgress('first_game', 1);
    AchievementManager.getInstance().updateProgress('play_10_games', 1, true);
    AchievementManager.getInstance().updateProgress('play_25_games', 1, true);
    AchievementManager.getInstance().updateProgress('play_50_games', 1, true);
    AchievementManager.getInstance().updateProgress('play_100_games', 1, true);
    AchievementManager.getInstance().updateProgress('play_250_games', 1, true);
    MissionManager.getInstance().reportProgress('games', 1, true);

    // Monetization: Check interstitial ad trigger (every 4th match, 3m cooldown)
    adManager.handleMatchFinished(this);

    // Camera transition: Fast 200ms Fade-In
    this.cameras.main.fadeIn(200, 0, 0, 0);

    // Audio: 1s descending bell cue, then silence
    audioManager.setAudioState('gameover');
    audioManager.playGameOver();

    // 1. Dynamic Vibrant Gradient Background (Cohesive Royal Sapphire to Deep Navy)
    const bgGraphics = this.add.graphics();
    const bgTop = Phaser.Display.Color.HexStringToColor(theme.background).color; // 0x223BBE
    const bgBottom = 0x172554; // Deep Royal Navy
    bgGraphics.fillGradientStyle(bgTop, bgTop, bgBottom, bgBottom, 1);
    bgGraphics.fillRect(0, 0, width, height);

    // 2. Ambient Colorful Floating Particles & Falling Confetti
    new AmbientParticles(this, 24, true);
    this.createFallingConfetti(width, height);

    // 3. Title Banner: 3D Colorful Puffy Text
    const titleContainer = this.add.container(width / 2, 105);

    // Crown / Trophy Icon
    const trophy = this.add.text(0, -38, finalScore >= bestScore && finalScore > 0 ? '👑' : '🏁', {
      fontSize: '36px'
    }).setOrigin(0.5);
    titleContainer.add(trophy);

    const titleShadow = this.add.text(2, 4, 'GAME OVER', {
      fontFamily: 'Poppins, sans-serif',
      fontSize: '38px',
      fontStyle: 'bold',
      color: '#070A14'
    }).setOrigin(0.5);
    titleContainer.add(titleShadow);

    const titleText = this.add.text(0, 0, 'GAME OVER', {
      fontFamily: 'Poppins, sans-serif',
      fontSize: '38px',
      fontStyle: 'bold',
      color: '#F43F5E', // Coral Red
      stroke: '#FFFFFF',
      strokeThickness: 3.5
    }).setOrigin(0.5);
    titleContainer.add(titleText);

    // 4. Score Summary Card (Elevated Glass with Gold/Sapphire Accent)
    const card = this.add.graphics();
    // Drop Shadow
    card.fillStyle(0x000000, 0.45);
    card.fillRoundedRect(width / 2 - 165, 175, 330, 224, 24);

    // Card Body (Translucent Deep Royal Indigo)
    card.fillStyle(0x172554, 0.95);
    card.fillRoundedRect(width / 2 - 165, 170, 330, 224, 24);

    // Gold Bezel
    card.lineStyle(2, 0xF59E0B, 0.9);
    card.strokeRoundedRect(width / 2 - 165, 170, 330, 224, 24);

    // Top Gloss
    card.fillStyle(0xffffff, 0.12);
    card.fillRoundedRect(width / 2 - 163, 172, 326, 40, 22);

    this.add.text(width / 2, 198, 'FINAL SCORE', {
      fontFamily: 'Poppins, sans-serif',
      fontSize: '14px',
      fontStyle: 'bold',
      color: '#93C5FD'
    }).setOrigin(0.5);

    // Animated Score Counter (0 -> Final Score)
    this.animatedScoreText = this.add.text(width / 2, 246, '0', {
      fontFamily: 'Poppins, sans-serif',
      fontSize: '52px',
      fontStyle: 'bold',
      color: '#FACC15' // Brilliant Gold
    }).setOrigin(0.5);

    this.animateScoreCounter(finalScore);

    // Best Score Subtitle
    const isNewBest = finalScore >= bestScore && finalScore > 0;
    this.add.text(width / 2, 302, isNewBest ? '🎉 NEW BEST SCORE! 🎉' : `👑 BEST: ${bestScore.toLocaleString()}`, {
      fontFamily: 'Poppins, sans-serif',
      fontSize: '15px',
      fontStyle: 'bold',
      color: isNewBest ? '#34D399' : '#F59E0B'
    }).setOrigin(0.5);

    if (isNewBest) {
      this.triggerNewBestCelebration(width / 2, 302);
    }

    // Match Metrics Pill
    const metricPill = this.add.graphics();
    metricPill.fillStyle(0x1E3A8A, 0.75);
    metricPill.lineStyle(1, 0x38BDF8, 0.5);
    metricPill.fillRoundedRect(width / 2 - 145, 334, 290, 44, 12);
    metricPill.strokeRoundedRect(width / 2 - 145, 334, 290, 44, 12);

    this.add.text(width / 2, 347, `🧹 Lines: ${linesCleared}    🔥 Combo: ${maxCombo > 1 ? `x${maxCombo}` : '1'}`, {
      fontFamily: 'Poppins, sans-serif',
      fontSize: '12px',
      fontStyle: 'bold',
      color: '#FFFFFF'
    }).setOrigin(0.5);

    this.add.text(width / 2, 365, `🎁 Match Reward: +10 🪙 Added!`, {
      fontFamily: 'Poppins, sans-serif',
      fontSize: '11px',
      fontStyle: 'bold',
      color: '#FDE047'
    }).setOrigin(0.5);

    // 5. REVIVE / CONTINUE BUTTON (Glowing Emerald Green or Disabled State)
    const reviveBtn = this.add.container(width / 2, 435);
    const reviveBg = this.add.graphics();
    reviveBtn.add(reviveBg);

    if (!alreadyRevived) {
      // Active Revive Available
      reviveBg.fillStyle(0x000000, 0.45);
      reviveBg.fillRoundedRect(-144, -28, 288, 58, 20);

      reviveBg.lineStyle(2, 0x34D399, 0.9);
      reviveBg.strokeRoundedRect(-144, -30, 288, 58, 20);

      reviveBg.fillStyle(0x10b981, 1);
      reviveBg.fillRoundedRect(-144, -30, 288, 58, 20);

      reviveBg.fillStyle(0xffffff, 0.28);
      reviveBg.fillRoundedRect(-140, -28, 280, 24, 16);

      const reviveText = this.add.text(0, -1, '📺  CONTINUE (REVIVE)', {
        fontFamily: 'Poppins, sans-serif',
        fontSize: '16px',
        fontStyle: 'bold',
        color: '#FFFFFF'
      }).setOrigin(0.5);
      reviveBtn.add(reviveText);

      reviveBtn.setSize(288, 58);
      reviveBtn.setInteractive({ useHandCursor: true });

      this.tweens.add({
        targets: reviveBtn,
        scale: 1.03,
        duration: 800,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });

      reviveBtn.on('pointerdown', () => {
        audioManager.playButtonClick();
        adManager.showRewardedAd(this, 'revive', (rewarded) => {
          if (rewarded) {
            AnalyticsManager.getInstance().recordReviveUsed();
            this.scene.start('GameScene', {
              isRevive: true,
              priorScore: finalScore,
              linesCleared,
              maxCombo
            });
          }
        });
      });
    } else {
      // Revive Already Used (Disabled)
      reviveBg.fillStyle(0x0F172A, 0.6);
      reviveBg.fillRoundedRect(-144, -28, 288, 58, 20);
      reviveBg.lineStyle(1.5, 0x334155, 0.8);
      reviveBg.strokeRoundedRect(-144, -28, 288, 58, 20);

      const usedText = this.add.text(0, -1, '🔒  REVIVE USED (1 / MATCH)', {
        fontFamily: 'Poppins, sans-serif',
        fontSize: '14px',
        fontStyle: 'bold',
        color: '#64748B'
      }).setOrigin(0.5);
      reviveBtn.add(usedText);
    }

    // 6. PLAY AGAIN Button (Vibrant Royal Blue)
    const playAgainBtn = this.add.container(width / 2, 510);
    const playBg = this.add.graphics();
    playBg.fillStyle(0x000000, 0.4);
    playBg.fillRoundedRect(-144, -26, 288, 54, 18);

    playBg.lineStyle(2, 0x38BDF8, 0.9);
    playBg.strokeRoundedRect(-144, -28, 288, 54, 18);

    playBg.fillStyle(0x2563EB, 1);
    playBg.fillRoundedRect(-144, -28, 288, 54, 18);

    playBg.fillStyle(0xffffff, 0.26);
    playBg.fillRoundedRect(-140, -26, 280, 22, 14);
    playAgainBtn.add(playBg);

    const playText = this.add.text(0, -1, '🔄  PLAY AGAIN', {
      fontFamily: 'Poppins, sans-serif',
      fontSize: '17px',
      fontStyle: 'bold',
      color: '#FFFFFF'
    }).setOrigin(0.5);
    playAgainBtn.add(playText);

    playAgainBtn.setSize(288, 54);
    playAgainBtn.setInteractive({ useHandCursor: true });

    playAgainBtn.on('pointerdown', () => {
      audioManager.playButtonClick();
      this.tweens.add({
        targets: playAgainBtn,
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

    // 7. MAIN MENU Button (Royal Violet)
    const menuBtn = this.add.container(width / 2, 580);
    const menuBg = this.add.graphics();
    menuBg.fillStyle(0x000000, 0.35);
    menuBg.fillRoundedRect(-144, -22, 288, 48, 16);

    menuBg.lineStyle(1.5, 0xC084FC, 0.85);
    menuBg.strokeRoundedRect(-144, -24, 288, 48, 16);

    menuBg.fillStyle(0x8B5CF6, 1);
    menuBg.fillRoundedRect(-144, -24, 288, 48, 16);

    menuBg.fillStyle(0xffffff, 0.22);
    menuBg.fillRoundedRect(-140, -22, 280, 20, 12);
    menuBtn.add(menuBg);

    const menuText = this.add.text(0, -1, '🏠  MAIN MENU', {
      fontFamily: 'Poppins, sans-serif',
      fontSize: '15px',
      fontStyle: 'bold',
      color: '#FFFFFF'
    }).setOrigin(0.5);
    menuBtn.add(menuText);

    menuBtn.setSize(288, 48);
    menuBtn.setInteractive({ useHandCursor: true });

    menuBtn.on('pointerdown', () => {
      audioManager.playButtonClick();
      this.tweens.add({
        targets: menuBtn,
        scale: 0.93,
        duration: 70,
        yoyo: true,
        onComplete: () => {
          this.cameras.main.fadeOut(200, 0, 0, 0);
          this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('MainMenuScene');
          });
        }
      });
    });
  }

  /**
   * Colorful floating confetti ribbons falling down softly in the background.
   */
  private createFallingConfetti(width: number, height: number) {
    const confettiColors = [0xEF4444, 0xFACC15, 0x38BDF8, 0x34D399, 0xC084FC, 0xF472B6];
    for (let i = 0; i < 26; i++) {
      const g = this.add.graphics();
      const col = confettiColors[i % confettiColors.length];
      const w = Phaser.Math.Between(6, 12);
      const h = Phaser.Math.Between(4, 9);
      g.fillStyle(col, Phaser.Math.FloatBetween(0.5, 0.85));
      g.fillRoundedRect(-w / 2, -h / 2, w, h, 2);

      g.x = Phaser.Math.Between(10, width - 10);
      g.y = Phaser.Math.Between(-20, height);
      g.angle = Phaser.Math.Between(0, 360);

      const fallSpeed = Phaser.Math.Between(4000, 8000);
      this.tweens.add({
        targets: g,
        y: height + 20,
        x: g.x + Phaser.Math.Between(-40, 40),
        angle: g.angle + Phaser.Math.Between(180, 720),
        duration: fallSpeed,
        repeat: -1,
        ease: 'Linear',
        delay: Phaser.Math.Between(0, 3000)
      });
    }
  }

  /**
   * Smooth 0 -> Final Score odometer counter.
   */
  private animateScoreCounter(targetScore: number) {
    if (targetScore === 0) return;

    const counter = { val: 0 };
    this.tweens.add({
      targets: counter,
      val: targetScore,
      duration: 1000,
      ease: 'Cubic.easeOut',
      onUpdate: () => {
        if (this.animatedScoreText) {
          this.animatedScoreText.setText(Math.floor(counter.val).toLocaleString());
        }
      },
      onComplete: () => {
        if (this.animatedScoreText) {
          this.animatedScoreText.setText(targetScore.toLocaleString());
          this.tweens.add({
            targets: this.animatedScoreText,
            scale: 1.15,
            duration: 100,
            yoyo: true
          });
        }
      }
    });
  }

  /**
   * Golden star celebration sparks on new high score.
   */
  private triggerNewBestCelebration(centerX: number, centerY: number) {
    const starColors = [0xFFD700, 0xFACC15, 0xF59E0B, 0xFFFFFF, 0x34D399];
    for (let i = 0; i < 28; i++) {
      const angle = (Math.PI * 2 * i) / 28;
      const speed = Phaser.Math.Between(60, 160);
      const col = starColors[Phaser.Math.Between(0, starColors.length - 1)];

      const spark = this.add.circle(centerX, centerY, Phaser.Math.Between(2, 5), col);
      this.tweens.add({
        targets: spark,
        x: centerX + Math.cos(angle) * speed,
        y: centerY + Math.sin(angle) * speed,
        scale: { from: 1.6, to: 0 },
        alpha: { from: 1, to: 0 },
        duration: Phaser.Math.Between(450, 800),
        ease: 'Cubic.easeOut',
        onComplete: () => spark.destroy()
      });
    }
  }
}
