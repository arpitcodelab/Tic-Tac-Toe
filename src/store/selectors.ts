import { useGameStore, type Score } from './gameStore';

export const useActiveScore = (): Score =>
  useGameStore((s) => {
    const opp = s.opponent;
    if (!opp) return { p1: 0, ties: 0, p2: 0 };
    return s.scores[opp] ?? { p1: 0, ties: 0, p2: 0 };
  });

export const useIsHumanTurn = (): boolean =>
  useGameStore((s) => s.phase === 'awaiting_input');

export const useCurrentScreen = () =>
  useGameStore((s) => s.screen);

export const useGamePhase = () =>
  useGameStore((s) => s.phase);

export const useSoundEnabled = () =>
  useGameStore((s) => s.settings.sound);

