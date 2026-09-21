import { AudioService } from '../services/AudioService';
import { SaveManager } from './SaveManager';

/**
 * AUDIO MANAGER
 * Coordinates sound FX, background music, and settings synchronization.
 */
export class AudioManager {
  private static instance: AudioManager;
  private audioService: AudioService;
  private saveManager: SaveManager;

  private constructor() {
    this.audioService = AudioService.getInstance();
    this.saveManager = SaveManager.getInstance();
    this.syncSettings();
  }

  public static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  public syncSettings() {
    const settings = this.saveManager.getSettings();
    this.audioService.setSoundEnabled(settings.soundEnabled);
    this.audioService.setMusicEnabled(settings.musicEnabled);
    this.audioService.setVibrationEnabled(settings.vibrationEnabled);
  }

  public isSoundEnabled(): boolean {
    return this.saveManager.getSettings().soundEnabled;
  }

  public isMusicEnabled(): boolean {
    return this.saveManager.getSettings().musicEnabled;
  }

  public isVibrationEnabled(): boolean {
    return this.saveManager.getSettings().vibrationEnabled;
  }

  public toggleSound(): boolean {
    const settings = this.saveManager.getSettings();
    const nextState = !settings.soundEnabled;
    this.saveManager.updateSettings({ soundEnabled: nextState });
    this.audioService.setSoundEnabled(nextState);
    return nextState;
  }

  public toggleMusic(): boolean {
    const settings = this.saveManager.getSettings();
    const nextState = !settings.musicEnabled;
    this.saveManager.updateSettings({ musicEnabled: nextState });
    this.audioService.setMusicEnabled(nextState);
    return nextState;
  }

  public toggleVibration(): boolean {
    const settings = this.saveManager.getSettings();
    const nextState = !settings.vibrationEnabled;
    this.saveManager.updateSettings({ vibrationEnabled: nextState });
    this.audioService.setVibrationEnabled(nextState);
    if (nextState) {
      this.vibrate(20);
    }
    return nextState;
  }

  public vibrate(pattern: number | number[] = 15) {
    this.audioService.vibrate(pattern);
  }

  public playPickup() {
    this.audioService.playPickupSound();
  }

  public playPlace() {
    this.audioService.playPlaceSound();
  }

  public playInvalid() {
    this.audioService.playInvalidSound();
  }

  public playLineClear(comboCount: number = 1) {
    this.audioService.playLineClearSound(comboCount);
  }

  public playAppreciation(level: number = 1) {
    this.audioService.playAppreciationSound(level);
  }

  public playCombo() {
    this.audioService.playComboSound();
  }

  public playButtonClick() {
    this.audioService.playButtonClick();
  }

  public playGameOver() {
    this.audioService.playGameOverSound();
  }
}
