/**
 * Veyro // Audio & Voice Instructor Engine
 * Synthesizes crisp Web Audio sound cues (countdown pings, start/rest chimes, metronome, fanfare)
 * and controls Web Speech API TTS for dynamic real-time coaching.
 */

class AudioCoach {
  constructor() {
    this.audioCtx = null;
    this.speechSynth = window.speechSynthesis || null;
    this.selectedVoice = null;
    this.speechRate = 1.05;
    this.speechPitch = 1.0;
    this.speechVolume = 1.0;
    
    // Toggles
    this.voiceEnabled = true;
    this.soundFxEnabled = true;
    this.metronomeEnabled = false;

    // Available voices cache
    this.voices = [];
    this.initSpeech();
  }

  // Initialize or resume Web Audio context on user gesture
  ensureAudioContext() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    } else if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  initSpeech() {
    if (!this.speechSynth) return;

    const populateVoices = () => {
      this.voices = this.speechSynth.getVoices();
      if (!this.selectedVoice && this.voices.length > 0) {
        // Prefer natural English voices if available (e.g., Google US English, Samantha, Daniel, Natural)
        const preferred = this.voices.find(v => 
          (v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Daniel') || v.name.includes('Arthur')))
        ) || this.voices.find(v => v.lang.startsWith('en')) || this.voices[0];
        this.selectedVoice = preferred;
      }
    };

    populateVoices();
    if (this.speechSynth.onvoiceschanged !== undefined) {
      this.speechSynth.onvoiceschanged = populateVoices;
    }
  }

  // Speak a coaching cue aloud
  speak(text, priority = false) {
    if (!this.voiceEnabled || !this.speechSynth) return;

    try {
      if (priority) {
        this.speechSynth.cancel(); // Stop talking current phrase to say priority cue
      }

      const utterance = new SpeechSynthesisUtterance(text);
      if (this.selectedVoice) {
        utterance.voice = this.selectedVoice;
      }
      utterance.rate = this.speechRate;
      utterance.pitch = this.speechPitch;
      utterance.volume = this.speechVolume;

      // Small delay on mobile to prevent clipping
      this.speechSynth.speak(utterance);
    } catch (err) {
      console.warn('Speech synthesis error:', err);
    }
  }

  // Stop talking immediately
  stopSpeaking() {
    if (this.speechSynth) {
      this.speechSynth.cancel();
    }
  }

  // Synthesize low/high countdown beeps (3, 2, 1)
  playCountdownBeep(isFinal = false) {
    if (!this.soundFxEnabled) return;
    this.ensureAudioContext();
    if (!this.audioCtx) return;

    try {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = isFinal ? 'triangle' : 'sine';
      // 3, 2, 1 is 587Hz (D5), final "Go!" is 880Hz (A5)
      osc.frequency.setValueAtTime(isFinal ? 880 : 587.33, now);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + (isFinal ? 0.35 : 0.18));

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + (isFinal ? 0.35 : 0.18));
    } catch (e) {
      console.warn(e);
    }
  }

  // Play high energy "WORK START" sound (Crisp dual synth chime)
  playWorkStart() {
    if (!this.soundFxEnabled) return;
    this.ensureAudioContext();
    if (!this.audioCtx) return;

    try {
      const now = this.audioCtx.currentTime;
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);

        gain.gain.setValueAtTime(0.18, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.28);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.3);
      });
    } catch (e) {
      console.warn(e);
    }
  }

  // Play "REST" gentle cooling chime
  playRestChime() {
    if (!this.soundFxEnabled) return;
    this.ensureAudioContext();
    if (!this.audioCtx) return;

    try {
      const now = this.audioCtx.currentTime;
      [659.25, 523.25, 392].forEach((freq, idx) => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.09);

        gain.gain.setValueAtTime(0.16, now + idx * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.4);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(now + idx * 0.09);
        osc.stop(now + idx * 0.09 + 0.42);
      });
    } catch (e) {
      console.warn(e);
    }
  }

  // Metronome tick for pacing cadence
  playMetronomeTick() {
    if (!this.soundFxEnabled || !this.metronomeEnabled) return;
    this.ensureAudioContext();
    if (!this.audioCtx) return;

    try {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, now);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch (e) {
      console.warn(e);
    }
  }

  // Victory fanfare on completion
  playVictoryFanfare() {
    if (!this.soundFxEnabled) return;
    this.ensureAudioContext();
    if (!this.audioCtx) return;

    try {
      const now = this.audioCtx.currentTime;
      // C4, E4, G4, C5, E5, G5 triumph sequence
      const notes = [
        { f: 523.25, d: 0.14, t: 0 },
        { f: 659.25, d: 0.14, t: 0.15 },
        { f: 783.99, d: 0.14, t: 0.30 },
        { f: 1046.50, d: 0.5, t: 0.45 }
      ];

      notes.forEach(n => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(n.f, now + n.t);

        gain.gain.setValueAtTime(0.24, now + n.t);
        gain.gain.exponentialRampToValueAtTime(0.001, now + n.t + n.d);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(now + n.t);
        osc.stop(now + n.t + n.d + 0.05);
      });
    } catch (e) {
      console.warn(e);
    }
  }
}

// Global singleton
window.AudioCoach = new AudioCoach();
