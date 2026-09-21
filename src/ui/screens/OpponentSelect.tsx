import { useState, type JSX } from 'react';
import { useGameStore } from '../../store/gameStore';
import { OPPONENTS } from '../../core/config';
import type { OpponentId } from '../../core/types';

export function OpponentSelect(): JSX.Element {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const scores = useGameStore((s) => s.scores);
  const selectOpponent = useGameStore((s) => s.selectOpponent);

  const getTierColor = (id: string) => {
    switch (id) {
      case 'easy':
        return '#00F0FF'; // Electric Cyan
      case 'medium':
        return '#2979FF'; // Neon Blue
      case 'hard':
        return '#9D4EDD'; // Electric Violet
      case 'expert':
        return '#FFE600'; // High-Energy Gold
      case 'two-player':
        return '#FF007F'; // Neon Magenta
      default:
        return '#00F0FF';
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        maxWidth: '460px',
        padding: '24px 16px',
        margin: '0 auto',
        boxSizing: 'border-box',
        position: 'relative',
        zIndex: 2,
      }}
    >
      <header style={{ textAlign: 'center', marginBottom: '24px' }}>
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.24em',
            color: 'rgba(0, 240, 255, 0.75)',
            textShadow: '0 0 10px rgba(0, 240, 255, 0.5)',
            textTransform: 'uppercase',
            marginBottom: '6px',
          }}
        >
          Neural Simulator // Select Mode
        </div>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '30px',
            fontWeight: 800,
            color: '#FFFFFF',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}
        >
          <span style={{ color: 'var(--x)', textShadow: '0 0 12px rgba(0, 240, 255, 0.8)' }}>
            Choose{' '}
          </span>
          <span style={{ color: 'var(--o)', textShadow: '0 0 12px rgba(255, 0, 127, 0.8)' }}>
            Opponent
          </span>
        </h1>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
        {OPPONENTS.map((opp) => {
          const record = scores[opp.id as OpponentId] ?? { p1: 0, ties: 0, p2: 0 };
          const hasPlayed = record.p1 > 0 || record.ties > 0 || record.p2 > 0;
          const tierColor = getTierColor(opp.id);
          const isHovered = hoveredId === opp.id;

          return (
            <button
              key={opp.id}
              type="button"
              onClick={() => selectOpponent(opp.id as OpponentId)}
              onMouseEnter={() => setHoveredId(opp.id)}
              onMouseLeave={() => setHoveredId(null)}
              onFocus={() => setHoveredId(opp.id)}
              onBlur={() => setHoveredId(null)}
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                padding: '16px 20px 16px 22px',
                background: isHovered
                  ? 'linear-gradient(145deg, rgba(22, 32, 56, 0.95) 0%, rgba(12, 17, 30, 0.98) 100%)'
                  : 'linear-gradient(145deg, rgba(16, 22, 38, 0.88) 0%, rgba(9, 13, 24, 0.96) 100%)',
                border: isHovered
                  ? `1px solid ${tierColor}`
                  : '1px solid rgba(0, 240, 255, 0.18)',
                borderTop: isHovered
                  ? '1px solid rgba(255, 255, 255, 0.6)'
                  : '1px solid rgba(255, 255, 255, 0.24)',
                borderRadius: 'var(--radius-card)',
                boxShadow: isHovered
                  ? `0 6px 24px rgba(0, 0, 0, 0.75), 0 0 18px ${tierColor}55, inset 0 1px 0 rgba(255, 255, 255, 0.2)`
                  : '0 4px 16px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.12)',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 160ms cubic-bezier(0.16, 1, 0.3, 1)',
                transform: isHovered ? 'translateY(-2px)' : 'none',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                overflow: 'hidden',
              }}
            >
              {/* Left Vertical Tier Color Bar */}
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  left: 0,
                  top: '12%',
                  bottom: '12%',
                  width: '4px',
                  borderRadius: '0 2px 2px 0',
                  background: tierColor,
                  boxShadow: `0 0 10px ${tierColor}`,
                }}
              />

              <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '17px',
                      fontWeight: 700,
                      color: '#FFFFFF',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {opp.label}
                  </span>
                  {hasPlayed && (
                    <span
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '11px',
                        fontWeight: 700,
                        color: tierColor,
                        letterSpacing: '0.08em',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        background: 'rgba(0, 0, 0, 0.5)',
                        border: `1px solid ${tierColor}44`,
                        textShadow: `0 0 6px ${tierColor}`,
                      }}
                    >
                      W {record.p1} · T {record.ties} · L {record.p2}
                    </span>
                  )}
                </div>
                <span
                  style={{
                    fontSize: '14px',
                    color: 'var(--text-dim)',
                    lineHeight: 1.35,
                    fontWeight: 500,
                  }}
                >
                  {opp.blurb}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
