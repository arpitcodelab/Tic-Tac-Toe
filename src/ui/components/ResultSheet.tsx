import type { JSX } from 'react';
import { useGameStore } from '../../store/gameStore';
import { OPPONENTS } from '../../core/config';

interface ResultSheetProps {
  isOpen: boolean;
}

export function ResultSheet({ isOpen }: ResultSheetProps): JSX.Element | null {
  const outcome = useGameStore((s) => s.outcome);
  const opponent = useGameStore((s) => s.opponent);
  const nextRound = useGameStore((s) => s.nextRound);
  const changeOpponent = useGameStore((s) => s.changeOpponent);

  if (!isOpen || outcome.status === 'in_progress') return null;

  const opponentInfo = OPPONENTS.find((o) => o.id === opponent);
  const opponentLabel = opponentInfo?.label ?? 'Computer';

  let title = '';
  let subtitle = '';
  const isWin = outcome.status === 'win' && (opponent === 'two-player' || outcome.winner === 'X');
  const isTie = outcome.status === 'tie';

  if (outcome.status === 'tie') {
    title = "It's a Tie!";
    subtitle = 'Equilibrium achieved. Neural matrix balanced.';
  } else if (opponent === 'two-player') {
    title = outcome.winner === 'X' ? 'Player 1 Wins! 🎉' : 'Player 2 Wins! 🎉';
    subtitle = 'Exceptional tactical performance!';
  } else {
    title = outcome.winner === 'X' ? 'You Win! 🎉' : `${opponentLabel} Wins!`;
    subtitle = outcome.winner === 'X' ? 'Victory verified. Neural core defeated.' : 'Simulation concluded. Re-calibrate strategy.';
  }

  const titleGlow = isWin
    ? '0 0 12px rgba(255, 230, 0, 0.85), 0 0 24px rgba(255, 230, 0, 0.45)'
    : isTie
      ? '0 0 12px rgba(0, 240, 255, 0.85), 0 0 24px rgba(0, 240, 255, 0.45)'
      : '0 0 12px rgba(255, 0, 127, 0.85), 0 0 24px rgba(255, 0, 127, 0.45)';

  const titleColor = isWin ? 'var(--win)' : isTie ? 'var(--x)' : 'var(--o)';

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 800,
        display: 'flex',
        justifyContent: 'center',
        padding: '16px',
        background: 'linear-gradient(to top, rgba(5, 7, 13, 0.85) 0%, transparent 100%)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Game outcome"
    >
      <div
        style={{
          background: 'linear-gradient(165deg, rgba(16, 22, 38, 0.95) 0%, rgba(8, 12, 24, 0.98) 100%)',
          border: isWin
            ? '1px solid rgba(255, 230, 0, 0.45)'
            : '1px solid rgba(0, 240, 255, 0.3)',
          borderTop: '1px solid rgba(255, 255, 255, 0.4)',
          borderRadius: 'var(--radius-card)',
          padding: '24px 20px',
          width: 'min(92vw, 440px)',
          boxShadow: isWin
            ? '0 12px 48px rgba(0, 0, 0, 0.9), 0 0 32px rgba(255, 230, 0, 0.22)'
            : '0 12px 48px rgba(0, 0, 0, 0.9), 0 0 32px rgba(0, 240, 255, 0.16)',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px',
        }}
      >
        <div>
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.22em',
              color: 'rgba(0, 240, 255, 0.75)',
              textTransform: 'uppercase',
              marginBottom: '4px',
            }}
          >
            Round Concluded
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '26px',
              fontWeight: 800,
              color: titleColor,
              textShadow: titleGlow,
              letterSpacing: '0.04em',
            }}
          >
            {title}
          </h2>
          <p
            style={{
              fontSize: '15px',
              color: 'var(--text-dim)',
              marginTop: '4px',
              fontWeight: 500,
            }}
          >
            {subtitle}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            type="button"
            onClick={changeOpponent}
            style={{
              flex: 1,
              padding: '14px',
              borderRadius: 'var(--radius-btn)',
              background: 'linear-gradient(145deg, rgba(16, 22, 38, 0.85) 0%, rgba(9, 13, 24, 0.95) 100%)',
              border: '1px solid rgba(0, 240, 255, 0.22)',
              borderTop: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'var(--text)',
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: '14px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              cursor: 'pointer',
            }}
          >
            Change
          </button>
          <button
            type="button"
            onClick={nextRound}
            style={{
              flex: 2,
              padding: '14px',
              borderRadius: 'var(--radius-btn)',
              background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.28) 0%, rgba(121, 40, 202, 0.28) 100%)',
              border: '1px solid rgba(0, 240, 255, 0.65)',
              borderTop: '1px solid rgba(255, 255, 255, 0.7)',
              boxShadow: '0 0 24px rgba(0, 240, 255, 0.4), 0 4px 14px rgba(0, 0, 0, 0.6)',
              color: '#FFFFFF',
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: '15px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              cursor: 'pointer',
            }}
          >
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
}
