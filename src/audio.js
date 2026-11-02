// Audio Synthesizer & Web Audio API sound effects for WhatsApp & Calls
class SoundEffects {
  constructor() {
    this.ctx = null;
    this.ringInterval = null;
    this.speechSynthesis = window.speechSynthesis;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Sent message whoosh / pop
  playSent() {
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.08);
      
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.09);
    } catch (e) {
      console.warn("Audio playSent error", e);
    }
  }

  // Received message chime
  playReceived() {
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      
      const now = this.ctx.currentTime;
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.setValueAtTime(900, now + 0.07);
      
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(now + 0.26);
    } catch (e) {
      console.warn("Audio playReceived error", e);
    }
  }

  // Incoming call ringtone (simulates WhatsApp ringtone tone)
  startRinging() {
    this.stopRinging();
    this.init();
    if (!this.ctx) return;

    const ringTone = () => {
      try {
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc1.type = 'sine';
        osc2.type = 'sine';
        osc1.frequency.setValueAtTime(440, now); // A4
        osc2.frequency.setValueAtTime(480, now);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.6);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(this.ctx.destination);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 1.6);
        osc2.stop(now + 1.6);
      } catch (err) {
        console.warn("ringTone error", err);
      }
    };

    ringTone();
    this.ringInterval = setInterval(ringTone, 3000);
  }

  stopRinging() {
    if (this.ringInterval) {
      clearInterval(this.ringInterval);
      this.ringInterval = null;
    }
  }

  // Spooky / Creepy static noise during call
  startCallStatic() {
    this.init();
    if (!this.ctx) return () => {};
    try {
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * 0.12;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;
      whiteNoise.loop = true;

      // Filter for eerie low-pass hospital static
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.18, this.ctx.currentTime);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      whiteNoise.start();

      return () => {
        try {
          whiteNoise.stop();
          whiteNoise.disconnect();
        } catch (_) {}
      };
    } catch (e) {
      console.warn("Static sound error", e);
      return () => {};
    }
  }

  // Voice line synthesis for call
  speakVoiceLine(text) {
    if (!this.speechSynthesis) return;
    try {
      this.speechSynthesis.cancel();
      const clean = text.replace(/whispering:/i, '').replace(/whisper:/i, '').replace(/['"]/g, '').trim();
      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.pitch = 0.6; // deeper eerie pitch
      utterance.rate = 0.85; // slower deliberate pace
      utterance.volume = 1.0;
      this.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("Speech synthesis error", e);
    }
  }

  stopSpeech() {
    if (this.speechSynthesis) {
      try {
        this.speechSynthesis.cancel();
      } catch (_) {}
    }
  }
}

export const sounds = new SoundEffects();

