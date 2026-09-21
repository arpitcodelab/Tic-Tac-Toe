export const AI_CONFIG = {
  mediumBlockChance: 0.6,
  hardBlunderRate: 0.1,
  cpuDelayMs: { min: 400, max: 800 },
} as const;

export const MOTION = {
  markDrawMs: 250,
  winLineMs: 400,
  overlayMs: 250,
  resultDelayMs: 700, // wait for win line animation before showing result sheet
} as const;

export const OPPONENTS = [
  { id: 'cpu-easy',   label: 'Easy',      blurb: 'Relaxed and beatable' },
  { id: 'cpu-medium', label: 'Medium',    blurb: 'Watch your step' },
  { id: 'cpu-hard',   label: 'Hard',      blurb: 'Blocks and attacks' },
] as const;

