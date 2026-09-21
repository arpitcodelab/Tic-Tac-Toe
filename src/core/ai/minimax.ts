import { applyMove, getOutcome, legalMoves, otherMark } from '../engine';
import type { Board, Mark } from '../types';

/** Memoization cache for minimax scores across states. */
const cache = new Map<string, number>();

function getCacheKey(board: Board, turn: Mark, me: Mark): string {
  let s = '';
  for (let i = 0; i < 9; i++) {
    s += board[i] ?? '.';
  }
  return s + turn + me;
}

function score(board: Board, turn: Mark, me: Mark, depth: number): number {
  const o = getOutcome(board);
  if (o.status === 'win') {
    return o.winner === me ? 10 - depth : depth - 10;
  }
  if (o.status === 'tie') {
    return 0;
  }

  const key = getCacheKey(board, turn, me);
  const cached = cache.get(key);
  if (cached !== undefined) {
    return cached;
  }

  const nextMoves = legalMoves(board);
  let best = turn === me ? -Infinity : Infinity;

  for (const i of nextMoves) {
    const nextBoard = applyMove(board, i, turn);
    const s = score(nextBoard, otherMark(turn), me, depth + 1);
    if (turn === me) {
      if (s > best) best = s;
      if (best === 10 - (depth + 1)) break; // alpha-beta cutoff: can't do better than immediate win
    } else {
      if (s < best) best = s;
      if (best === (depth + 1) - 10) break; // cutoff: can't do worse than immediate loss
    }
  }

  cache.set(key, best);
  return best;
}

/**
 * Returns all moves that share the highest score.
 * Uses memoized depth-aware minimax with alpha-beta cutoffs for instant evaluation (< 1ms).
 */
export function bestMoves(board: Board, me: Mark): number[] {
  const moves = legalMoves(board);
  if (moves.length === 0) return [];

  const depth = 9 - moves.length + 1;
  const scored = moves.map((i) => ({
    i,
    s: score(applyMove(board, i, me), otherMark(me), me, depth),
  }));

  const best = Math.max(...scored.map((x) => x.s));
  return scored.filter((x) => x.s === best).map((x) => x.i);
}

