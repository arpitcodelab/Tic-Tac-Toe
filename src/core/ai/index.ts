import { findCompletingMove, legalMoves, otherMark } from '../engine';
import { AI_CONFIG } from '../config';
import { bestMoves } from './minimax';
import type { Board, Difficulty, Mark, Rng } from '../types';

const pick = <T>(arr: readonly T[], rng: Rng): T => arr[Math.floor(rng() * arr.length)];

/**
 * Unified AI move selection for all 4 difficulty levels.
 */
export function chooseMove(
  board: Board,
  me: Mark,
  level: Difficulty,
  rng: Rng = Math.random
): number {
  const moves = legalMoves(board);
  if (moves.length === 0) {
    throw new Error('No legal moves available');
  }
  const random = () => pick(moves, rng);
  const win = findCompletingMove(board, me);
  const block = findCompletingMove(board, otherMark(me));

  switch (level) {
    case 'easy':
      return random();

    case 'medium':
      if (win !== null) return win;
      if (block !== null && rng() < AI_CONFIG.mediumBlockChance) return block;
      return random();

    case 'hard': {
      if (rng() < AI_CONFIG.hardBlunderRate) return random();
      if (win !== null) return win;
      if (block !== null) return block;

      const prefs = [4, 0, 2, 6, 8, 1, 3, 5, 7].filter((i) => moves.includes(i));
      // prefer center, then corners (random among available corners), then edges
      if (prefs.includes(4)) return 4;
      const corners = prefs.filter((i) => [0, 2, 6, 8].includes(i));
      return corners.length > 0 ? pick(corners, rng) : pick(prefs, rng);
    }

    case 'expert':
      return pick(bestMoves(board, me), rng);
  }
}

