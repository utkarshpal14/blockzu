/**
 * AUDIO SERVICE
 * Handles procedural sound effects synthesis via Web Audio API.
 * Guarantees zero external audio file loading errors.
 */
export class AudioService {
  private static instance: AudioService;
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private musicEnabled: boolean = true;
  private vibrationEnabled: boolean = true;
  private musicTimer: number | null = null;

  private constructor() {}

  public static getInstance(): AudioService {
    if (!AudioService.instance) {
      AudioService.instance = new AudioService();
    }
    return AudioService.instance;
  }

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  private placementStreak: number = 0;
  private lastPlacementTime: number = 0;
  private placementResetTimer: number | null = null;

  private audioState: 'menu' | 'gameplay' | 'gameover' = 'menu';
  private dangerTier: number = 0; // 0: safe, 1: danger (70-85%), 2: critical (>85%)
  private heartbeatTimer: number | null = null;
  private chimeTimer: number | null = null;

  public setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
  }

  public setMusicEnabled(enabled: boolean) {
    this.musicEnabled = enabled;
    if (enabled) {
      this.startAmbientSoundscape();
    } else {
      this.stopAmbientSoundscape();
    }
  }

  public setVibrationEnabled(enabled: boolean) {
    this.vibrationEnabled = enabled;
  }

  public vibrate(pattern: number | number[] = 15) {
    if (!this.vibrationEnabled) return;
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch (e) {
        // Silently ignore if blocked
      }
    }
  }

  /**
   * Sets current audio atmosphere:
   * - 'menu': Light arcade ambience with warm synth pads & gentle sparkle bells
   * - 'gameplay': Calm 15% volume ambient pad + occasional chime + dynamic danger pulse
   * - 'gameover': Silence (plays 1s short descending bell cue)
   */
  public setAudioState(state: 'menu' | 'gameplay' | 'gameover', dangerTier: number = 0) {
    this.audioState = state;
    this.dangerTier = dangerTier;
    if (this.musicEnabled) {
      this.startAmbientSoundscape();
    }
  }

  public setDangerTier(tier: number) {
    if (this.dangerTier !== tier) {
      this.dangerTier = tier;
      if (this.audioState === 'gameplay' && this.musicEnabled) {
        this.updateGameplayHeartbeat();
      }
    }
  }

  private startAmbientSoundscape() {
    this.stopAmbientSoundscape();
    if (!this.musicEnabled) return;

    if (this.audioState === 'menu') {
      this.playMenuAtmosphere();
      this.musicTimer = window.setInterval(() => {
        if (this.audioState === 'menu' && this.musicEnabled) {
          this.playMenuAtmosphere();
        }
      }, 5500);
    } else if (this.audioState === 'gameplay') {
      this.playGameplayDrone();
      // Continuous soft pad loop
      this.musicTimer = window.setInterval(() => {
        if (this.audioState === 'gameplay' && this.musicEnabled) {
          this.playGameplayDrone();
        }
      }, 7000);

      // Occasional gentle bell chime every 9-11 seconds
      this.chimeTimer = window.setInterval(() => {
        if (this.audioState === 'gameplay' && this.musicEnabled) {
          this.playZenChime();
        }
      }, 9500);

      this.updateGameplayHeartbeat();
    }
  }

  private stopAmbientSoundscape() {
    if (this.musicTimer) {
      clearInterval(this.musicTimer);
      this.musicTimer = null;
    }
    if (this.chimeTimer) {
      clearInterval(this.chimeTimer);
      this.chimeTimer = null;
    }
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  /**
   * Main Menu: Warm bass pad + soft arcade synth shimmer + light sparkle bells
   */
  private playMenuAtmosphere() {
    if (!this.musicEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    const chords = [
      [220.00, 277.18, 329.63, 440.00], // A Major 7 (Warm)
      [174.61, 220.00, 261.63, 349.23], // F Major (Lush)
      [196.00, 246.94, 293.66, 392.00]  // G Major (Bright)
    ];

    const chord = chords[Math.floor(Math.random() * chords.length)];
    const now = this.ctx.currentTime;

    // Warm pad
    chord.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = now + idx * 0.15;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.linearRampToValueAtTime(0.05, startTime + 0.5);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 3.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 3.2);
    });

    // Light sparkle bell (high octave soft chime)
    if (Math.random() > 0.3) {
      const bellFreqs = [880.00, 1046.50, 1318.51];
      const bellFreq = bellFreqs[Math.floor(Math.random() * bellFreqs.length)];
      const bellOsc = this.ctx.createOscillator();
      const bellGain = this.ctx.createGain();
      const bellStart = now + 1.2;

      bellOsc.type = 'triangle';
      bellOsc.frequency.setValueAtTime(bellFreq, bellStart);

      bellGain.gain.setValueAtTime(0.045, bellStart);
      bellGain.gain.exponentialRampToValueAtTime(0.0001, bellStart + 1.6);

      bellOsc.connect(bellGain);
      bellGain.connect(this.ctx.destination);

      bellOsc.start(bellStart);
      bellOsc.stop(bellStart + 1.6);
    }
  }

  /**
   * Gameplay: Calm, peaceful ambient synth pad (Volume: 50%)
   */
  private playGameplayDrone() {
    if (!this.musicEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const droneFreqs = [65.41, 98.00, 130.81]; // C2, G2, C3 deep focus drone

    droneFreqs.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = now + idx * 0.1;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      // 50% volume rich ambient pad with smooth 3.5s release
      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.linearRampToValueAtTime(0.05, startTime + 0.8);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 3.8);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 3.8);
    });
  }

  /**
   * Zen bell chime during gameplay (Every 9-11s, peaceful and soothing)
   */
  private playZenChime() {
    if (!this.musicEnabled || this.audioState !== 'gameplay') return;
    this.initContext();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 987.77, 1046.50]; // Pentatonic peace
    const note = notes[Math.floor(Math.random() * notes.length)];
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(note, now);

    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 2.2);
  }

  /**
   * Dynamic heartbeat pulse for danger (70-85%) and critical (>85%) states
   */
  private updateGameplayHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }

    if (!this.musicEnabled || this.audioState !== 'gameplay' || this.dangerTier === 0) {
      return;
    }

    const intervalMs = this.dangerTier === 2 ? 1100 : 1800; // Critical: faster pulse
    this.playHeartbeatThud(this.dangerTier === 2);

    this.heartbeatTimer = window.setInterval(() => {
      if (this.audioState === 'gameplay' && this.dangerTier > 0 && this.musicEnabled) {
        this.playHeartbeatThud(this.dangerTier === 2);
      }
    }, intervalMs);
  }

  private playHeartbeatThud(isCritical: boolean) {
    if (!this.ctx || !this.soundEnabled) return;
    const now = this.ctx.currentTime;

    // Sub-bass thud 1
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(60, now);
    osc1.frequency.exponentialRampToValueAtTime(35, now + 0.12);

    gain1.gain.setValueAtTime(isCritical ? 0.08 : 0.04, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc1.connect(gain1);
    gain1.connect(this.ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.12);

    // Double thump if critical
    if (isCritical) {
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      const start2 = now + 0.18;

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(55, start2);
      osc2.frequency.exponentialRampToValueAtTime(32, start2 + 0.12);

      gain2.gain.setValueAtTime(0.06, start2);
      gain2.gain.exponentialRampToValueAtTime(0.001, start2 + 0.12);

      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(start2);
      osc2.stop(start2 + 0.12);
    }
  }

  /**
   * Ascending Placement Pitch Ladder:
   * Consecutive block placements within 2.5s climb the pentatonic scale:
   * 1 -> C4 (261.63 Hz)
   * 2 -> D4 (293.66 Hz)
   * 3 -> E4 (329.63 Hz)
   * 4 -> G4 (392.00 Hz)
   * 5 -> A4 (440.00 Hz)
   * 6+ -> C5 (523.25 Hz)
   * Resets after 2.5s of inactivity.
   */
  public playPlaceSound(): number {
    if (!this.soundEnabled) return 1;
    this.initContext();
    if (!this.ctx) return 1;

    const now = Date.now();
    if (now - this.lastPlacementTime > 2500) {
      this.placementStreak = 1;
    } else {
      this.placementStreak = Math.min(this.placementStreak + 1, 6);
    }
    this.lastPlacementTime = now;

    if (this.placementResetTimer) {
      clearTimeout(this.placementResetTimer);
    }
    this.placementResetTimer = window.setTimeout(() => {
      this.placementStreak = 0;
    }, 2500);

    const pitchLadder = [
      261.63, // 1: C4
      293.66, // 2: D4
      329.63, // 3: E4
      392.00, // 4: G4
      440.00, // 5: A4
      523.25  // 6: C5
    ];

    const noteFreq = pitchLadder[this.placementStreak - 1] || 261.63;
    const ctxTime = this.ctx.currentTime;

    // 1. Crisp tactile snap click
    const clickOsc = this.ctx.createOscillator();
    const clickGain = this.ctx.createGain();
    clickOsc.type = 'sine';
    clickOsc.frequency.setValueAtTime(420, ctxTime);
    clickOsc.frequency.exponentialRampToValueAtTime(140, ctxTime + 0.05);

    clickGain.gain.setValueAtTime(0.28, ctxTime);
    clickGain.gain.exponentialRampToValueAtTime(0.01, ctxTime + 0.05);

    clickOsc.connect(clickGain);
    clickGain.connect(this.ctx.destination);
    clickOsc.start(ctxTime);
    clickOsc.stop(ctxTime + 0.05);

    // 2. Resonant musical note
    const noteOsc = this.ctx.createOscillator();
    const noteGain = this.ctx.createGain();
    noteOsc.type = 'triangle';
    noteOsc.frequency.setValueAtTime(noteFreq, ctxTime);

    noteGain.gain.setValueAtTime(0.22, ctxTime);
    noteGain.gain.exponentialRampToValueAtTime(0.001, ctxTime + 0.16);

    noteOsc.connect(noteGain);
    noteGain.connect(this.ctx.destination);
    noteOsc.start(ctxTime);
    noteOsc.stop(ctxTime + 0.16);

    return this.placementStreak;
  }

  public resetPlacementStreak() {
    this.placementStreak = 0;
    this.lastPlacementTime = 0;
    if (this.placementResetTimer) {
      clearTimeout(this.placementResetTimer);
      this.placementResetTimer = null;
    }
  }

  /**
   * Subtle pickup sound on drag start.
   */
  public playPickupSound() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(240, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(480, this.ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  /**
   * Gentle thud when a piece is dropped invalidly and springs back.
   */
  public playInvalidSound() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(160, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.08);
  }

  /**
   * Pop / bell sound on line clear.
   */
  public playLineClearSound(comboCount: number = 1) {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    const baseFreq = 440 * Math.pow(1.2, Math.min(comboCount, 5));
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(baseFreq, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.8, this.ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.18);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.18);
  }

  /**
   * Melodic appreciation chords for line clears & combos:
   * - Level 1 (1 line): Crisp chime (C5 -> G5)
   * - Level 2 (Combo x2): Major triad (C5, E5, G5)
   * - Level 3 (Combo x3): Major triad + Octave (C5, E5, G5, C6)
   * - Level 4+ (Combo x4+): Major triad + Octave + Sparkle Bell Shimmer (C6, E6, G6 with resonant overtone)
   */
  public playAppreciationSound(level: number = 1) {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    let notes: { freq: number; type: OscillatorType; gainVal: number; duration: number }[];

    if (level === 1) {
      notes = [
        { freq: 523.25, type: 'sine', gainVal: 0.22, duration: 0.2 },
        { freq: 783.99, type: 'triangle', gainVal: 0.28, duration: 0.3 }
      ];
    } else if (level === 2) {
      // Combo x2: Major Triad
      notes = [
        { freq: 523.25, type: 'triangle', gainVal: 0.26, duration: 0.35 },
        { freq: 659.25, type: 'triangle', gainVal: 0.26, duration: 0.35 },
        { freq: 783.99, type: 'triangle', gainVal: 0.30, duration: 0.40 }
      ];
    } else if (level === 3) {
      // Combo x3: Major Triad + Octave
      notes = [
        { freq: 523.25, type: 'triangle', gainVal: 0.24, duration: 0.38 },
        { freq: 659.25, type: 'triangle', gainVal: 0.24, duration: 0.38 },
        { freq: 783.99, type: 'triangle', gainVal: 0.28, duration: 0.42 },
        { freq: 1046.5, type: 'sine', gainVal: 0.32, duration: 0.48 }
      ];
    } else {
      // Combo x4+: Grand Triad + Octave + Sparkle Bell Layer
      notes = [
        { freq: 523.25, type: 'triangle', gainVal: 0.22, duration: 0.45 },
        { freq: 659.25, type: 'triangle', gainVal: 0.22, duration: 0.45 },
        { freq: 783.99, type: 'triangle', gainVal: 0.26, duration: 0.48 },
        { freq: 1046.5, type: 'triangle', gainVal: 0.30, duration: 0.52 },
        { freq: 1318.51, type: 'sine', gainVal: 0.20, duration: 0.55 }, // Sparkle E6
        { freq: 1567.98, type: 'sine', gainVal: 0.25, duration: 0.60 }  // Sparkle G6
      ];
    }

    const now = this.ctx.currentTime;
    notes.forEach((item, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = now + idx * 0.05;

      osc.type = item.type;
      osc.frequency.setValueAtTime(item.freq, startTime);

      gain.gain.setValueAtTime(item.gainVal, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + item.duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + item.duration);
    });
  }

  /**
   * Rewarding chord for multi-line combos scaling with combo level.
   */
  public playComboSound(level: number = 2) {
    this.playAppreciationSound(level);
  }

  /**
   * Subtle low-frequency warning hum for near-loss 95% full grid.
   */
  public playDangerWarningSound() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(110, now);
    osc.frequency.linearRampToValueAtTime(85, now + 0.3);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.3);
  }

  /**
   * Soft UI button tap.
   */
  public playButtonClick() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.04);
  }

  /**
   * Game Over Audio Cue:
   * Very short (1.0s) descending bell notes: C5 (523.25) -> A4 (440.00) -> E4 (329.63), then complete silence.
   */
  public playGameOverSound() {
    this.stopAmbientSoundscape();
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    const notes = [
      { freq: 523.25, timeOffset: 0.0, dur: 0.35 },  // C5
      { freq: 440.00, timeOffset: 0.25, dur: 0.35 }, // A4
      { freq: 329.63, timeOffset: 0.50, dur: 0.45 }  // E4
    ];

    const now = this.ctx.currentTime;
    notes.forEach((n) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const start = now + n.timeOffset;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(n.freq, start);

      gain.gain.setValueAtTime(0.24, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + n.dur);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(start);
      osc.stop(start + n.dur);
    });
  }
}
