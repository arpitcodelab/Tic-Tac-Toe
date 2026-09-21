export const haptics = {
  enabled: true,
  tick() {
    if (this.enabled && typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate?.(10);
      } catch {
        // Silently ignore
      }
    }
  },
  win() {
    if (this.enabled && typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate?.([30, 40, 30, 40, 60]);
      } catch {
        // Silently ignore
      }
    }
  },
};

