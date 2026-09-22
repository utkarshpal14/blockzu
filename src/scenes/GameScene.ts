import Phaser from 'phaser';
import { CANVAS_WIDTH, CANVAS_HEIGHT, POINTS_PER_BLOCK, BOARD_CARD_WIDTH, BOARD_CARD_HEIGHT, BOARD_CARD_X, BOARD_CARD_Y } from '../constants/gameplay';
import { ThemeManager } from '../managers/ThemeManager';
import { ScoreManager } from '../managers/ScoreManager';
import { SaveManager } from '../managers/SaveManager';
import { AudioManager } from '../managers/AudioManager';
import { StatisticsManager } from '../managers/StatisticsManager';
import { BoardManager } from '../managers/BoardManager';
import { PieceManager } from '../managers/PieceManager';
import { BoardView } from '../ui/components/BoardView';
import { TrayView } from '../ui/components/TrayView';
import { AmbientParticles } from '../ui/components/AmbientParticles';
import { BannerAd } from '../ui/components/BannerAd';
import { ClearSystem } from '../systems/ClearSystem';
import { GameFlowSystem, SessionStats } from '../systems/GameFlowSystem';
import { FloatingText } from '../ui/components/FloatingText';
import { PieceDefinition } from '../types/Piece';
import { SettingsModal } from '../ui/modals/SettingsModal';
import { AchievementManager } from '../managers/AchievementManager';
import { MissionManager } from '../managers/MissionManager';
import { ProgressionToast } from '../ui/components/ProgressionToast';

/**
 * GAME SCENE (Core Gameplay Loop)
 * Block Blast layout with huge bold score header, crown best score, settings gear,
 * 3D jewel blocks, neon line clearance auras, and "No Space Left" transition.
 * Defined in Document 02, 03, 04, 05 & Milestone 6.5.
 */
export class GameScene extends Phaser.Scene {
  private boardManager!: BoardManager;
  private pieceManager!: PieceManager;
  private boardView!: BoardView;
  private trayView!: TrayView;
  private clearSystem!: ClearSystem;
  private gameFlowSystem!: GameFlowSystem;

  private scoreText!: Phaser.GameObjects.Text;
  private bestScoreText!: Phaser.GameObjects.Text;

  // Session Statistics
  private sessionLinesCleared: number = 0;
  private sessionBlocksPlaced: number = 0;
  private sessionMaxCombo: number = 0;

  private isReviveSession: boolean = false;
  private priorScore: number = 0;

  constructor() {
    super('GameScene');
  }

  init(data?: { isRevive?: boolean; priorScore?: number; linesCleared?: number; maxCombo?: number }) {
    if (data?.isRevive) {
      this.isReviveSession = true;
      this.priorScore = data.priorScore || 0;
      this.sessionLinesCleared = data.linesCleared || 0;
      this.sessionMaxCombo = data.maxCombo || 0;
    } else {
      this.isReviveSession = false;
      this.priorScore = 0;
      this.sessionLinesCleared = 0;
      this.sessionBlocksPlaced = 0;
      this.sessionMaxCombo = 0;
    }
  }

