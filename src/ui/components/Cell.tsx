import { useState, type JSX } from 'react';
import type { Cell as CellType } from '../../core/types';
import { Mark } from './Mark';

interface CellProps {
  index: number;
  value: CellType;
  disabled: boolean;
  isWinning?: boolean;
  onTap: (index: number) => void;
}

export function Cell({ index, value, disabled, isWinning = false, onTap }: CellProps): JSX.Element {
  const [isHovered, setIsHovered] = useState(false);
  const row = Math.floor(index / 3) + 1;
  const col = (index % 3) + 1;
  const label = value ? `Row ${row}, column ${col}, ${value}` : `Row ${row}, column ${col}, empty`;

  const isInteractive = !disabled && value === null;

  const sideBorder = isWinning
    ? '1px solid rgba(255, 230, 0, 0.85)'
    : isHovered
      ? '1px solid rgba(0, 240, 255, 0.65)'
      : '1px solid rgba(0, 240, 255, 0.16)';

  const topBorder = isWinning
    ? '1px solid rgba(255, 255, 255, 0.9)'
    : isHovered
      ? '1px solid rgba(255, 255, 255, 0.5)'
      : '1px solid rgba(255, 255, 255, 0.2)';

  return (
    <button
      type="button"
      role="gridcell"
      aria-label={label}
      disabled={!isInteractive}
      onClick={() => onTap(index)}
      onMouseEnter={() => isInteractive && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => isInteractive && setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: isWinning
          ? 'radial-gradient(circle, rgba(255, 230, 0, 0.22) 0%, rgba(16, 22, 38, 0.9) 100%)'
          : isHovered
            ? 'linear-gradient(145deg, rgba(24, 34, 58, 0.92) 0%, rgba(12, 17, 30, 0.98) 100%)'
            : 'linear-gradient(145deg, rgba(16, 22, 38, 0.85) 0%, rgba(9, 13, 24, 0.95) 100%)',
        borderTop: topBorder,
        borderLeft: sideBorder,
        borderRight: sideBorder,
        borderBottom: sideBorder,
        borderRadius: 'var(--radius-card)',
        boxShadow: isWinning
          ? '0 0 24px rgba(255, 230, 0, 0.4), inset 0 0 16px rgba(255, 230, 0, 0.25)'
          : isHovered
            ? '0 0 18px rgba(0, 240, 255, 0.35), inset 0 0 12px rgba(0, 240, 255, 0.15)'
            : '0 4px 16px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.12)',
        cursor: isInteractive ? 'pointer' : 'default',
        transition: 'all 160ms cubic-bezier(0.16, 1, 0.3, 1)',
        transform: isInteractive && isHovered ? 'translateY(-1px) scale(1.02)' : 'none',
        outline: 'none',
        width: '100%',
        height: '100%',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        overflow: 'hidden',
        animation: isWinning ? 'win-cell-pulse 1.5s ease-in-out infinite' : 'none',
      }}
    >
      {/* Glossy Diagonal Reflection */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '45%',
          background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Subtle Energy Reticle on Empty Hover */}
      {isInteractive && isHovered && !value && (
        <div
          aria-hidden="true"
          style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: 'var(--x)',
            boxShadow: '0 0 12px var(--x), 0 0 24px var(--x)',
            opacity: 0.8,
            transition: 'opacity 150ms ease',
          }}
        />
      )}

      {value && <Mark type={value} />}
    </button>
  );
}
