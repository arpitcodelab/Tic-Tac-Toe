import type { JSX } from 'react';
import type { Mark, OpponentId } from '../../core/types';
import type { Phase } from '../../store/gameStore';

interface TurnIndicatorProps {
  turn: Mark;
  phase: Phase;
  opponent: OpponentId | null;
}

export function TurnIndicator({ turn, phase, opponent }: TurnIndicatorProps): JSX.Element {
  let message = '';
  let markColor = 'var(--text)';
  let glowColor = 'rgba(255, 255, 255, 0.3)';
  let borderColor = 'rgba(255, 255, 255, 0.2)';

  if (phase === 'cpu_thinking') {
    message = 'Computer is thinking...';
    markColor = 'var(--win)';
    glowColor = 'rgba(255, 230, 0, 0.4)';
    borderColor = 'rgba(255, 230, 0, 0.6)';
  } else if (opponent === 'two-player') {
    message = turn === 'X' ? "Player 1's turn (X)" : "Player 2's turn (O)";
    markColor = turn === 'X' ? 'var(--x)' : 'var(--o)';
    glowColor = turn === 'X' ? 'rgba(0, 240, 255, 0.35)' : 'rgba(255, 0, 127, 0.35)';
    borderColor = turn === 'X' ? 'rgba(0, 240, 255, 0.5)' : 'rgba(255, 0, 127, 0.5)';
  } else {
    message = turn === 'X' ? 'Your turn (X)' : "Computer's turn (O)";
    markColor = turn === 'X' ? 'var(--x)' : 'var(--o)';
    glowColor = turn === 'X' ? 'rgba(0, 240, 255, 0.35)' : 'rgba(255, 0, 127, 0.35)';
    borderColor = turn === 'X' ? 'rgba(0, 240, 255, 0.5)' : 'rgba(255, 0, 127, 0.5)';
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '44px',
        padding: '6px 12px',
      }}
    >
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 20px',
          borderRadius: '30px',
          background: 'linear-gradient(135deg, rgba(14, 20, 36, 0.85) 0%, rgba(8, 11, 22, 0.92) 100%)',
          borderTop: '1px solid rgba(255, 255, 255, 0.35)',
          borderLeft: `1px solid ${borderColor}`,
          borderRight: `1px solid ${borderColor}`,
          borderBottom: `1px solid ${borderColor}`,
          boxShadow: `0 4px 16px rgba(0, 0, 0, 0.6), 0 0 14px ${glowColor}, inset 0 1px 0 rgba(255, 255, 255, 0.15)`,
          fontFamily: 'var(--font-display)',
          fontSize: '13px',
          fontWeight: 700,
          letterSpacing: '0.08em',
          color: markColor,
          textShadow: `0 0 10px ${glowColor}`,
          transition: 'all 200ms cubic-bezier(0.16, 1, 0.3, 1)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
        aria-live="polite"
      >
        {/* Pulsing Energy Dot */}
        <span
          aria-hidden="true"
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: markColor,
            boxShadow: `0 0 8px ${markColor}, 0 0 14px ${markColor}`,
            display: 'inline-block',
          }}
        />
        {message}
      </div>
    </div>
  );
}
