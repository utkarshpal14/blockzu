import Phaser from 'phaser';
import { AudioManager } from '../../managers/AudioManager';
import { AdManager } from '../../managers/AdManager';

interface SponsoredAdItem {
  icon: string;
  title: string;
  cta: string;
  action: 'themes' | 'coins' | 'missions' | 'stats' | 'external';
  url?: string;
}

const SPONSORED_INVENTORY: SponsoredAdItem[] = [
  {
    icon: '💎',
    title: 'Unlock 6+ Neon & Galaxy Themes',
    cta: 'THEMES',
    action: 'themes'
  },
  {
    icon: '🪙',
    title: 'Watch Ad for +50 Free Gold Coins',
    cta: 'CLAIM',
    action: 'coins'
  },
  {
    icon: '👑',
    title: 'Daily Puzzle Quests & Rewards',
    cta: 'QUESTS',
    action: 'missions'
  },
  {
    icon: '📊',
    title: 'Track High Score & Longest Combos',
    cta: 'STATS',
    action: 'stats'
  },
  {
    icon: '🎮',
    title: 'PriorApp Games: Casual Puzzles',
    cta: 'VISIT',
    action: 'external',
    url: 'https://priorapp.co.in'
  }
];

/**
 * IN-GAME TOP BANNER AD COMPONENT
 * Renders a high-contrast, interactive in-game top banner bar inside the game canvas
 * directly above the score and settings buttons.
 * - On Native Android: Commands AdMob SDK to render top native banner.
 * - On Web / PWA: Automatically rotates live interactive sponsored inventory with in-game actions.
 */
export class BannerAd extends Phaser.GameObjects.Container {
  private currentAdIndex: number = 0;
  private bannerWidth: number;
  private bannerHeight: number;
  private contentContainer!: Phaser.GameObjects.Container;
  private rotateTimer?: Phaser.Time.TimerEvent;

  constructor(scene: Phaser.Scene, x: number = 190, y: number = 24, width: number = 350, height: number = 30) {
    super(scene, x, y);
    this.bannerWidth = width;
    this.bannerHeight = height;

    this.createBanner();
    scene.add.existing(this);
    this.setDepth(15);

    // If native platform, also signal AdMob native banner
    const adManager = AdManager.getInstance();
    if (adManager.isNativePlatform()) {
      adManager.showBanner('top');
    } else {
      this.startRotationTimer();
    }
  }

