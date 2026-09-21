import type { JSX } from 'react';
import { X, RotateCcw, Users, HelpCircle } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';

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
  const changeOpponent = useGameStore((s) => s.changeOpponent);

  if (!isOpen) return null;

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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.2em',
                color: 'rgba(0, 240, 255, 0.7)',
                textTransform: 'uppercase',
              }}
            >
              Control Panel
            </div>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '20px',
                fontWeight: 800,
                color: '#FFFFFF',
                letterSpacing: '0.06em',
                textShadow: '0 0 10px rgba(0, 240, 255, 0.6)',
              }}
            >
              Menu
            </span>
          </div>

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
            }}
          >
            <X size={18} />
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
            changeOpponent();
          }}
          style={itemButtonStyle}
        >
          <Users size={18} color="var(--accent)" />
          Change Opponent
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
