import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { safeStorage } from '../services/storage';
import { EMPTY_BOARD, applyMove, getOutcome, otherMark } from '../core/engine';
import { chooseMove } from '../core/ai';
import type { Board, Difficulty, Mark, OpponentId, Outcome } from '../core/types';

export type Phase =
  | 'awaiting_input' // Human's turn, board is interactive
  | 'cpu_thinking'   // CPU delay is active, board locked
  | 'resolving'      // Win line / tie animation playing, board locked
  | 'round_over';    // Result sheet visible

export interface Score {
  p1: number;
  ties: number;
  p2: number;
}

export interface Settings {
  sound: boolean;
  haptics: boolean;
  theme: 'system' | 'light' | 'dark';
}

export interface GameState {
  // Persisted state
  settings: Settings;
  scores: Record<OpponentId, Score>;
  lastOpponent: OpponentId | null;

  // Session / transient state
  screen: 'splash' | 'select' | 'game';
  opponent: OpponentId | null;
  roundNumber: number; // 0-based; even => P1 starts, odd => P2/CPU starts (FR-5)
  board: Board;
  turn: Mark;
  phase: Phase;
  outcome: Outcome;

  // Actions
  startApp: () => void;
  selectOpponent: (o: OpponentId) => void;
  startMatch: (o: OpponentId) => void;
  placeMark: (index: number) => void;
  runCpuTurn: () => void;
  finishResolving: () => void;
  nextRound: () => void;
  resetScores: () => void;
  changeOpponent: () => void;
  toggleSound: () => void;
  setTheme: (theme: 'system' | 'light' | 'dark') => void;
  setHaptics: (enabled: boolean) => void;
}

const DEFAULT_SCORES: Record<OpponentId, Score> = {
  'two-player': { p1: 0, ties: 0, p2: 0 },
  'cpu-easy': { p1: 0, ties: 0, p2: 0 },
  'cpu-medium': { p1: 0, ties: 0, p2: 0 },
  'cpu-hard': { p1: 0, ties: 0, p2: 0 },
  'cpu-expert': { p1: 0, ties: 0, p2: 0 },
};

