import type { JSX } from 'react';
import type { Mark as MarkType } from '../../core/types';

interface MarkProps {
  type: MarkType;
  className?: string;
}

export function Mark({ type, className = '' }: MarkProps): JSX.Element {
  const isX = type === 'X';

  return (
    <svg
      viewBox="0 0 100 100"
      className={`mark mark--${type} ${className}`}
      style={{
        width: '72%',
        height: '72%',
        filter: isX
          ? 'drop-shadow(0 0 4px #FFFFFF) drop-shadow(0 0 10px #00F0FF) drop-shadow(0 0 22px rgba(0, 240, 255, 0.7))'
          : 'drop-shadow(0 0 4px #FFFFFF) drop-shadow(0 0 10px #FF007F) drop-shadow(0 0 22px rgba(255, 0, 127, 0.7))',
        transition: 'transform 200ms cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      aria-hidden="true"
    >
      <defs>
        {/* Holographic light gradient for X */}
        <linearGradient id="cyber-x-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#80F7FF" />
          <stop offset="50%" stopColor="#00F0FF" />
          <stop offset="100%" stopColor="#00A3FF" />
        </linearGradient>

        {/* Holographic light gradient for O */}
        <linearGradient id="cyber-o-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF66B2" />
          <stop offset="50%" stopColor="#FF007F" />
          <stop offset="100%" stopColor="#D600FF" />
        </linearGradient>
      </defs>

      {isX ? (
        <>
          {/* Luminous Neon Base */}
          <line
            x1="24"
            y1="24"
            x2="76"
            y2="76"
            stroke="url(#cyber-x-grad)"
            strokeWidth="10"
            strokeLinecap="round"
            className="stroke"
          />
          <line
            x1="76"
            y1="24"
            x2="24"
            y2="76"
            stroke="url(#cyber-x-grad)"
            strokeWidth="10"
            strokeLinecap="round"
            className="stroke stroke-second"
          />
          {/* White Hot Core */}
          <line
            x1="24"
            y1="24"
            x2="76"
            y2="76"
            stroke="#FFFFFF"
            strokeWidth="3.5"
            strokeLinecap="round"
            opacity="0.95"
            className="stroke"
          />
          <line
            x1="76"
            y1="24"
            x2="24"
            y2="76"
            stroke="#FFFFFF"
            strokeWidth="3.5"
            strokeLinecap="round"
            opacity="0.95"
            className="stroke stroke-second"
          />
        </>
      ) : (
        <>
          {/* Luminous Neon Base */}
          <circle
            cx="50"
            cy="50"
            r="26"
            fill="none"
            stroke="url(#cyber-o-grad)"
            strokeWidth="10"
            strokeLinecap="round"
            className="stroke"
          />
          {/* White Hot Core */}
          <circle
            cx="50"
            cy="50"
            r="26"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="3.5"
            strokeLinecap="round"
            opacity="0.95"
            className="stroke"
          />
        </>
      )}
    </svg>
  );
}
