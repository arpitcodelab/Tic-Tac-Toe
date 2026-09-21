export type Sfx = 'tapUi' | 'placeX' | 'placeO' | 'win' | 'lose' | 'tie';

class AudioService {
  private ctx: AudioContext | null = null;
  enabled = true;

  unlock() {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = this.ctx || new AudioCtx();
        if (this.ctx.state === 'suspended') {
          void this.ctx.resume();
        }
      }
    } catch {
      // Audio unsupported or blocked: stay silent safely
    }
  }

  private tone(freq: number, start: number, dur: number, type: OscillatorType = 'sine', vol = 0.15) {
    if (!this.ctx) return;
    try {
      const t0 = this.ctx.currentTime + start;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, t0);

      gain.gain.setValueAtTime(0.0001, t0);
      gain.gain.exponentialRampToValueAtTime(vol, t0 + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t0);
      osc.stop(t0 + dur + 0.02);
    } catch {
      // Ignore audio errors gracefully
    }
  }

  play(name: Sfx) {
    if (!this.enabled || !this.ctx) return;
    switch (name) {
      case 'tapUi':
        this.tone(520, 0, 0.06, 'triangle', 0.1);
        break;
      case 'placeX':
        this.tone(440, 0, 0.08, 'triangle', 0.15);
        this.tone(560, 0.05, 0.09, 'triangle', 0.15);
        break;
      case 'placeO':
        this.tone(330, 0, 0.1, 'sine', 0.15);
        this.tone(392, 0.05, 0.1, 'sine', 0.15);
        break;
      case 'win':
        [523, 659, 784, 1047].forEach((f, i) => this.tone(f, i * 0.09, 0.22, 'triangle', 0.2));
        break;
      case 'lose':
        [392, 330, 262].forEach((f, i) => this.tone(f, i * 0.14, 0.26, 'sine', 0.2));
        break;
      case 'tie':
        this.tone(392, 0, 0.14, 'sine', 0.15);
        this.tone(392, 0.18, 0.18, 'sine', 0.15);
        break;
    }
  }
}

export const audio = new AudioService();

