import type { Board, Mark, Outcome, WinLine } from './types';

export const EMPTY_BOARD: Board = Object.freeze(Array(9).fill(null));

export const WIN_LINES: readonly WinLine[] = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
  [0, 4, 8], [2, 4, 6],          // diagonals
];

export const otherMark = (m: Mark): Mark => (m === 'X' ? 'O' : 'X');

/**
 * Evaluates the outcome of a board.
 * Win check always runs before tie check (FR-4: a 9th move completing a line is a win).
 */
export function getOutcome(board: Board): Outcome {
  for (const line of WIN_LINES) {
    const [a, b, c] = line;
    const m = board[a];
    if (m && m === board[b] && m === board[c]) {
      return { status: 'win', winner: m, line };
    }
  }
  return board.every((c) => c !== null) ? { status: 'tie' } : { status: 'in_progress' };
}

/** Returns the indices of all empty cells. */
export const legalMoves = (board: Board): number[] =>
  board.flatMap((c, i) => (c === null ? [i] : []));

/**
 * Returns a new board with the mark placed.
 * Throws an Error on illegal moves (out of bounds or already occupied).
 */
export function applyMove(board: Board, index: number, mark: Mark): Board {
  if (index < 0 || index > 8 || board[index] !== null) {
    throw new Error(`Illegal move at index ${index}`);
  }
  const next = board.slice();
  next[index] = mark;
  return Object.freeze(next);
}

/**
 * Finds a cell where placing `mark` immediately completes a 3-in-a-row win.
 * Returns the cell index or null if none exists.
 */
export function findCompletingMove(board: Board, mark: Mark): number | null {
  for (const i of legalMoves(board)) {
    if (getOutcome(applyMove(board, i, mark)).status === 'win') {
      return i;
    }
  }
  return null;
}

