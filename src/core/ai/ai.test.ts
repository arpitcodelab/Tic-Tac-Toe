import { describe, it, expect } from 'vitest';
import { chooseMove } from './index';
import { bestMoves } from './minimax';
import { EMPTY_BOARD, applyMove, getOutcome, legalMoves, otherMark } from '../engine';
import type { Board, Mark, Rng } from '../types';

/** Simple deterministic pseudo-random number generator (Mulberry32) for reproducible tests. */
function createSeededRng(seed: number): Rng {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

describe('AI Opponents', () => {
  it('all difficulties always return a legal empty move', () => {
    const board: Board = [
      'X', 'O', null,
      null, 'X', null,
      'O', null, null,
    ];
    const legal = legalMoves(board);
    const rng = createSeededRng(12345);

    for (const level of ['easy', 'medium', 'hard', 'expert'] as const) {
      for (let i = 0; i < 20; i++) {
        const move = chooseMove(board, 'O', level, rng);
        expect(legal).toContain(move);
      }
    }
  });

  it('medium and hard take immediate winning moves', () => {
    // Board: O O _
    const board: Board = [
      'O', 'O', null,
      'X', 'X', null,
      null, null, null,
    ];
    const rng = createSeededRng(42);
    expect(chooseMove(board, 'O', 'medium', rng)).toBe(2);
    expect(chooseMove(board, 'O', 'hard', rng)).toBe(2);
  });

  it('hard always blocks opponent immediate win (when not blundering)', () => {
    // Board: X X _
    const board: Board = [
      'X', 'X', null,
      null, 'O', null,
      null, null, null,
    ];
    // Use an RNG that returns >= AI_CONFIG.hardBlunderRate (0.1) so it doesn't blunder
    const safeRng: Rng = () => 0.5;
    expect(chooseMove(board, 'O', 'hard', safeRng)).toBe(2);
  });

  it('expert never loses: exhaustive game tree exploration', () => {
    // Recursively explores every possible human move response against expert AI.
    // Proves mathematically that Expert loses 0 games starting as X or O.
    function neverLoses(board: Board, turn: Mark, ai: Mark): boolean {
      const outcome = getOutcome(board);
      if (outcome.status === 'win') {
        return outcome.winner === ai;
      }
      if (outcome.status === 'tie') {
        return true;
      }

      if (turn === ai) {
        // AI plays one of its best moves
        const aiMove = bestMoves(board, ai)[0];
        return neverLoses(applyMove(board, aiMove, ai), otherMark(turn), ai);
      } else {
        // Human can play ANY legal move; AI must not lose against all of them
        return legalMoves(board).every((humanMove) =>
          neverLoses(applyMove(board, humanMove, turn), otherMark(turn), ai)
        );
      }
    }

    // Test AI playing as X (going first)
    expect(neverLoses(EMPTY_BOARD, 'X', 'X')).toBe(true);

    // Test AI playing as O (going second)
    expect(neverLoses(EMPTY_BOARD, 'X', 'O')).toBe(true);
  }, 15000);

  it('monte carlo simulation: 1,000 games per difficulty vs random player', () => {
    const simulate1000 = (difficulty: 'easy' | 'medium' | 'hard' | 'expert', seed: number) => {
      const rng = createSeededRng(seed);
      let aiWins = 0;
      let ties = 0;
      let losses = 0;

      for (let game = 0; game < 1000; game++) {
        let board: Board = EMPTY_BOARD;
        const aiMark: Mark = game % 2 === 0 ? 'X' : 'O';
        let currentTurn: Mark = 'X';

        while (true) {
          const outcome = getOutcome(board);
          if (outcome.status === 'win') {
            if (outcome.winner === aiMark) aiWins++;
            else losses++;
            break;
          }
          if (outcome.status === 'tie') {
            ties++;
            break;
          }

          if (currentTurn === aiMark) {
            const move = chooseMove(board, aiMark, difficulty, rng);
            board = applyMove(board, move, aiMark);
          } else {
            // Random opponent
            const moves = legalMoves(board);
            const move = moves[Math.floor(rng() * moves.length)];
            board = applyMove(board, move, currentTurn);
          }
          currentTurn = otherMark(currentTurn);
        }
      }

      return { aiWins, ties, losses };
    };

    const easyStats = simulate1000('easy', 101);
    const mediumStats = simulate1000('medium', 202);
    const hardStats = simulate1000('hard', 303);
    const expertStats = simulate1000('expert', 404);

    // Expert must NEVER lose a single game
    expect(expertStats.losses).toBe(0);

    // Monotonicity check: Easy < Medium < Hard < Expert
    expect(mediumStats.aiWins).toBeGreaterThan(easyStats.aiWins);
    expect(hardStats.aiWins).toBeGreaterThan(mediumStats.aiWins);
    expect(expertStats.aiWins).toBeGreaterThan(hardStats.aiWins);
  }, 30000);
});