function getInitialTurnAndPhase(
  opponent: OpponentId,
  roundNumber: number
): { turn: Mark; phase: Phase } {
  // Game 1 (round 0): P1 starts
  // Game 2 (round 1): P2/CPU starts
  const isP1Start = roundNumber % 2 === 0;
  const turn: Mark = isP1Start ? 'X' : 'O';

  if (opponent === 'two-player') {
    return { turn, phase: 'awaiting_input' };
  }

  // Against CPU: P1 is X, CPU is O
  return {
    turn,
    phase: isP1Start ? 'awaiting_input' : 'cpu_thinking',
  };
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      // Persisted defaults
      settings: {
        sound: true,
        haptics: true,
        theme: 'system',
      },
      scores: DEFAULT_SCORES,
      lastOpponent: null,

      // Transient defaults
      screen: 'splash',
      opponent: null,
      roundNumber: 0,
      board: EMPTY_BOARD,
      turn: 'X',
      phase: 'awaiting_input',
      outcome: { status: 'in_progress' },

      startApp: () => {
        set({ screen: 'select' });
      },

      selectOpponent: (opponent: OpponentId) => {
        get().startMatch(opponent);
      },

      startMatch: (opponent: OpponentId) => {
        const roundNumber = 0;
        const { turn, phase } = getInitialTurnAndPhase(opponent, roundNumber);

        set({
          screen: 'game',
          opponent,
          lastOpponent: opponent,
          roundNumber,
          board: EMPTY_BOARD,
          turn,
          phase,
          outcome: { status: 'in_progress' },
        });
      },

      placeMark: (index: number) => {
        const { phase, board, turn, opponent, scores } = get();

        // Only allow placement if awaiting human input and cell is empty
        if (phase !== 'awaiting_input' || board[index] !== null || !opponent) {
          return;
        }

        const newBoard = applyMove(board, index, turn);
        const outcome = getOutcome(newBoard);

        if (outcome.status !== 'in_progress') {
          // Round concluded
          const currentScore = scores[opponent] ?? { p1: 0, ties: 0, p2: 0 };
          const updatedScore: Score = {
            p1: outcome.status === 'win' && outcome.winner === 'X' ? currentScore.p1 + 1 : currentScore.p1,
            p2: outcome.status === 'win' && outcome.winner === 'O' ? currentScore.p2 + 1 : currentScore.p2,
            ties: outcome.status === 'tie' ? currentScore.ties + 1 : currentScore.ties,
          };

          set({
            board: newBoard,
            outcome,
            phase: 'resolving',
            scores: {
              ...scores,
              [opponent]: updatedScore,
            },
          });
          return;
        }

        // Round continues
        const nextTurn = otherMark(turn);
        const isCpuNext = opponent !== 'two-player' && nextTurn === 'O';

        set({
          board: newBoard,
          turn: nextTurn,
          phase: isCpuNext ? 'cpu_thinking' : 'awaiting_input',
        });
      },

      runCpuTurn: () => {
        const { phase, opponent, board, scores } = get();

        if (phase !== 'cpu_thinking' || !opponent || opponent === 'two-player') {
          return;
        }

        const difficulty = opponent.replace('cpu-', '') as Difficulty;
        const move = chooseMove(board, 'O', difficulty);
        const newBoard = applyMove(board, move, 'O');
        const outcome = getOutcome(newBoard);

        if (outcome.status !== 'in_progress') {
          const currentScore = scores[opponent] ?? { p1: 0, ties: 0, p2: 0 };
          const updatedScore: Score = {
            p1: outcome.status === 'win' && outcome.winner === 'X' ? currentScore.p1 + 1 : currentScore.p1,
            p2: outcome.status === 'win' && outcome.winner === 'O' ? currentScore.p2 + 1 : currentScore.p2,
            ties: outcome.status === 'tie' ? currentScore.ties + 1 : currentScore.ties,
          };

          set({
            board: newBoard,
            outcome,
            phase: 'resolving',
            scores: {
              ...scores,
              [opponent]: updatedScore,
            },
          });
          return;
        }

        set({
          board: newBoard,
          turn: 'X',
          phase: 'awaiting_input',
        });
      },

      finishResolving: () => {
        if (get().phase === 'resolving') {
          set({ phase: 'round_over' });
        }
      },

      nextRound: () => {
        const { opponent, roundNumber } = get();
        if (!opponent) return;

        const nextRoundNum = roundNumber + 1;
        const { turn, phase } = getInitialTurnAndPhase(opponent, nextRoundNum);

        set({
          roundNumber: nextRoundNum,
          board: EMPTY_BOARD,
          turn,
          phase,
          outcome: { status: 'in_progress' },
        });
      },

      resetScores: () => {
        const { opponent, scores } = get();
        if (!opponent) return;

        const updatedScores = {
          ...scores,
          [opponent]: { p1: 0, ties: 0, p2: 0 },
        };

        // Reset starter alternation back to P1 (roundNumber = 0)
        const { turn, phase } = getInitialTurnAndPhase(opponent, 0);

        set({
          scores: updatedScores,
          roundNumber: 0,
          board: EMPTY_BOARD,
          turn,
          phase,
          outcome: { status: 'in_progress' },
        });
      },

      changeOpponent: () => {
        set({ screen: 'select' });
      },

      toggleSound: () => {
        set((state) => ({
          settings: {
            ...state.settings,
            sound: !state.settings.sound,
          },
        }));
      },

      setTheme: (theme: 'system' | 'light' | 'dark') => {
        set((state) => ({
          settings: {
            ...state.settings,
            theme,
          },
        }));
      },

      setHaptics: (enabled: boolean) => {
        set((state) => ({
          settings: {
            ...state.settings,
            haptics: enabled,
          },
        }));
      },
    }),
    {
      name: 'ttt:v1',
      storage: createJSONStorage(() => safeStorage),
      partialize: (state) => ({
        settings: state.settings,
        scores: state.scores,
        lastOpponent: state.lastOpponent,
      }),
      version: 1,
      migrate: (persistedState: unknown, version: number) => {
        if (version === 1 && persistedState && typeof persistedState === 'object') {
          return persistedState as Partial<GameState>;
        }
        return {
          settings: { sound: true, haptics: true, theme: 'system' },
          scores: DEFAULT_SCORES,
          lastOpponent: null,
        };
      },
    }
  )
);

