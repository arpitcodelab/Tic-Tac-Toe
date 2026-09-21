import { useState, type JSX } from 'react';
import { useGameStore } from '../../store/gameStore';
import { audio } from '../../services/audio';
import { Mark } from '../components/Mark';

export function SplashScreen(): JSX.Element {
  const [isHovered, setIsHovered] = useState(false);
  const startApp = useGameStore((s) => s.startApp);

  const handleTapToPlay = () => {
    audio.unlock();
    startApp();
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        width: '100%',
        padding: '24px',
        textAlign: 'center',
        boxSizing: 'border-box',
        position: 'relative',
        zIndex: 2,
      }}
    >
      {/* Holographic Dual Mark Icon Chamber */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          width: '120px',
          height: '68px',
          background: 'linear-gradient(145deg, rgba(16, 22, 38, 0.85) 0%, rgba(9, 13, 24, 0.95) 100%)',
          borderTop: '1px solid rgba(255, 255, 255, 0.4)',
          borderLeft: '1px solid rgba(0, 240, 255, 0.35)',
          borderRight: '1px solid rgba(0, 240, 255, 0.35)',
          borderBottom: '1px solid rgba(0, 240, 255, 0.35)',
          borderRadius: '34px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.8), 0 0 20px rgba(0, 240, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
          padding: '8px 16px',
          marginBottom: '32px',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        }}
      >
        <div style={{ width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Mark type="X" />
        </div>
        <div style={{ width: '1px', height: '28px', background: 'rgba(0, 240, 255, 0.4)' }} />
        <div style={{ width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Mark type="O" />
        </div>
      </div>

      {/* Luminous Arcade Title */}
      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(36px, 9vw, 48px)',
          fontWeight: 900,
          letterSpacing: '0.06em',
          color: '#FFFFFF',
          marginBottom: '40px',
          textTransform: 'uppercase',
          lineHeight: 1.15,
        }}
      >
        <span
          style={{
            color: 'var(--x)',
            textShadow: '0 0 12px rgba(0, 240, 255, 0.9), 0 0 28px rgba(0, 240, 255, 0.5)',
          }}
        >
          Tic Tac{' '}
        </span>
        <span
          style={{
            color: 'var(--o)',
            textShadow: '0 0 12px rgba(255, 0, 127, 0.9), 0 0 28px rgba(255, 0, 127, 0.5)',
          }}
        >
          Toe
        </span>
      </h1>

      {/* Hardware Play Button */}
      <button
        type="button"
        onClick={handleTapToPlay}
        aria-label="Play"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          position: 'relative',
          fontFamily: 'var(--font-display)',
          background: isHovered
            ? 'linear-gradient(135deg, rgba(0, 240, 255, 0.28) 0%, rgba(121, 40, 202, 0.28) 100%)'
            : 'linear-gradient(135deg, rgba(16, 24, 46, 0.9) 0%, rgba(8, 12, 26, 0.96) 100%)',
          color: '#FFFFFF',
          fontSize: '18px',
          fontWeight: 800,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          padding: '16px 56px',
          borderRadius: 'var(--radius-btn)',
          borderTop: '1px solid rgba(255, 255, 255, 0.65)',
          borderLeft: '1px solid rgba(0, 240, 255, 0.55)',
          borderRight: '1px solid rgba(0, 240, 255, 0.55)',
          borderBottom: '1px solid rgba(0, 240, 255, 0.55)',
          boxShadow: isHovered
            ? '0 0 28px rgba(0, 240, 255, 0.55), 0 8px 24px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.4)'
            : '0 0 16px rgba(0, 240, 255, 0.25), 0 6px 20px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.25)',
          cursor: 'pointer',
          transition: 'all 160ms cubic-bezier(0.16, 1, 0.3, 1)',
          transform: isHovered ? 'translateY(-2px) scale(1.02)' : 'none',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        }}
      >
        <span
          style={{
            textShadow: '0 0 10px rgba(0, 240, 255, 0.8), 0 0 20px rgba(0, 240, 255, 0.4)',
          }}
        >
          Play
        </span>
      </button>
    </div>
  );
}
