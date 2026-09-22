import Phaser from 'phaser';

/**
 * IN-GAME TOP BANNER AD COMPONENT
 * Renders a high-contrast, non-intrusive in-game top banner bar inside the game canvas
 * directly above the score and settings buttons.
 * Pre-configured for Google AdSense / AdMob native banner binding.
 */
export class BannerAd extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene, x: number = 225, y: number = 20, width: number = 424, height: number = 32) {
    super(scene, x, y);

    this.createBanner(width, height);
    scene.add.existing(this);
    this.setDepth(15);
  }

  private createBanner(width: number, height: number) {
    const bg = this.scene.add.graphics();

    // 1. Drop shadow
    bg.fillStyle(0x000000, 0.4);
    bg.fillRoundedRect(-width / 2, -height / 2 + 2, width, height, 10);

    // 2. Glassmorphic Bar Body
    bg.fillStyle(0x0F172A, 0.92);
    bg.fillRoundedRect(-width / 2, -height / 2, width, height, 10);

    // 3. Subtle Border
    bg.lineStyle(1.2, 0x334155, 0.9);
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

    // 5. Sponsored / Promotion Text
    const promoText = this.scene.add.text(-width / 2 + 44, 0, '🎯 Blockzu: Play 100% Free • Relaxing 8×8 Puzzle', {
      fontFamily: 'Poppins, sans-serif',
      fontSize: '11px',
      fontStyle: 'bold',
      color: '#E2E8F0'
    }).setOrigin(0, 0.5);
    this.add(promoText);

    // 6. Info Icon ⓘ on the right
    const infoIcon = this.scene.add.text(width / 2 - 14, 0, 'ⓘ', {
      fontFamily: 'Poppins, sans-serif',
      fontSize: '12px',
      color: '#64748B'
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    infoIcon.on('pointerdown', () => {
      if (typeof window !== 'undefined') {
        window.open('/privacy.html', '_blank');
      }
    });
    this.add(infoIcon);
  }
}
