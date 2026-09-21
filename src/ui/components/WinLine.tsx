import type { JSX } from 'react';
import type { WinLine as WinLineType } from '../../core/types';

interface WinLineProps {
  line: WinLineType;
}

export function WinLine({ line }: WinLineProps): JSX.Element {
  let x1 = 0;
  let y1 = 0;
  let x2 = 0;
  let y2 = 0;

  // Key line based on sorted indices
  const key = `${line[0]}-${line[1]}-${line[2]}`;

  switch (key) {
    // Rows
    case '0-1-2':
      x1 = 20; y1 = 50; x2 = 280; y2 = 50;
      break;
    case '3-4-5':
      x1 = 20; y1 = 150; x2 = 280; y2 = 150;
      break;
    case '6-7-8':
      x1 = 20; y1 = 250; x2 = 280; y2 = 250;
      break;
    // Columns
    case '0-3-6':
      x1 = 50; y1 = 20; x2 = 50; y2 = 280;
      break;
    case '1-4-7':
      x1 = 150; y1 = 20; x2 = 150; y2 = 280;
      break;
    case '2-5-8':
      x1 = 250; y1 = 20; x2 = 250; y2 = 280;
      break;
    // Diagonals
    case '0-4-8':
      x1 = 25; y1 = 25; x2 = 275; y2 = 275;
      break;
    case '2-4-6':
      x1 = 275; y1 = 25; x2 = 25; y2 = 275;
      break;
    default:
      return <></>;
  }

  return (
    <svg
      viewBox="0 0 300 300"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 10,
        filter: 'drop-shadow(0 0 12px rgba(255, 230, 0, 0.75))',
      }}
      aria-hidden="true"
    >
      {/* Primary Laser Corona */}
      <line x1={x1} y1={y1} x2={x2} y2={y2} className="win-strike" />

      {/* Searing White-Hot Center Beam */}
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="#FFFFFF"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="400"
        strokeDashoffset="400"
        style={{
          animation: 'strike var(--line-ms, 400ms) cubic-bezier(0.16, 1, 0.3, 1) forwards',
        }}
      />
    </svg>
  );
}
