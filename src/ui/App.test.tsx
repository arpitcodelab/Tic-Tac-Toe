import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import { useGameStore } from '../store/gameStore';

describe('App Router Test', () => {
  it('renders SplashScreen initially and transitions to OpponentSelect on tap', () => {
    useGameStore.setState({ screen: 'splash' });
    render(<App />);

    expect(screen.getByTestId('app-container')).toBeInTheDocument();
    const playBtn = screen.getByRole('button', { name: /tap to play/i });
    expect(playBtn).toBeInTheDocument();

    fireEvent.click(playBtn);
    expect(useGameStore.getState().screen).toBe('select');
  });
});