  create() {
    const width = this.scale.width || CANVAS_WIDTH;
    const height = this.scale.height || CANVAS_HEIGHT;
    const theme = ThemeManager.getInstance().getActiveColors();
    const scoreManager = ScoreManager.getInstance();
    const audioManager = AudioManager.getInstance();

    this.boardManager = BoardManager.getInstance();
    this.pieceManager = PieceManager.getInstance();

    if (this.isReviveSession) {
      // Restore score
      scoreManager.resetCurrentScore();
      scoreManager.setScore(this.priorScore);

      // Fair Revive: Clear 8 to 12 random occupied cells
      const occupied = this.boardManager.getOccupiedCells();
      const numToClear = Math.min(occupied.length, Phaser.Math.Between(8, 12));
      Phaser.Utils.Array.Shuffle(occupied);
      const cellsToClear = occupied.slice(0, numToClear);
      this.boardManager.clearCells(cellsToClear);

      // Reset tray with fresh pieces
      this.pieceManager.reset();
    } else {
      this.sessionLinesCleared = 0;
      this.sessionBlocksPlaced = 0;
      this.sessionMaxCombo = 0;
      this.boardManager.reset();
      this.pieceManager.reset();
      scoreManager.resetCurrentScore();
    }

    // Camera transition: Fast 200ms Fade-In
    this.cameras.main.fadeIn(200, 0, 0, 0);

    // Set Calm Gameplay Ambient Pad & Zen Soundscape
    audioManager.setAudioState('gameplay');

    // 1. Dynamic Background with Gradient Depth (Cohesive Royal Sapphire to Deep Navy)
    const bgGraphics = this.add.graphics();
    const bgTop = Phaser.Display.Color.HexStringToColor(theme.background).color; // 0x223BBE
    const bgBottom = 0x172554; // Deep Royal Navy (Interconnected)
    bgGraphics.fillGradientStyle(bgTop, bgTop, bgBottom, bgBottom, 1);
    bgGraphics.fillRect(0, 0, width, height);

    // 2. Ambient Multi-Color Drifting Particles
    new AmbientParticles(this, 20, true);

    // 3. Top HUD (Crown Best | Huge Score | Settings Gear)
    this.createHUD(width, theme);
    if (this.isReviveSession) {
      this.scoreText.setText(this.priorScore.toLocaleString());
    }

    // 4. 8x8 Board View (3D Jewel Blocks + Recessed Pockets)
    this.boardView = new BoardView(this);

    // 5. Systems
    this.clearSystem = new ClearSystem(this, this.boardView);
    this.gameFlowSystem = new GameFlowSystem(this);

    // 6. 3-Piece Glassmorphic Tray Dock View
    this.trayView = new TrayView(
      this,
      this.boardView,
      (piece: PieceDefinition, row: number, col: number, onComplete: () => void) => {
        this.handlePiecePlaced(piece, row, col, onComplete);
      }
    );

    // Check danger state initially (especially on revive)
    this.boardView.updateDangerAura(this.boardManager.getOccupiedCells().length);

    // If Revive session: show celebratory toast and reset combo state
    if (this.isReviveSession) {
      this.sessionMaxCombo = 0;
      audioManager.playCombo(2);
      ProgressionToast.show(this, {
        title: '🌟 REVIVE ACTIVATED!',
        subtitle: 'Grid Cleared • Combo Reset',
        icon: '✨'
      });
      this.pulseScoreCounter(true);
    }

    // 7. 30-Second Gameplay Autosave Loop
    const autosaveEvent = this.time.addEvent({
      delay: 30000,
      loop: true,
      callback: () => {
        const saveManager = SaveManager.getInstance();
        saveManager.flushSessionPlayTime();
        saveManager.save();
      }
    });

    // Clean Memory & Lifecycle management on scene shutdown
    this.events.once('shutdown', () => {
      autosaveEvent.destroy();
      audioManager.resetPlacementStreak();
      this.boardView.destroy();
      this.trayView.destroy();
    });
  }

  public getBoardView(): BoardView {
    return this.boardView;
  }

  public getBoardManager(): BoardManager {
    return this.boardManager;
  }

  public getTrayView(): TrayView {
    return this.trayView;
  }

  public getClearSystem(): ClearSystem {
    return this.clearSystem;
  }

  public getSessionStats(): SessionStats & { hasRevived?: boolean } {
    const scoreManager = ScoreManager.getInstance();
    return {
      score: scoreManager.getCurrentScore(),
      linesCleared: this.sessionLinesCleared,
      blocksPlaced: this.sessionBlocksPlaced,
      maxCombo: this.sessionMaxCombo,
      hasRevived: this.isReviveSession
    };
  }

