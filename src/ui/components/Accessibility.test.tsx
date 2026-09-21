import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { GameScreen } from '../screens/GameScreen';
import { useGameStore } from '../../store/gameStore';

describe('Accessibility & Keyboard Navigation', () => {
  beforeEach(() => {
    useGameStore.getState().startMatch('two-player');
  });

  it('LiveAnnouncer announces turn and outcomes to screen readers', () => {
    render(<GameScreen />);
    const announcer = screen.getByRole('status');
    expect(announcer).toBeInTheDocument();
    expect(announcer).toHaveClass('sr-only');
    expect(announcer).toHaveTextContent(/X's turn/i);

    // Make a win move inside act
    act(() => {
      useGameStore.setState({
        outcome: { status: 'win', winner: 'X', line: [0, 1, 2] },
      });
    });

    expect(announcer).toHaveTextContent(/Game over. X wins!/i);
  });

  it('keyboard number 1-9 places mark in corresponding cell', () => {
    render(<GameScreen />);
    // Press '5' for center cell (index 4)
    act(() => {
      fireEvent.keyDown(window, { key: '5' });
    });

    expect(useGameStore.getState().board[4]).toBe('X');
  });

  it('escape key closes active modals', () => {
    render(<GameScreen />);
    const menuBtn = screen.getByRole('button', { name: /open menu/i });
    act(() => {
      fireEvent.click(menuBtn);
    });

    expect(screen.getByRole('dialog', { name: /menu/i })).toBeInTheDocument();

    act(() => {
      fireEvent.keyDown(window, { key: 'Escape' });
    });
    expect(screen.queryByRole('dialog', { name: /menu/i })).not.toBeInTheDocument();
  });
});

