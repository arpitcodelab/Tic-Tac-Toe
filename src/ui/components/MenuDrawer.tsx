import type { JSX } from 'react';
import { X, RotateCcw, HelpCircle } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { OPPONENTS } from '../../core/config';

interface MenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenResetConfirm: () => void;
  onOpenHowToPlay: () => void;
}

export function MenuDrawer({
  isOpen,
  onClose,
  onOpenResetConfirm,
  onOpenHowToPlay,
}: MenuDrawerProps): JSX.Element | null {
  const opponent = useGameStore((s) => s.opponent);
  const changeOpponent = useGameStore((s) => s.changeOpponent);

  if (!isOpen) return null;

  const opponentInfo = OPPONENTS.find((o) => o.id === opponent);
  const difficultyLabel = opponentInfo?.label ?? 'Easy';

  const itemButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px 16px',
    borderRadius: 'var(--radius-btn)',
    background: 'linear-gradient(145deg, rgba(16, 22, 38, 0.85) 0%, rgba(9, 13, 24, 0.95) 100%)',
    border: '1px solid rgba(0, 240, 255, 0.18)',
    borderTop: '1px solid rgba(255, 255, 255, 0.22)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
    color: 'var(--text)',
    fontSize: '15px',
    fontWeight: 600,
    letterSpacing: '0.04em',
    textAlign: 'left' as const,
    cursor: 'pointer',
    transition: 'all 140ms ease',
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 900,
        display: 'flex',
        background: 'rgba(5, 7, 13, 0.75)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
    >
      <div
        style={{
          width: 'min(310px, 80vw)',
          height: '100%',
          background: 'linear-gradient(170deg, rgba(14, 20, 36, 0.96) 0%, rgba(6, 9, 18, 0.98) 100%)',
          borderRight: '1px solid rgba(0, 240, 255, 0.28)',
          padding: '24px 20px',
          boxShadow: '12px 0 40px rgba(0, 0, 0, 0.9), 0 0 24px rgba(0, 240, 255, 0.12)',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          boxSizing: 'border-box',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '22px',
              fontWeight: 800,
              color: '#FFFFFF',
              letterSpacing: '0.06em',
              textShadow: '0 0 10px rgba(0, 240, 255, 0.6)',
            }}
          >
            Menu
          </span>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
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
              minHeight: '36px',
              minWidth: '36px',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Current Difficulty Card on Top */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 14px',
            marginBottom: '10px',
            borderRadius: 'var(--radius-btn)',
            background: 'linear-gradient(145deg, rgba(0, 240, 255, 0.12) 0%, rgba(121, 40, 202, 0.1) 100%)',
            borderTop: '1px solid rgba(255, 255, 255, 0.25)',
            borderLeft: '1px solid rgba(0, 240, 255, 0.35)',
            borderRight: '1px solid rgba(0, 240, 255, 0.35)',
            borderBottom: '1px solid rgba(0, 240, 255, 0.35)',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.5), 0 0 12px rgba(0, 240, 255, 0.15)',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span
              style={{
                fontSize: '11px',
                color: 'var(--text-dim)',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
              }}
            >
              Difficulty
            </span>
            <span
              style={{
                fontSize: '16px',
                fontWeight: 800,
                color: 'var(--accent)',
                textShadow: '0 0 8px rgba(0, 240, 255, 0.65)',
                fontFamily: 'var(--font-display)',
                letterSpacing: '0.04em',
              }}
            >
              {difficultyLabel}
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              onClose();
              changeOpponent();
            }}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.2) 0%, rgba(121, 40, 202, 0.2) 100%)',
              border: '1px solid rgba(0, 240, 255, 0.5)',
              color: '#FFFFFF',
              fontFamily: 'var(--font-display)',
              fontSize: '11px',
              fontWeight: 800,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              minHeight: 'auto',
              minWidth: 'auto',
              boxShadow: '0 0 10px rgba(0, 240, 255, 0.25)',
            }}
          >
            Change
          </button>
        </div>

        <button
          type="button"
          onClick={() => {
            onClose();
            onOpenResetConfirm();
          }}
          style={itemButtonStyle}
        >
          <RotateCcw size={18} color="var(--x)" />
          Reset Scores
        </button>

        <button
          type="button"
          onClick={() => {
            onClose();
            onOpenHowToPlay();
          }}
          style={itemButtonStyle}
        >
          <HelpCircle size={18} color="var(--win)" />
          How to Play
        </button>
      </div>
    </div>
  );
}
