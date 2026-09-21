import type { JSX } from 'react';
import type { Score } from '../../store/gameStore';

interface ScoreboardProps {
  score: Score;
  opponentLabel: string;
}

export function Scoreboard({ score, opponentLabel }: ScoreboardProps): JSX.Element {
  return (
    <section
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        background: 'linear-gradient(145deg, rgba(16, 22, 38, 0.86) 0%, rgba(9, 13, 24, 0.96) 100%)',
        borderTop: '1px solid rgba(255, 255, 255, 0.32)',
        borderLeft: '1px solid rgba(0, 240, 255, 0.24)',
        borderRight: '1px solid rgba(0, 240, 255, 0.24)',
        borderBottom: '1px solid rgba(0, 240, 255, 0.24)',
        borderRadius: 'var(--radius-card)',
        padding: '12px 18px',
        boxShadow:
          '0 8px 32px rgba(0, 0, 0, 0.75), 0 0 16px rgba(0, 240, 255, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
        width: 'min(92vw, 480px)',
        margin: '0 auto',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
      aria-label="Scoreboard"
    >
      <div style={{ textAlign: 'center', flex: 1 }}>
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '11px',
            color: 'rgba(0, 240, 255, 0.75)',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}
        >
          Player [X]
        </div>
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '26px',
            fontWeight: 800,
            color: 'var(--x)',
            marginTop: '2px',
            textShadow: '0 0 10px rgba(0, 240, 255, 0.85), 0 0 20px rgba(0, 240, 255, 0.45)',
          }}
        >
          {score.p1}
        </div>
      </div>

      <div
        style={{
          width: '1px',
          height: '32px',
          background: 'linear-gradient(180deg, transparent 0%, rgba(0, 240, 255, 0.6) 50%, transparent 100%)',
          boxShadow: '0 0 8px rgba(0, 240, 255, 0.35)',
        }}
      />

      <div style={{ textAlign: 'center', flex: 1 }}>
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '11px',
            color: 'var(--text-dim)',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}
        >
          Ties
        </div>
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '26px',
            fontWeight: 800,
            color: '#F0F6FC',
            marginTop: '2px',
            textShadow: '0 0 10px rgba(240, 246, 252, 0.6)',
          }}
        >
          {score.ties}
        </div>
      </div>

      <div
        style={{
          width: '1px',
          height: '32px',
          background: 'linear-gradient(180deg, transparent 0%, rgba(255, 0, 127, 0.6) 50%, transparent 100%)',
          boxShadow: '0 0 8px rgba(255, 0, 127, 0.35)',
        }}
      />

      <div style={{ textAlign: 'center', flex: 1 }}>
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '11px',
            color: 'rgba(255, 0, 127, 0.75)',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}
        >
          {opponentLabel} [O]
        </div>
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '26px',
            fontWeight: 800,
            color: 'var(--o)',
            marginTop: '2px',
            textShadow: '0 0 10px rgba(255, 0, 127, 0.85), 0 0 20px rgba(255, 0, 127, 0.45)',
          }}
        >
          {score.p2}
        </div>
      </div>
    </section>
  );
}