  private createBanner() {
    const width = this.bannerWidth;
    const height = this.bannerHeight;

    const bg = this.scene.add.graphics();

    // 1. Drop shadow
    bg.fillStyle(0x000000, 0.4);
    bg.fillRoundedRect(-width / 2, -height / 2 + 2, width, height, 10);

    // 2. Glassmorphic Bar Body
    bg.fillStyle(0x0F172A, 0.94);
    bg.fillRoundedRect(-width / 2, -height / 2, width, height, 10);

    // 3. Subtle Cyan/Slate Border
    bg.lineStyle(1.2, 0x334155, 0.95);
    bg.strokeRoundedRect(-width / 2, -height / 2, width, height, 10);
    this.add(bg);

    // 4. "AD" Pill Badge (Vibrant Royal Blue)
    const adBadge = this.scene.add.graphics();
    adBadge.fillStyle(0x2563EB, 1);
    adBadge.fillRoundedRect(-width / 2 + 8, -9, 28, 18, 5);
    this.add(adBadge);

    const adLabel = this.scene.add.text(-width / 2 + 22, 0, 'AD', {
      fontFamily: 'Poppins, sans-serif',
      fontSize: '10px',
      fontStyle: 'bold',
      color: '#FFFFFF'
    }).setOrigin(0.5);
    this.add(adLabel);

    // 5. Dynamic Content Container (Rotates every 6s)
    this.contentContainer = this.scene.add.container(0, 0);
    this.add(this.contentContainer);
    this.renderCurrentAd();

    // 6. Interactive Click area across the whole banner
    const hitArea = this.scene.add.rectangle(0, 0, width - 40, height, 0x000000, 0);
    hitArea.setInteractive({ useHandCursor: true });
    hitArea.on('pointerdown', () => {
      this.handleBannerClick();
    });
    this.add(hitArea);

    // 7. Info Icon ⓘ on the right
    const infoIcon = this.scene.add.text(width / 2 - 14, 0, 'ⓘ', {
      fontFamily: 'Poppins, sans-serif',
      fontSize: '12px',
      color: '#64748B'
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    infoIcon.on('pointerdown', (pointer: any) => {
      pointer.event.stopPropagation();
      AudioManager.getInstance().playButtonClick();
      this.openInfoModal();
    });
    this.add(infoIcon);
  }

  private async handleBannerClick() {
    const audioManager = AudioManager.getInstance();
    audioManager.playButtonClick();

    const item = SPONSORED_INVENTORY[this.currentAdIndex];
    if (item.action === 'themes') {
      const { ThemesModal } = await import('../modals/ThemesModal');
      new ThemesModal(this.scene, () => {});
    } else if (item.action === 'coins') {
      AdManager.getInstance().showRewardedAd(this.scene, 'coins', () => {});
    } else if (item.action === 'missions') {
      const { MissionsModal } = await import('../modals/MissionsModal');
      new MissionsModal(this.scene, () => {});
    } else if (item.action === 'stats') {
      const { StatsModal } = await import('../modals/StatsModal');
      new StatsModal(this.scene);
    } else if (item.action === 'external') {
      if (typeof window !== 'undefined') {
        window.open(item.url || 'https://priorapp.co.in', '_blank');
      }
    }
  }

  private async openInfoModal() {
    const { SettingsModal } = await import('../modals/SettingsModal');
    new SettingsModal(this.scene);
  }

  private renderCurrentAd() {
    this.contentContainer.removeAll(true);
    const item = SPONSORED_INVENTORY[this.currentAdIndex];
    const width = this.bannerWidth;

    // Sponsor title text
    const promoText = this.scene.add.text(-width / 2 + 42, 0, `${item.icon} ${item.title}`, {
      fontFamily: 'Poppins, sans-serif',
      fontSize: '10.5px',
      fontStyle: 'bold',
      color: '#E2E8F0',
      maxLines: 1
    }).setOrigin(0, 0.5);
    this.contentContainer.add(promoText);

    // CTA Mini Badge
    const ctaBg = this.scene.add.graphics();
    ctaBg.fillStyle(0x38BDF8, 0.2);
    ctaBg.lineStyle(1, 0x38BDF8, 0.6);
    ctaBg.fillRoundedRect(width / 2 - 68, -8, 44, 16, 4);
    ctaBg.strokeRoundedRect(width / 2 - 68, -8, 44, 16, 4);
    this.contentContainer.add(ctaBg);

    const ctaLabel = this.scene.add.text(width / 2 - 46, 0, item.cta, {
      fontFamily: 'Poppins, sans-serif',
      fontSize: '9px',
      fontStyle: 'bold',
      color: '#38BDF8'
    }).setOrigin(0.5);
    this.contentContainer.add(ctaLabel);
  }

  private startRotationTimer() {
    this.rotateTimer = this.scene.time.addEvent({
      delay: 6000,
      loop: true,
      callback: () => {
        this.transitionToNextAd();
      }
    });
  }

  private transitionToNextAd() {
    this.scene.tweens.add({
      targets: this.contentContainer,
      alpha: 0,
      y: -6,
      duration: 200,
      ease: 'Quad.easeIn',
      onComplete: () => {
        this.currentAdIndex = (this.currentAdIndex + 1) % SPONSORED_INVENTORY.length;
        this.renderCurrentAd();
        this.contentContainer.y = 6;
        this.scene.tweens.add({
          targets: this.contentContainer,
          alpha: 1,
          y: 0,
          duration: 250,
          ease: 'Back.easeOut'
        });
      }
    });
  }

  public destroy(fromScene?: boolean) {
    if (this.rotateTimer) {
      this.rotateTimer.destroy();
    }
    super.destroy(fromScene);
  }
}
