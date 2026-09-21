import type { JSX } from 'react';
import { useGameStore } from '../../store/gameStore';

export function LiveAnnouncer(): JSX.Element {
  const outcome = useGameStore((s) => s.outcome);
  const turn = useGameStore((s) => s.turn);
  const phase = useGameStore((s) => s.phase);

  let announcement = '';
  if (outcome.status === 'win') {
    announcement = `Game over. ${outcome.winner} wins!`;
  } else if (outcome.status === 'tie') {
    announcement = "Game over. It's a tie!";
  } else if (phase === 'cpu_thinking') {
    announcement = 'Computer is thinking...';
  } else {
    announcement = `${turn}'s turn.`;
  }

  return (
    <div
      className="sr-only"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      {announcement}
    </div>
  );
}

