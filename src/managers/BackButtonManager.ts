import { App } from '@capacitor/app';
import Phaser from 'phaser';

interface ModalEntry {
  modal: any;
  dismiss: () => void;
}

/**
 * BACK BUTTON MANAGER
 * Central hardware and gesture back button interceptor for Android (Capacitor) & Browser (Escape).
 * 
 * Rules:
 * 1. If any Modal is active -> Dismisses the top-most modal.
 * 2. If in GameScene -> Pauses gameplay and opens PauseModal.
 * 3. If in GameOverScene -> Returns to MainMenuScene.
 * 4. If in MainMenuScene -> Opens Exit Confirmation Modal.
 */
export class BackButtonManager {
  private static instance: BackButtonManager;
  private game?: Phaser.Game;
  private modalStack: ModalEntry[] = [];
  private isInitialized: boolean = false;
  private lastBackPressTime: number = 0;

  private constructor() {}

  public static getInstance(): BackButtonManager {
    if (!BackButtonManager.instance) {
      BackButtonManager.instance = new BackButtonManager();
    }
    return BackButtonManager.instance;
  }

  public init(game: Phaser.Game) {
    if (this.isInitialized) return;
    this.game = game;
    this.isInitialized = true;

    // 1. Android Capacitor Hardware Back Button
    try {
      App.addListener('backButton', () => {
        this.handleBackPress();
      });
    } catch (e) {
      console.warn('[BackButtonManager] Capacitor App backButton listener failed:', e);
    }

    // 2. Desktop Keyboard Escape Key Support
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          this.handleBackPress();
        }
      });
    }
  }

  public pushModal(modal: any, dismiss: () => void) {
    // Avoid duplicate entries
    this.removeModal(modal);
    this.modalStack.push({ modal, dismiss });
  }

  public removeModal(modal: any) {
    this.modalStack = this.modalStack.filter(entry => entry.modal !== modal);
  }

  public hasOpenModals(): boolean {
    return this.modalStack.length > 0;
  }

  public handleBackPress() {
    const now = Date.now();
    // Debounce rapid double presses within 150ms
    if (now - this.lastBackPressTime < 150) {
      return;
    }
    this.lastBackPressTime = now;

    // A. If a Modal is open -> dismiss top-most modal
    if (this.modalStack.length > 0) {
      const topModal = this.modalStack.pop();
      if (topModal && typeof topModal.dismiss === 'function') {
        try {
          topModal.dismiss();
        } catch (err) {
          console.warn('[BackButtonManager] Error dismissing modal:', err);
        }
      }
      return;
    }

    if (!this.game) return;

    // B. Check active scene
    const sceneManager = this.game.scene;
    const activeScenes = sceneManager.getScenes(true);

    // 1. GameScene Active
    const gameScene = activeScenes.find(s => s.scene.key === 'GameScene') as any;
    if (gameScene && typeof gameScene.handleBackPress === 'function') {
      gameScene.handleBackPress();
      return;
    }

    // 2. GameOverScene Active
    const gameOverScene = activeScenes.find(s => s.scene.key === 'GameOverScene') as any;
    if (gameOverScene && typeof gameOverScene.handleBackPress === 'function') {
      gameOverScene.handleBackPress();
      return;
    }

    // 3. MainMenuScene Active
    const mainMenuScene = activeScenes.find(s => s.scene.key === 'MainMenuScene') as any;
    if (mainMenuScene && typeof mainMenuScene.handleBackPress === 'function') {
      mainMenuScene.handleBackPress();
      return;
    }
  }
}
