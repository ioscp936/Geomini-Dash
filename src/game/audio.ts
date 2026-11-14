/**
 * Procedural Web Audio API Sound Synthesizer & EDM Music Engine.
 * 100% zero-asset, procedural synthesis for iconic Geometry Dash EDM tracks:
 * - "Stereo Madness" by ForeverBound
 * - "Back On Track" by DJVI
 * - "Polargeist" by Step
 * - "Deadlocked" by F-777
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private musicVolume: number = 0.55;
  private sfxVolume: number = 0.75;
  private musicMasterGain: GainNode | null = null;
  private sfxMasterGain: GainNode | null = null;

  // Music loop state
  private isMusicPlaying: boolean = false;
  private currentBpm: number = 130;
  private nextNoteTime: number = 0;
  private currentStep: number = 0;
  private timerId: number | null = null;
  private beatCallbacks: Array<(beatIndex: number) => void> = [];
  private currentSongId: string = 'stereo_madness';

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.musicMasterGain = this.ctx.createGain();
      this.musicMasterGain.gain.value = this.isMuted ? 0 : this.musicVolume;
      this.musicMasterGain.connect(this.ctx.destination);

      this.sfxMasterGain = this.ctx.createGain();
      this.sfxMasterGain.gain.value = this.isMuted ? 0 : this.sfxVolume;
      this.sfxMasterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public onBeat(callback: (beatIndex: number) => void) {
    this.beatCallbacks.push(callback);
    return () => {
      this.beatCallbacks = this.beatCallbacks.filter((cb) => cb !== callback);
    };
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.musicMasterGain) {
      this.musicMasterGain.gain.value = muted ? 0 : this.musicVolume;
    }
    if (this.sfxMasterGain) {
      this.sfxMasterGain.gain.value = muted ? 0 : this.sfxVolume;
    }
  }

  public getMuted() {
    return this.isMuted;
  }

  public setVolume(volume: number) {
    this.musicVolume = volume;
    this.sfxVolume = volume;
    if (!this.isMuted) {
      if (this.musicMasterGain) this.musicMasterGain.gain.value = volume;
      if (this.sfxMasterGain) this.sfxMasterGain.gain.value = volume;
    }
  }

  // --- Sound Effects ---

  public playJump() {
    this.initContext();
    if (!this.ctx || !this.sfxMasterGain || this.isMuted) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const t = this.ctx.currentTime;

    osc.type = 'square';
    osc.frequency.setValueAtTime(150, t);
    osc.frequency.exponentialRampToValueAtTime(440, t + 0.12);

    gain.gain.setValueAtTime(0.32, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);

    osc.connect(gain);
    gain.connect(this.sfxMasterGain);

    osc.start(t);
    osc.stop(t + 0.15);
  }

  public playPadBounce(type: string = 'yellow') {
    this.initContext();
    if (!this.ctx || !this.sfxMasterGain || this.isMuted) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const t = this.ctx.currentTime;

    osc.type = 'sawtooth';
    const baseFreq = type === 'yellow' ? 220 : type === 'pink' ? 300 : 400;
    osc.frequency.setValueAtTime(baseFreq, t);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 2.8, t + 0.22);

    gain.gain.setValueAtTime(0.42, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

    osc.connect(gain);
    gain.connect(this.sfxMasterGain);

    osc.start(t);
    osc.stop(t + 0.25);
  }

  public playOrbHit(type: string = 'yellow') {
    this.initContext();
    if (!this.ctx || !this.sfxMasterGain || this.isMuted) return;

    const t = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'triangle';
    osc2.type = 'sine';

    let freq = 523.25; // C5
    if (type === 'orb_pink') freq = 659.25; // E5
    if (type === 'orb_blue') freq = 783.99; // G5
    if (type === 'orb_black') freq = 130.81; // C3

    osc1.frequency.setValueAtTime(freq, t);
    osc2.frequency.setValueAtTime(freq * 1.5, t);

    gain.gain.setValueAtTime(0.45, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.sfxMasterGain);

    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + 0.3);
    osc2.stop(t + 0.3);
  }

  public playPortalWarp() {
    this.initContext();
    if (!this.ctx || !this.sfxMasterGain || this.isMuted) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(320, t);
    osc.frequency.exponentialRampToValueAtTime(950, t + 0.15);
    osc.frequency.exponentialRampToValueAtTime(160, t + 0.35);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200, t);
    filter.Q.value = 4.0;

    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxMasterGain);

    osc.start(t);
    osc.stop(t + 0.36);
  }

  public playGravityFlip() {
    this.initContext();
    if (!this.ctx || !this.sfxMasterGain || this.isMuted) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(260, t);
    osc.frequency.exponentialRampToValueAtTime(700, t + 0.18);

    gain.gain.setValueAtTime(0.38, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

    osc.connect(gain);
    gain.connect(this.sfxMasterGain);

    osc.start(t);
    osc.stop(t + 0.21);
  }

  public playCoinCollect() {
    this.initContext();
    if (!this.ctx || !this.sfxMasterGain || this.isMuted) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(987.77, t); // B5
    osc.frequency.setValueAtTime(1318.51, t + 0.08); // E6

    gain.gain.setValueAtTime(0.45, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

    osc.connect(gain);
    gain.connect(this.sfxMasterGain);

    osc.start(t);
    osc.stop(t + 0.36);
  }

  public playCheckpoint() {
    this.initContext();
    if (!this.ctx || !this.sfxMasterGain || this.isMuted) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(587.33, t); // D5
    osc.frequency.exponentialRampToValueAtTime(880.0, t + 0.1); // A5

    gain.gain.setValueAtTime(0.32, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

    osc.connect(gain);
    gain.connect(this.sfxMasterGain);

    osc.start(t);
    osc.stop(t + 0.16);
  }

  public playShieldDeflect() {
    this.initContext();
    if (!this.ctx || !this.sfxMasterGain || this.isMuted) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(440, t);
    osc.frequency.exponentialRampToValueAtTime(880, t + 0.12);

    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

    osc.connect(gain);
    gain.connect(this.sfxMasterGain);

    osc.start(t);
    osc.stop(t + 0.2);
  }

  public playDeath() {
    // Silent on death per user request (removes harsh explosion sound on respawn)
  }

  public playVictory() {
    this.initContext();
    if (!this.ctx || !this.sfxMasterGain || this.isMuted) return;

    const notes = [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5, 1318.5]; // C5, E5, G5, C6, G5, C6, E6
    const t = this.ctx.currentTime;
    notes.forEach((freq, i) => {
      if (!this.ctx || !this.sfxMasterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const noteTime = t + i * 0.1;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.4, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.25);

      osc.connect(gain);
      gain.connect(this.sfxMasterGain);

      osc.start(noteTime);
      osc.stop(noteTime + 0.26);
    });
  }

  // --- Procedural Iconic Geometry Dash EDM Synth Engine ---

  public startMusic(songId: string = 'stereo_madness', bpm: number = 130) {
    this.initContext();
    this.currentSongId = songId;
    this.currentBpm = bpm;

    if (this.isMusicPlaying) {
      this.stopMusic();
    }

    if (!this.ctx) return;

    this.isMusicPlaying = true;
    this.currentStep = 0;
    this.nextNoteTime = this.ctx.currentTime + 0.05;

    this.scheduleNotes();
  }

  public stopMusic() {
    this.isMusicPlaying = false;
    if (this.timerId !== null) {
      window.clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  private scheduleNotes = () => {
    if (!this.isMusicPlaying || !this.ctx || !this.musicMasterGain) return;

    const secondsPer16th = 60.0 / this.currentBpm / 4;
    const lookahead = 0.15; // 150ms lookahead

    while (this.nextNoteTime < this.ctx.currentTime + lookahead) {
      this.playPatternStep(this.currentStep, this.nextNoteTime);
      // Emit beat event on quarter notes (every 4 16ths)
      if (this.currentStep % 4 === 0) {
        const beatIndex = Math.floor(this.currentStep / 4);
        this.beatCallbacks.forEach((cb) => cb(beatIndex));
      }
      this.nextNoteTime += secondsPer16th;
      this.currentStep = (this.currentStep + 1) % 64; // 4-bar loop (16 * 4)
    }

    this.timerId = window.setTimeout(this.scheduleNotes, 40);
  };

  private playPatternStep(step: number, time: number) {
    if (!this.ctx || !this.musicMasterGain || this.isMuted) return;

    const bar = Math.floor(step / 16);
    const sub = step % 16;
    const id = this.currentSongId;

    // =========================================================================
    // 1. UNIQUE PERCUSSION & DRUM PATTERNS FOR EACH TRACK
    // =========================================================================

    // Kick patterns tailored per genre
    let shouldKick = false;
    let kickPitch = 160;
    let kickEndPitch = 38;
    let kickGainVal = 0.75;
    let kickDuration = 0.13;

    if (id === 'clubstep') {
      // Dark half-time dubstep kick
      shouldKick = sub === 0 || sub === 10;
      kickPitch = 140;
      kickEndPitch = 30;
      kickGainVal = 0.85;
      kickDuration = 0.18;
    } else if (id === 'cycles') {
      // Drum & Bass syncopated kick
      shouldKick = sub === 0 || sub === 10;
      kickPitch = 170;
      kickEndPitch = 42;
      kickGainVal = 0.8;
    } else if (id === 'base_after_base') {
      // 808 deep boom kick
      shouldKick = sub === 0 || sub === 8 || sub === 10;
      kickPitch = 130;
      kickEndPitch = 28;
      kickGainVal = 0.82;
      kickDuration = 0.22;
    } else if (id === 'polargeist') {
      // Funky syncopated electro kick
      shouldKick = sub === 0 || sub === 6 || sub === 10 || sub === 12;
      kickPitch = 165;
    } else if (id === 'clutterfunk') {
      // Chaotic funk kick
      shouldKick = sub === 0 || sub === 6 || sub === 8 || sub === 14;
      kickPitch = 180;
    } else if (id === 'xstep') {
      // Glitch electro kick
      shouldKick = sub === 0 || sub === 3 || sub === 8 || sub === 11;
    } else if (id === 'deadlocked') {
      // Speedcore driving kicks
      shouldKick = sub % 2 === 0;
      kickPitch = 175;
      kickGainVal = 0.78;
    } else if (id === 'cant_let_go') {
      // Four on the floor + rapid double kick fill
      shouldKick = sub % 4 === 0 || sub === 14 || sub === 15;
    } else {
      // Classic 4-on-the-floor electro
      shouldKick = sub % 4 === 0;
    }

    if (shouldKick) {
      const kickOsc = this.ctx.createOscillator();
      const kickGain = this.ctx.createGain();

      kickOsc.type = 'sine';
      kickOsc.frequency.setValueAtTime(kickPitch, time);
      kickOsc.frequency.exponentialRampToValueAtTime(kickEndPitch, time + 0.08);

      kickGain.gain.setValueAtTime(kickGainVal, time);
      kickGain.gain.exponentialRampToValueAtTime(0.001, time + kickDuration);

      kickOsc.connect(kickGain);
      kickGain.connect(this.musicMasterGain);

      kickOsc.start(time);
      kickOsc.stop(time + kickDuration + 0.01);
    }

    // Snare / Clap patterns tailored per genre
    let shouldSnare = false;
    let snareFilterFreq = 1200;
    let snareGainVal = 0.42;

    if (id === 'clubstep') {
      // Massive dubstep snare on beat 8
      shouldSnare = sub === 8;
      snareFilterFreq = 950;
      snareGainVal = 0.65;
    } else if (id === 'cycles') {
      // DnB snare on 4, 12 with ghost tap on 7
      shouldSnare = sub === 4 || sub === 7 || sub === 12;
      snareGainVal = sub === 7 ? 0.2 : 0.45;
    } else if (id === 'clutterfunk') {
      // Funky syncopated snare on 4, 10, 12
      shouldSnare = sub === 4 || sub === 10 || sub === 12;
      snareGainVal = sub === 10 ? 0.25 : 0.44;
    } else if (id === 'deadlocked') {
      // Snare on 4, 12, plus fill on 14, 15 at end of 4-bar
      shouldSnare = sub === 4 || sub === 12 || (bar === 3 && (sub === 14 || sub === 15));
      snareGainVal = 0.48;
    } else {
      shouldSnare = sub === 4 || sub === 12;
    }

    if (shouldSnare) {
      const noiseBuffer = this.ctx.createBuffer(1, Math.floor(this.ctx.sampleRate * 0.12), this.ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (data.length * 0.35));
      }
      const snareNoise = this.ctx.createBufferSource();
      snareNoise.buffer = noiseBuffer;

      const snareFilter = this.ctx.createBiquadFilter();
      snareFilter.type = 'highpass';
      snareFilter.frequency.setValueAtTime(snareFilterFreq, time);

      const snareGain = this.ctx.createGain();
      snareGain.gain.setValueAtTime(snareGainVal, time);
      snareGain.gain.exponentialRampToValueAtTime(0.001, time + 0.11);

      snareNoise.connect(snareFilter);
      snareFilter.connect(snareGain);
      snareGain.connect(this.musicMasterGain);

      snareNoise.start(time);
      snareNoise.stop(time + 0.12);
    }

    // Hi-hat patterns
    let shouldHat = false;
    if (id === 'time_machine' || id === 'dry_out' || id === 'deadlocked' || id === 'back_on_track') {
      // Driving 16th hats
      shouldHat = true;
    } else if (id === 'base_after_base') {
      // Triplet hats
      shouldHat = sub % 3 === 0;
    } else {
      // Offbeat 8th hats
      shouldHat = sub % 4 === 2;
    }

    if (shouldHat) {
      const buffer = this.ctx.createBuffer(1, Math.floor(this.ctx.sampleRate * 0.035), this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
      const hhSrc = this.ctx.createBufferSource();
      hhSrc.buffer = buffer;

      const hhFilter = this.ctx.createBiquadFilter();
      hhFilter.type = 'highpass';
      hhFilter.frequency.setValueAtTime(id === 'deadlocked' || id === 'time_machine' ? 9500 : 8000, time);

      const hhGain = this.ctx.createGain();
      const hatVolume = sub % 4 === 2 ? 0.22 : 0.12;
      hhGain.gain.setValueAtTime(hatVolume, time);
      hhGain.gain.exponentialRampToValueAtTime(0.001, time + 0.03);

      hhSrc.connect(hhFilter);
      hhFilter.connect(hhGain);
      hhGain.connect(this.musicMasterGain);

      hhSrc.start(time);
      hhSrc.stop(time + 0.035);
    }

    // =========================================================================
    // 2. DISTINCT BASSLINES FOR EACH TRACK
    // =========================================================================
    let bassChords = [65.41, 77.78, 87.31, 58.27]; // C2, Eb2, F2, Bb1 (Stereo Madness)
    let bassOscType: OscillatorType = 'sawtooth';
    let bassFilterFreq = 650;

    if (id === 'back_on_track') {
      bassChords = [87.31, 58.27, 65.41, 73.42]; // F2, Bb1, C2, D2
      bassOscType = 'triangle';
      bassFilterFreq = 800;
    } else if (id === 'polargeist') {
      bassChords = [48.99, 58.27, 65.41, 73.42]; // G1, Bb1, C2, D2
      bassOscType = 'sawtooth';
      bassFilterFreq = 750;
    } else if (id === 'dry_out') {
      bassChords = [73.42, 65.41, 55.0, 73.42]; // D2, C2, A1, D2
      bassOscType = 'sawtooth';
      bassFilterFreq = 1100; // Acid 303 bite
    } else if (id === 'base_after_base') {
      bassChords = [58.27, 46.25, 51.91, 43.65]; // Bb1, F#1, Ab1, F1 (Deep 808)
      bassOscType = 'sine';
      bassFilterFreq = 400;
    } else if (id === 'cant_let_go') {
      bassChords = [77.78, 65.41, 51.91, 58.27]; // Eb2, C2, Ab1, Bb1
      bassOscType = 'sawtooth';
      bassFilterFreq = 850;
    } else if (id === 'jumper') {
      bassChords = [98.0, 61.74, 65.41, 73.42]; // G2, B1, C2, D2
      bassOscType = 'square'; // 8-bit chiptune
      bassFilterFreq = 900;
    } else if (id === 'time_machine') {
      bassChords = [55.0, 65.41, 73.42, 82.41]; // A1, C2, D2, E2
      bassOscType = 'sawtooth';
      bassFilterFreq = 950;
    } else if (id === 'cycles') {
      bassChords = [43.65, 51.91, 58.27, 69.3]; // F1, Ab1, Bb1, Db2 (DnB Reese)
      bassOscType = 'sawtooth';
      bassFilterFreq = 800;
    } else if (id === 'xstep') {
      bassChords = [41.2, 48.99, 55.0, 61.74]; // E1, G1, A1, B1
      bassOscType = 'sawtooth';
      bassFilterFreq = 1000;
    } else if (id === 'clutterfunk') {
      bassChords = [65.41, 61.74, 58.27, 55.0]; // C2, B1, Bb1, A1
      bassOscType = 'square';
      bassFilterFreq = 920;
    } else if (id === 'theory_of_everything') {
      bassChords = [73.42, 58.27, 87.31, 65.41]; // D2, Bb1, F2, C2
      bassOscType = 'sawtooth';
      bassFilterFreq = 850;
    } else if (id === 'clubstep') {
      bassChords = [46.25, 41.2, 36.71, 46.25]; // F#1, E1, D1, F#1 (Dark Demon)
      bassOscType = 'sawtooth';
      bassFilterFreq = 1200;
    } else if (id === 'deadlocked') {
      bassChords = [36.71, 43.65, 48.99, 58.27]; // D1, F1, G1, Bb1 (Speedcore)
      bassOscType = 'sawtooth';
      bassFilterFreq = 1350;
    }

    const chordRoot = bassChords[bar % bassChords.length];

    // Bass rhythm triggers
    let shouldPlayBass = false;
    let octaveMultiplier = 1;

    if (id === 'time_machine' || id === 'deadlocked') {
      // Rolling 16th trance / speed bass
      shouldPlayBass = true;
      octaveMultiplier = sub % 4 === 0 ? 1 : sub % 4 === 2 ? 2 : 1;
    } else if (id === 'base_after_base') {
      // Sustained sub bass on strong beats
      shouldPlayBass = sub === 0 || sub === 8;
    } else {
      // Bouncy 8th note bass
      shouldPlayBass = sub % 2 === 0;
      octaveMultiplier = sub % 4 === 2 ? 2 : 1;
    }

    if (shouldPlayBass) {
      const bassOsc = this.ctx.createOscillator();
      const bassFilter = this.ctx.createBiquadFilter();
      const bassGain = this.ctx.createGain();

      bassOsc.type = bassOscType;
      bassOsc.frequency.setValueAtTime(chordRoot * octaveMultiplier, time);

      bassFilter.type = 'lowpass';
      bassFilter.frequency.setValueAtTime(bassFilterFreq, time);
      bassFilter.frequency.exponentialRampToValueAtTime(120, time + 0.12);

      const bassVol = id === 'base_after_base' ? 0.55 : 0.42;
      bassGain.gain.setValueAtTime(bassVol, time);
      bassGain.gain.exponentialRampToValueAtTime(0.001, time + 0.13);

      bassOsc.connect(bassFilter);
      bassFilter.connect(bassGain);
      bassGain.connect(this.musicMasterGain);

      bassOsc.start(time);
      bassOsc.stop(time + 0.14);
    }

    // =========================================================================
    // 3. ICONIC LEAD SYNTH MELODIES & PHRASING FOR EACH LEVEL
    // =========================================================================
    let leadNotes: number[];
    let melodyPattern: number[];
    let leadOscType: OscillatorType = 'sawtooth';
    let leadVolume = 0.15;
    let leadDuration = 0.085;

    if (id === 'back_on_track') {
      // Joyful DJVI ascending arpeggio synth
      leadNotes = [349.23, 440.0, 523.25, 587.33, 659.25, 698.46, 880.0];
      melodyPattern = [0, 2, 3, 5, 4, 3, 2, 0, 1, 2, 3, 4, 3, 2, 1, 2];
      leadOscType = 'triangle';
      leadVolume = 0.18;
      leadDuration = 0.11;
    } else if (id === 'polargeist') {
      // Bouncy funky Step motif
      leadNotes = [392.0, 466.16, 523.25, 587.33, 783.99, 932.33];
      melodyPattern = [0, 0, -1, 2, 3, -1, 0, 2, 4, -1, 3, 2, 1, 1, 3, 4];
      leadOscType = 'square';
      leadVolume = 0.14;
    } else if (id === 'dry_out') {
      // Exotic Arabian minor pentatonic
      leadNotes = [293.66, 329.63, 349.23, 415.3, 440.0, 523.25, 587.33];
      melodyPattern = [0, 2, 4, -1, 3, 2, 0, -1, 4, 5, 6, 5, 4, -1, 3, 2];
      leadOscType = 'sawtooth';
      leadVolume = 0.16;
    } else if (id === 'base_after_base') {
      // Melancholic atmospheric theme
      leadNotes = [233.08, 277.18, 311.13, 349.23, 415.3, 466.16];
      melodyPattern = [0, -1, 2, 3, 5, -1, 4, 3, 2, -1, 1, 0, 2, -1, -1, -1];
      leadOscType = 'sawtooth';
      leadVolume = 0.16;
      leadDuration = 0.14;
    } else if (id === 'cant_let_go') {
      // Aggressive dramatic stabs
      leadNotes = [311.13, 349.23, 392.0, 466.16, 523.25, 622.25];
      melodyPattern = [0, 2, 3, 5, 3, 2, 0, 2, 3, 4, 3, 2, 0, 2, 3, 5];
      leadOscType = 'sawtooth';
      leadVolume = 0.16;
    } else if (id === 'jumper') {
      // Iconic Waterflame happy chiptune square lead
      leadNotes = [392.0, 440.0, 493.88, 523.25, 587.33, 659.25, 783.99];
      melodyPattern = [0, 2, 4, 6, 5, 4, 5, 6, 4, 2, 0, 2, 4, -1, 2, 0];
      leadOscType = 'square';
      leadVolume = 0.16;
      leadDuration = 0.09;
    } else if (id === 'time_machine') {
      // Epic uplifting trance supersaw
      leadNotes = [440.0, 493.88, 523.25, 587.33, 659.25, 783.99, 880.0];
      melodyPattern = [0, 2, 4, 6, 5, 4, 2, 0, 1, 3, 5, 4, 2, 0, 1, 2];
      leadOscType = 'sawtooth';
      leadVolume = 0.15;
    } else if (id === 'cycles') {
      // Fast DnB synth riffs
      leadNotes = [349.23, 415.3, 466.16, 523.25, 622.25, 698.46];
      melodyPattern = [0, 1, 2, 3, 0, 2, 4, 3, 1, 2, 3, 5, 4, 3, 2, 1];
      leadOscType = 'sawtooth';
      leadVolume = 0.15;
    } else if (id === 'xstep') {
      // Stuttering laser hook
      leadNotes = [329.63, 392.0, 440.0, 493.88, 587.33, 659.25, 783.99];
      melodyPattern = [0, 0, 2, 3, 5, -1, 3, 2, 0, 3, 5, 6, 5, 3, 2, 0];
      leadOscType = 'sawtooth';
      leadVolume = 0.16;
    } else if (id === 'clutterfunk') {
      // Frantic hyper-speed arpeggio funk
      leadNotes = [261.63, 311.13, 369.99, 392.0, 466.16, 523.25, 622.25];
      melodyPattern = [0, 3, 1, 4, 2, 5, 4, 3, 0, 2, 4, 5, 6, 5, 3, 1];
      leadOscType = 'sawtooth';
      leadVolume = 0.15;
    } else if (id === 'theory_of_everything') {
      // Anthemic euphoric melody
      leadNotes = [293.66, 349.23, 392.0, 440.0, 523.25, 587.33, 698.46];
      melodyPattern = [0, 2, 3, 5, 4, 3, 1, 0, 3, 4, 6, 5, 4, 3, 1, 2];
      leadOscType = 'sawtooth';
      leadVolume = 0.16;
      leadDuration = 0.12;
    } else if (id === 'clubstep') {
      // Ominous chromatic demon theme
      leadNotes = [185.0, 220.0, 277.18, 293.66, 329.63, 369.99, 440.0];
      melodyPattern = [0, 2, 3, 2, 0, 1, 3, 2, 0, 4, 5, 4, 3, 2, 1, 0];
      leadOscType = 'sawtooth';
      leadVolume = 0.17;
    } else if (id === 'deadlocked') {
      // F-777 lightning-fast melodic speedcore
      leadNotes = [293.66, 349.23, 392.0, 440.0, 466.16, 523.25, 587.33, 698.46];
      melodyPattern = [0, 3, 5, 3, 0, 4, 6, 4, 1, 3, 5, 7, 6, 5, 3, 2];
      leadOscType = 'sawtooth';
      leadVolume = 0.17;
    } else {
      // Stereo Madness classic ForeverBound theme
      leadNotes = [261.63, 311.13, 349.23, 392.0, 466.16, 523.25, 622.25];
      melodyPattern = [0, -1, 1, 2, 3, -1, 4, -1, 5, -1, 4, 3, 1, -1, 2, 0];
      leadOscType = 'square';
      leadVolume = 0.15;
    }

    const noteIdx = melodyPattern[sub % melodyPattern.length];
    if (noteIdx >= 0) {
      const freq = leadNotes[noteIdx % leadNotes.length];

      const leadOsc = this.ctx.createOscillator();
      const leadGain = this.ctx.createGain();
      leadOsc.type = leadOscType;
      leadOsc.frequency.setValueAtTime(freq, time);

      leadGain.gain.setValueAtTime(leadVolume, time);
      leadGain.gain.exponentialRampToValueAtTime(0.001, time + leadDuration);

      leadOsc.connect(leadGain);
      leadGain.connect(this.musicMasterGain);

      leadOsc.start(time);
      leadOsc.stop(time + leadDuration + 0.01);
    }
  }
}

export const sound = new SoundEngine();
