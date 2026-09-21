import type { JSX } from 'react';
import { Menu, Volume2, VolumeX } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { OPPONENTS } from '../../core/config';

interface TopBarProps {
  onOpenMenu: () => void;
}

export function TopBar({ onOpenMenu }: TopBarProps): JSX.Element {
  const sound = useGameStore((s) => s.settings.sound);
  const toggleSound = useGameStore((s) => s.toggleSound);
  const opponent = useGameStore((s) => s.opponent);

  const opponentInfo = OPPONENTS.find((o) => o.id === opponent);
  const difficultyLabel = opponentInfo?.label ?? 'Easy';

  const buttonStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 'clamp(40px, 11vw, 48px)',
    height: 'clamp(40px, 11vw, 48px)',
    borderRadius: 'var(--radius-btn)',
    background: 'linear-gradient(145deg, rgba(20, 26, 46, 0.88) 0%, rgba(10, 14, 26, 0.96) 100%)',
    borderTop: '1px solid rgba(255, 255, 255, 0.35)',
    borderLeft: '1px solid rgba(0, 240, 255, 0.28)',
    borderRight: '1px solid rgba(0, 240, 255, 0.28)',
    borderBottom: '1px solid rgba(0, 240, 255, 0.28)',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.6), 0 0 10px rgba(0, 240, 255, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    color: 'var(--text)',
    transition: 'all 150ms cubic-bezier(0.16, 1, 0.3, 1)',
    flexShrink: 0,
  };

  const iconStyle = {
    width: 'clamp(20px, 5.5vw, 24px)',
    height: 'clamp(20px, 5.5vw, 24px)',
  };

  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: 'min(92vw, 480px)',
        padding: '8px 0',
        margin: '0 auto',
      }}
      aria-label="Top navigation"
    >
      <button
        type="button"
        onClick={onOpenMenu}
        aria-label="Open menu"
        style={buttonStyle}
      >
        <Menu style={iconStyle} color="var(--accent)" />
      </button>

      {/* Main Game Title & Difficulty on Top */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(18px, 5.5vw, 24px)',
            fontWeight: 800,
            letterSpacing: '0.08em',
            color: '#FFFFFF',
            textShadow: '0 0 12px rgba(0, 240, 255, 0.75), 0 0 24px rgba(0, 240, 255, 0.35)',
            margin: 0,
            padding: '0 8px',
            textAlign: 'center',
            userSelect: 'none',
            whiteSpace: 'nowrap',
            lineHeight: 1.2,
          }}
        >
          Tic-tac-toe
        </h1>
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '11px',
            fontWeight: 700,
            color: 'var(--accent)',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            textShadow: '0 0 8px rgba(0, 240, 255, 0.6)',
          }}
        >
          {difficultyLabel}
        </span>
      </div>

      <button
        type="button"
        onClick={toggleSound}
        aria-label={sound ? 'Mute sound' : 'Unmute sound'}
        style={{
          ...buttonStyle,
          color: sound ? 'var(--accent)' : 'var(--text-dim)',
          boxShadow: sound
            ? '0 4px 16px rgba(0, 0, 0, 0.6), 0 0 14px rgba(0, 240, 255, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.25)'
            : buttonStyle.boxShadow,
        }}
      >
        {sound ? <Volume2 style={iconStyle} /> : <VolumeX style={iconStyle} />}
      </button>
    </header>
  );
}
