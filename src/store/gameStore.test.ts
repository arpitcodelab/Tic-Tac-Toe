import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from './gameStore';

describe('GameStore State Machine', () => {
  beforeEach(() => {
    // Reset store before each test
    const { startMatch } = useGameStore.getState();
    startMatch('two-player');
    useGameStore.getState().resetScores();
  });

  it('initializes match with P1 starting as X (round 0)', () => {
    const state = useGameStore.getState();
    expect(state.screen).toBe('game');
    expect(state.opponent).toBe('two-player');
    expect(state.roundNumber).toBe(0);
    expect(state.turn).toBe('X');
    expect(state.phase).toBe('awaiting_input');
    expect(state.board.every((c) => c === null)).toBe(true);
  });

  it('alternates starter on nextRound (round 1 starts with O)', () => {
    const { nextRound } = useGameStore.getState();
    nextRound(); // advances to round 1

    const state = useGameStore.getState();
    expect(state.roundNumber).toBe(1);
    expect(state.turn).toBe('O');
    expect(state.phase).toBe('awaiting_input'); // two-player mode, so human O's turn
  });

  it('against CPU on odd round, CPU starts immediately in cpu_thinking phase', () => {
    const { startMatch, nextRound } = useGameStore.getState();
    startMatch('cpu-easy'); // round 0, P1 starts (turn = X, phase = awaiting_input)
    expect(useGameStore.getState().turn).toBe('X');
    expect(useGameStore.getState().phase).toBe('awaiting_input');

    nextRound(); // round 1, CPU starts (turn = O)
    const state = useGameStore.getState();
    expect(state.roundNumber).toBe(1);
    expect(state.turn).toBe('O');
    expect(state.phase).toBe('cpu_thinking');
  });

  it('locks board during cpu_thinking phase (rejects human input)', () => {
    const { startMatch, nextRound, placeMark } = useGameStore.getState();
    startMatch('cpu-easy');
    nextRound(); // phase is cpu_thinking

    placeMark(0); // human tries to tap cell 0
    expect(useGameStore.getState().board[0]).toBeNull(); // move must be rejected
  });

  it('updates scores correctly on win and moves to resolving phase', () => {
    const { placeMark } = useGameStore.getState();
    // 2-player game: P1 (X) wins along top row: 0, 1, 2
    placeMark(0); // X at 0
    placeMark(3); // O at 3
    placeMark(1); // X at 1
    placeMark(4); // O at 4
    placeMark(2); // X at 2 -> Win!

    const state = useGameStore.getState();
    expect(state.phase).toBe('resolving');
    expect(state.outcome).toEqual({
      status: 'win',
      winner: 'X',
      line: [0, 1, 2],
    });
    expect(state.scores['two-player'].p1).toBe(1);
    expect(state.scores['two-player'].p2).toBe(0);
    expect(state.scores['two-player'].ties).toBe(0);
  });

  it('resets only current opponent score and resets starter to P1', () => {
    const { startMatch, placeMark, resetScores } = useGameStore.getState();
    startMatch('cpu-easy');

    // Simulate X win
    placeMark(0); // X
    useGameStore.getState().runCpuTurn(); // CPU moves
    // ... simulate score directly to test reset isolation
    useGameStore.setState((s) => ({
      scores: {
        ...s.scores,
        'cpu-easy': { p1: 3, ties: 1, p2: 2 },
        'cpu-medium': { p1: 5, ties: 0, p2: 1 },
      },
      roundNumber: 4,
    }));

    resetScores();

    const state = useGameStore.getState();
    expect(state.scores['cpu-easy']).toEqual({ p1: 0, ties: 0, p2: 0 });
    expect(state.scores['cpu-medium']).toEqual({ p1: 5, ties: 0, p2: 1 }); // untouched
    expect(state.roundNumber).toBe(0); // starter reset
    expect(state.turn).toBe('X');
  });

  it('toggles sound preference', () => {
    const { toggleSound } = useGameStore.getState();
    const initial = useGameStore.getState().settings.sound;
    toggleSound();
    expect(useGameStore.getState().settings.sound).toBe(!initial);
    toggleSound();
    expect(useGameStore.getState().settings.sound).toBe(initial);
  });
});