  /**
   * Coordinated Placement Lifecycle:
   * 1. Lock Input
   * 2. Increment stats & spawn placement score floater (+N)
   * 3. Clear lines via ClearSystem (flash 50ms -> shrink 100ms -> fade 50ms)
   * 4. Record best single move score
   * 5. Trigger tray refill if empty
   * 6. Run Game Over Solver: If 0 moves, show "NO SPACE LEFT!" warning before Game Over!
   */
  private handlePiecePlaced(piece: PieceDefinition, row: number, col: number, onComplete: () => void) {
    // 1. Lock Input
    this.trayView.setLocked(true);
    this.sessionBlocksPlaced += piece.blockCount;

    const achievementManager = AchievementManager.getInstance();
    const missionManager = MissionManager.getInstance();
    const saveManager = SaveManager.getInstance();
    const audioManager = AudioManager.getInstance();

    // Subtle snap haptic vibration & Ascending Placement Pitch Ladder
    audioManager.vibrate(18);
    audioManager.playPlace();

    // Progression: Block placement
    if (achievementManager.updateProgress('first_placement', 1)) {
      ProgressionToast.show(this, { title: 'ACHIEVEMENT UNLOCKED!', subtitle: 'First Placement', rewardCoins: 50, icon: '🏆' });
      this.pulseScoreCounter(true);
    }
    const newlyCompletedMissions = missionManager.reportProgress('blocks', piece.blockCount, true);
    newlyCompletedMissions.forEach((m) => {
      ProgressionToast.show(this, { title: 'MISSION COMPLETE!', subtitle: m.title, rewardCoins: m.rewardCoins, icon: '🎯' });
      this.pulseScoreCounter(true);
    });

    // 2. Update HUD & Score
    this.updateHUD();

    const placementPoints = piece.blockCount * POINTS_PER_BLOCK;

    // 3. Score popup for base block placement (+1, +4, +9)
    const cellPos = this.boardManager.getCellCenter(row, col);
    FloatingText.show(this, {
      x: cellPos.x,
      y: cellPos.y,
      text: `+${piece.blockCount}`,
      fontSize: '20px'
    });

    // Check danger state immediately on tile placement
    this.boardView.updateDangerAura(this.boardManager.getOccupiedCells().length);

    // 4. Evaluate Line Clears & Combos
    this.clearSystem.evaluateAndClearLines((result) => {
      const moveScore = placementPoints + (result.scoreAwarded || 0);
      StatisticsManager.getInstance().recordMoveScore(moveScore);

      const currentScore = ScoreManager.getInstance().getCurrentScore();

      // Check Score Achievements & Missions
      ['score_100', 'score_500', 'score_1000', 'score_2500', 'score_5000'].forEach((achId) => {
        const def = achievementManager.getAchievementDefinitions().find((d) => d.id === achId);
        if (def && currentScore >= def.target) {
          if (achievementManager.updateProgress(achId, currentScore, false)) {
            ProgressionToast.show(this, { title: 'ACHIEVEMENT UNLOCKED!', subtitle: def.title, rewardCoins: def.rewardCoins, icon: '🏆' });
            this.pulseScoreCounter(true);
          }
        }
      });
      const scoreMissions = missionManager.reportProgress('score', currentScore, false);
      scoreMissions.forEach((m) => {
        ProgressionToast.show(this, { title: 'MISSION COMPLETE!', subtitle: m.title, rewardCoins: m.rewardCoins, icon: '🎯' });
        this.pulseScoreCounter(true);
      });

      if (result.hasCleared) {
        this.sessionLinesCleared += result.linesCleared;
        this.sessionMaxCombo = Math.max(this.sessionMaxCombo, result.linesCleared);
        this.updateHUD();
        this.pulseScoreCounter(true);

        // Economy: In-game Coin Earnings
        let earnedCoins = result.linesCleared * 2; // +2 per line
        if (result.linesCleared === 2) earnedCoins += 5; // +5 for x2 combo
        else if (result.linesCleared >= 3) earnedCoins += 10; // +10 for x3+ combo

        saveManager.addCoins(earnedCoins);

        // Spawn Coin Floater
        FloatingText.show(this, {
          x: cellPos.x,
          y: cellPos.y - 32,
          text: `+${earnedCoins} 🪙`,
          fontSize: '18px',
          color: '#FDE047'
        });

        // Progression: Line Clear Achievements & Missions
        ['clear_10_lines', 'clear_50_lines', 'clear_100_lines', 'clear_500_lines'].forEach((achId) => {
          if (achievementManager.updateProgress(achId, result.linesCleared, true)) {
            const def = achievementManager.getAchievementDefinitions().find((d) => d.id === achId);
            if (def) {
              ProgressionToast.show(this, { title: 'ACHIEVEMENT UNLOCKED!', subtitle: def.title, rewardCoins: def.rewardCoins, icon: '🏆' });
              this.pulseScoreCounter(true);
            }
          }
        });
        const lineMissions = missionManager.reportProgress('lines', result.linesCleared, true);
        lineMissions.forEach((m) => {
          ProgressionToast.show(this, { title: 'MISSION COMPLETE!', subtitle: m.title, rewardCoins: m.rewardCoins, icon: '🎯' });
          this.pulseScoreCounter(true);
        });

        // Progression: Combos
        if (result.linesCleared >= 2) {
          if (achievementManager.updateProgress('first_combo', 1)) {
            ProgressionToast.show(this, { title: 'ACHIEVEMENT UNLOCKED!', subtitle: 'First Combo', rewardCoins: 100, icon: '⚡' });
            this.pulseScoreCounter(true);
          }
          ['combo_10', 'combo_50', 'combo_100'].forEach((achId) => {
            if (achievementManager.updateProgress(achId, 1, true)) {
              const def = achievementManager.getAchievementDefinitions().find((d) => d.id === achId);
              if (def) {
                ProgressionToast.show(this, { title: 'ACHIEVEMENT UNLOCKED!', subtitle: def.title, rewardCoins: def.rewardCoins, icon: '⚡' });
                this.pulseScoreCounter(true);
              }
            }
          });
          const comboMissions = missionManager.reportProgress('combos', 1, true);
          comboMissions.forEach((m) => {
            ProgressionToast.show(this, { title: 'MISSION COMPLETE!', subtitle: m.title, rewardCoins: m.rewardCoins, icon: '🎯' });
            this.pulseScoreCounter(true);
          });

          audioManager.vibrate([30, 40, 50]);
        } else {
          audioManager.vibrate(35);
        }
      }

      // Re-evaluate danger aura post-clears
      this.boardView.updateDangerAura(this.boardManager.getOccupiedCells().length);

      // 5. Trigger Tray Refill (if tray was emptied by this placement)
      onComplete();

      // 6. Move Availability Solver (Checks remaining pieces against updated board)
      this.time.delayedCall(100, () => {
        if (this.gameFlowSystem.isGameOver()) {
          this.trayView.setLocked(true);
          this.showNoSpaceWarning();
        } else {
          // Moves available: Unlock input and continue playing!
          this.trayView.setLocked(false);
        }
      });
    });
  }

