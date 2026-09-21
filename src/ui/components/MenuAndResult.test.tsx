import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { GameScreen } from '../screens/GameScreen';
import { useGameStore } from '../../store/gameStore';

describe('Menu, Dialogs & ResultSheet', () => {
  beforeEach(() => {
    useGameStore.getState().startMatch('two-player');
  });

  it('TopBar sound button toggles sound setting', () => {
    render(<GameScreen />);
    const initialSound = useGameStore.getState().settings.sound;

    const soundBtn = screen.getByRole('button', { name: initialSound ? /mute sound/i : /unmute sound/i });
    fireEvent.click(soundBtn);

    expect(useGameStore.getState().settings.sound).toBe(!initialSound);
  });

  it('Hamburger menu opens MenuDrawer and How to Play opens modal', () => {
    render(<GameScreen />);
    const menuBtn = screen.getByRole('button', { name: /open menu/i });
    fireEvent.click(menuBtn);

    expect(screen.getByRole('dialog', { name: /menu/i })).toBeInTheDocument();

    const howToPlayBtn = screen.getByRole('button', { name: /how to play/i });
    fireEvent.click(howToPlayBtn);

    expect(screen.getByRole('dialog', { name: /how to play/i })).toBeInTheDocument();
    expect(screen.getByText(/goal:/i)).toBeInTheDocument();
  });

  it('Reset scores button opens ConfirmDialog and resetting clears current score', () => {
    useGameStore.setState((s) => ({
      scores: {
        ...s.scores,
        'two-player': { p1: 4, ties: 1, p2: 2 },
      },
    }));

    render(<GameScreen />);
    const menuBtn = screen.getByRole('button', { name: /open menu/i });
    fireEvent.click(menuBtn);

    const resetBtn = screen.getByRole('button', { name: /reset scores/i });
    fireEvent.click(resetBtn);

    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    const confirmBtn = screen.getByRole('button', { name: /^reset$/i });
    fireEvent.click(confirmBtn);

    expect(useGameStore.getState().scores['two-player']).toEqual({ p1: 0, ties: 0, p2: 0 });
  });

  it('ResultSheet shows on round over and Play Again starts next round', () => {
    useGameStore.setState({
      phase: 'round_over',
      outcome: { status: 'win', winner: 'X', line: [0, 1, 2] },
    });

    render(<GameScreen />);
    expect(screen.getByRole('dialog', { name: /game outcome/i })).toBeInTheDocument();
    expect(screen.getByText(/player 1 wins!/i)).toBeInTheDocument();

    const playAgainBtn = screen.getByRole('button', { name: /play again/i });
    fireEvent.click(playAgainBtn);

    expect(useGameStore.getState().roundNumber).toBe(1);
    expect(useGameStore.getState().phase).toBe('awaiting_input');
  });
});

