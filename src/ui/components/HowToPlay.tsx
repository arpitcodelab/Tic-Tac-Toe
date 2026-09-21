import type { JSX } from 'react';
import { X } from 'lucide-react';

interface HowToPlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HowToPlay({ isOpen, onClose }: HowToPlayProps): JSX.Element | null {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(5, 7, 13, 0.82)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        padding: '16px',
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="how-to-play-title"
    >
      <div
        style={{
          background: 'linear-gradient(165deg, rgba(16, 22, 38, 0.95) 0%, rgba(8, 12, 24, 0.98) 100%)',
          border: '1px solid rgba(0, 240, 255, 0.32)',
          borderTop: '1px solid rgba(255, 255, 255, 0.45)',
          borderRadius: 'var(--radius-card)',
          padding: '24px',
          maxWidth: '460px',
          width: '100%',
          maxHeight: '82vh',
          overflowY: 'auto',
          boxShadow: '0 16px 48px rgba(0, 0, 0, 0.9), 0 0 32px rgba(0, 240, 255, 0.18)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.22em',
                color: 'rgba(0, 240, 255, 0.75)',
                textTransform: 'uppercase',
              }}
            >
              Tactical Field Manual // 2099
            </div>
            <h2
              id="how-to-play-title"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '22px',
                fontWeight: 800,
                color: '#FFFFFF',
                letterSpacing: '0.04em',
                textShadow: '0 0 10px rgba(0, 240, 255, 0.6)',
              }}
            >
              How to Play
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close how to play"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'linear-gradient(145deg, rgba(20, 26, 46, 0.9) 0%, rgba(10, 14, 26, 0.95) 100%)',
              border: '1px solid rgba(0, 240, 255, 0.3)',
              color: 'var(--text)',
              cursor: 'pointer',
            }}
          >
            <X size={18} />
          </button>
        </div>

        <ol
          style={{
            paddingLeft: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            fontSize: '15px',
            color: 'var(--text)',
            lineHeight: 1.55,
          }}
        >
          <li>
            <strong style={{ color: 'var(--x)' }}>Goal:</strong> Get three of your marks in a row (horizontal, vertical, or diagonal) to win.
          </li>
          <li>
            <strong style={{ color: 'var(--x)' }}>Turns:</strong> Players take turns placing their mark on an empty cell. Player 1 is always X and Player 2/Computer is O.
          </li>
          <li>
            <strong style={{ color: 'var(--x)' }}>Starter Alternation:</strong> The starting player alternates every round to keep gameplay fair.
          </li>
          <li>
            <strong style={{ color: 'var(--x)' }}>Opponents:</strong> Choose between 4 computer difficulty levels (Easy, Medium, Hard, and unbeatable Expert).
          </li>
          <li>
            <strong style={{ color: 'var(--x)' }}>Scores:</strong> Scores are tracked independently for each opponent and saved on your device.
          </li>
          <li>
            <strong style={{ color: 'var(--x)' }}>Sound:</strong> Tap the speaker icon in the top right to toggle sound on or off.
          </li>
          <li>
            <strong style={{ color: 'var(--x)' }}>Reset:</strong> Open the menu in the top left to reset scores for your current opponent.
          </li>
        </ol>

        <button
          type="button"
          onClick={onClose}
          style={{
            width: '100%',
            marginTop: '24px',
            padding: '14px',
            borderRadius: 'var(--radius-btn)',
            fontFamily: 'var(--font-display)',
            background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.25) 0%, rgba(121, 40, 202, 0.25) 100%)',
            border: '1px solid rgba(0, 240, 255, 0.6)',
            borderTop: '1px solid rgba(255, 255, 255, 0.7)',
            boxShadow: '0 0 20px rgba(0, 240, 255, 0.35), 0 6px 18px rgba(0, 0, 0, 0.6)',
            color: '#FFFFFF',
            fontWeight: 800,
            fontSize: '15px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            cursor: 'pointer',
          }}
        >
          Got It!
        </button>
      </div>
    </div>
  );
}