  /**
   * Dramatic "NO SPACE LEFT!" alert banner before transitioning to Game Over.
   */
  private showNoSpaceWarning() {
    const width = this.scale.width || CANVAS_WIDTH;
    const bannerContainer = this.add.container(width / 2, BOARD_CARD_Y + BOARD_CARD_HEIGHT / 2).setDepth(90);

    // Dark Board Overlay
    const overlay = this.add.graphics();
    overlay.fillStyle(0x000000, 0.65);
    overlay.fillRoundedRect(BOARD_CARD_X, BOARD_CARD_Y, BOARD_CARD_WIDTH, BOARD_CARD_HEIGHT, 22);

    // Warning Card
    const card = this.add.graphics();
    card.fillStyle(0x1e1b4b, 0.95);
    card.lineStyle(2.5, 0xef4444, 1);
    card.fillRoundedRect(-140, -36, 280, 72, 18);
    card.strokeRoundedRect(-140, -36, 280, 72, 18);
    bannerContainer.add(card);

    const title = this.add.text(0, -8, 'NO SPACE LEFT!', {
      fontFamily: 'Poppins, sans-serif',
      fontSize: '20px',
      fontStyle: 'bold',
      color: '#EF4444'
    }).setOrigin(0.5);
    bannerContainer.add(title);

    const sub = this.add.text(0, 16, 'Out of valid moves', {
      fontFamily: 'Poppins, sans-serif',
      fontSize: '12px',
      color: '#94A3B8'
    }).setOrigin(0.5);
    bannerContainer.add(sub);

    bannerContainer.setScale(0.3);
    bannerContainer.setAlpha(0);

    this.tweens.add({
      targets: bannerContainer,
      scale: 1.05,
      alpha: 1,
      duration: 200,
      ease: 'Back.easeOut',
      onComplete: () => {
        this.tweens.add({
          targets: bannerContainer,
          scale: 1.0,
          duration: 100
        });
      }
    });

    // Hold for 900ms, fade out camera, then trigger game over
    this.time.delayedCall(900, () => {
      this.cameras.main.fadeOut(200, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.gameFlowSystem.triggerGameOver(this.getSessionStats(), () => {
          overlay.destroy();
          bannerContainer.destroy();
        });
      });
    });
  }

  private updateHUD() {
    const scoreManager = ScoreManager.getInstance();
    const saveManager = SaveManager.getInstance();
    const currentScore = scoreManager.getCurrentScore();

    this.scoreText.setText(`${currentScore}`);
    this.bestScoreText.setText(`${saveManager.getBestScore().toLocaleString()}`);
    this.pulseScoreCounter(false);
  }

  /**
   * Pulses score counter:
   * - Standard placement: scale 1.12x for 80ms
   * - Major event (line clear, combo, achievement, mission): scale 1.25x for 160ms with gold flash
   */
  public pulseScoreCounter(isMajor: boolean = false) {
    if (!this.scoreText || !this.scoreText.scene) return;

    if (isMajor) {
      this.scoreText.setColor('#FACC15');
      this.tweens.add({
        targets: this.scoreText,
        scale: 1.25,
        duration: 90,
        yoyo: true,
        ease: 'Quad.easeOut',
        onComplete: () => {
          if (this.scoreText) {
            this.scoreText.setColor('#FFFFFF');
          }
        }
      });
    } else {
      this.tweens.add({
        targets: this.scoreText,
        scale: 1.12,
        duration: 60,
        yoyo: true,
        ease: 'Quad.easeOut'
      });
    }
  }

  /**
   * Block Blast In-Game HUD:
   * [ 👑 Best ]             [ ⚙️ Settings ]
   *               [ 389 ]
   */
  private createHUD(width: number, _theme: any) {
    const scoreManager = ScoreManager.getInstance();
    const saveManager = SaveManager.getInstance();
    const audioManager = AudioManager.getInstance();

    // 0. In-Game Top Sponsored Banner Bar (Inside game canvas, above score & buttons)
    new BannerAd(this, width / 2, 22);

    const topBarY = 64;

    // 1. Crown Best Score Pill (Top-Left)
    const crownContainer = this.add.container(65, topBarY);
    const crownBg = this.add.graphics();
    crownBg.fillStyle(0x0F172A, 0.85);
    crownBg.lineStyle(1.5, 0xF59E0B, 0.85);
    crownBg.fillRoundedRect(-52, -15, 104, 30, 15);
    crownBg.strokeRoundedRect(-52, -15, 104, 30, 15);
    crownContainer.add(crownBg);

    const crownIcon = this.add.text(-38, 0, '👑', {
      fontSize: '15px'
    }).setOrigin(0, 0.5);
    crownContainer.add(crownIcon);

    this.bestScoreText = this.add.text(-16, 0, `${saveManager.getBestScore().toLocaleString()}`, {
      fontFamily: 'Poppins, sans-serif',
      fontSize: '14px',
      fontStyle: 'bold',
      color: '#FDE047'
    }).setOrigin(0, 0.5);
    crownContainer.add(this.bestScoreText);

    // 2. Settings Gear Pill (Top-Right)
    const settingsBtn = this.add.container(width - 34, topBarY);
    const gearBg = this.add.graphics();
    gearBg.fillStyle(0x0F172A, 0.85);
    gearBg.lineStyle(1.5, 0x38BDF8, 0.85);
    gearBg.fillCircle(0, 0, 17);
    gearBg.strokeCircle(0, 0, 17);
    settingsBtn.add(gearBg);

    const gearText = this.add.text(0, 0, '⚙️', {
      fontSize: '18px'
    }).setOrigin(0.5);
    settingsBtn.add(gearText);

    settingsBtn.setSize(36, 36);
    settingsBtn.setInteractive({ useHandCursor: true });

    settingsBtn.on('pointerdown', () => {
      audioManager.playButtonClick();
      this.trayView.setLocked(true);
      new SettingsModal(this, () => {
        this.trayView.setLocked(false);
      }, () => {
        this.scene.restart();
      });
    });

    // 3. Huge Bold Clean Score Number (Center Top right between Best and Settings)
    this.scoreText = this.add.text(width / 2, 64, `${scoreManager.getCurrentScore()}`, {
      fontFamily: 'Poppins, sans-serif',
      fontSize: '44px',
      fontStyle: 'bold',
      color: '#FFFFFF'
    }).setOrigin(0.5);
  }
}
