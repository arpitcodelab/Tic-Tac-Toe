import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { GameScreen } from './GameScreen';
import { useGameStore } from '../../store/gameStore';

describe('GameScreen Component', () => {
  beforeEach(() => {
    useGameStore.getState().startMatch('two-player');
  });

  it('renders 9 cells on the board and scoreboard', () => {
    render(<GameScreen />);
    const cells = screen.getAllByRole('gridcell');
    expect(cells).toHaveLength(9);
    expect(screen.getByLabelText(/scoreboard/i)).toBeInTheDocument();
  });

  it('allows human to place a mark by clicking empty cell', () => {
    render(<GameScreen />);
    const cells = screen.getAllByRole('gridcell');
    fireEvent.click(cells[0]);

    expect(useGameStore.getState().board[0]).toBe('X');
  });

  it('rejects click on already occupied cell', () => {
    render(<GameScreen />);
    const cells = screen.getAllByRole('gridcell');
    fireEvent.click(cells[0]); // X at 0
    expect(useGameStore.getState().board[0]).toBe('X');

    fireEvent.click(cells[0]); // try clicking 0 again
    expect(useGameStore.getState().board[0]).toBe('X');
  });
});

