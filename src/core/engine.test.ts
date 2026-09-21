import { describe, it, expect } from 'vitest';
import {
  EMPTY_BOARD,
  WIN_LINES,
  otherMark,
  getOutcome,
  legalMoves,
  applyMove,
  findCompletingMove,
} from './engine';
import type { Board } from './types';

describe('Core Engine', () => {
  it('identifies empty board as in_progress with 9 legal moves', () => {
    expect(EMPTY_BOARD).toHaveLength(9);
    expect(getOutcome(EMPTY_BOARD)).toEqual({ status: 'in_progress' });
    expect(legalMoves(EMPTY_BOARD)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
  });

  it('flips mark correctly', () => {
    expect(otherMark('X')).toBe('O');
    expect(otherMark('O')).toBe('X');
  });

  it('detects all 8 winning lines for both X and O', () => {
    for (const line of WIN_LINES) {
      for (const mark of ['X', 'O'] as const) {
        const board: Array<'X' | 'O' | null> = Array(9).fill(null);
        board[line[0]] = mark;
        board[line[1]] = mark;
        board[line[2]] = mark;

        const outcome = getOutcome(board);
        expect(outcome).toEqual({
          status: 'win',
          winner: mark,
          line,
        });
      }
    }
  });

  it('detects win on the 9th move instead of tie (FR-4)', () => {
    // Board filled on move 9:
    // X O X
    // X X O
    // O X O
    // Here column 1 (indices 1, 4, 7) has [O, X, X] - not a line.
    // Let's create a board where move 9 completes row 3:
    // X O X
    // O O X
    // X X X -> row 3 is winning for X
    const board: Board = [
      'X', 'O', 'X',
      'O', 'O', 'X',
      'X', 'X', 'X',
    ];
    const outcome = getOutcome(board);
    expect(outcome.status).toBe('win');
    if (outcome.status === 'win') {
      expect(outcome.winner).toBe('X');
    }
  });

  it('detects tie when board is full and no lines exist', () => {
    // Standard tie board:
    // X O X
    // X O O
    // O X X
    const tieBoard: Board = [
      'X', 'O', 'X',
      'X', 'O', 'O',
      'O', 'X', 'X',
    ];
    expect(getOutcome(tieBoard)).toEqual({ status: 'tie' });
  });

  it('applies move immutably and preserves original board', () => {
    const next = applyMove(EMPTY_BOARD, 4, 'X');
    expect(next[4]).toBe('X');
    expect(EMPTY_BOARD[4]).toBeNull();
  });

  it('rejects illegal moves (occupied cell or out of bounds)', () => {
    const boardWithMove = applyMove(EMPTY_BOARD, 0, 'X');
    expect(() => applyMove(boardWithMove, 0, 'O')).toThrowError('Illegal move at index 0');
    expect(() => applyMove(EMPTY_BOARD, -1, 'X')).toThrowError('Illegal move at index -1');
    expect(() => applyMove(EMPTY_BOARD, 9, 'X')).toThrowError('Illegal move at index 9');
  });

  it('finds immediate completing win or block moves', () => {
    // Board: X X _ -> move at 2 completes line
    const board: Board = [
      'X', 'X', null,
      'O', null, null,
      'O', null, null,
    ];
    expect(findCompletingMove(board, 'X')).toBe(2);
    expect(findCompletingMove(board, 'O')).toBeNull();

    // Human X is threatening to win at index 2, CPU O can detect it to block
    expect(findCompletingMove(board, 'X')).toBe(2);
  });
});

