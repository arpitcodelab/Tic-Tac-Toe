export async function celebrate() {
  try {
    const { default: confetti } = await import('canvas-confetti');
    confetti({
      particleCount: 90,
      spread: 75,
      origin: { y: 0.65 },
      colors: ['#00F0FF', '#FF007F', '#7928CA', '#FFE600', '#FFFFFF', '#00FFAA'],
      disableForReducedMotion: true,
    });
  } catch {
    // Unsupported or lazy load error: silently continue
  }
}
