import type { JSX } from 'react';
import type { Board as BoardType, WinLine as WinLineType } from '../../core/types';
import { Cell } from './Cell';
import { WinLine } from './WinLine';

interface BoardProps {
  board: BoardType;
  disabled: boolean;
  winLine?: WinLineType | null;
  onCellTap: (index: number) => void;
}

export function Board({ board, disabled, winLine, onCellTap }: BoardProps): JSX.Element {
  return (
    <div
      role="grid"
      aria-label="Tic Tac Toe board"
      style={{
        position: 'relative',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gridTemplateRows: 'repeat(3, 1fr)',
        gap: 'var(--gap)',
        width: 'min(92vw, calc(100dvh - 300px), 480px)',
        aspectRatio: '1',
        padding: '12px',
        background: 'linear-gradient(165deg, rgba(14, 20, 36, 0.96) 0%, rgba(6, 9, 18, 0.98) 100%)',
        borderTop: '1px solid rgba(255, 255, 255, 0.35)',
        borderLeft: '1px solid rgba(0, 240, 255, 0.32)',
        borderRight: '1px solid rgba(0, 240, 255, 0.32)',
        borderBottom: '1px solid rgba(0, 240, 255, 0.32)',
        borderRadius: 'var(--radius-board)',
        boxShadow:
          '0 14px 48px rgba(0, 0, 0, 0.9), 0 0 32px rgba(0, 240, 255, 0.16), inset 0 1px 0 rgba(255, 255, 255, 0.2), inset 0 0 24px rgba(0, 240, 255, 0.06)',
        margin: '0 auto',
        boxSizing: 'border-box',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
    >
      {/* Sci-Fi Corner Brackets */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '4px',
          left: '4px',
          width: '12px',
          height: '12px',
          borderTop: '2px solid var(--accent)',
          borderLeft: '2px solid var(--accent)',
          pointerEvents: 'none',
          opacity: 0.8,
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '4px',
          right: '4px',
          width: '12px',
          height: '12px',
          borderTop: '2px solid var(--accent)',
          borderRight: '2px solid var(--accent)',
          pointerEvents: 'none',
          opacity: 0.8,
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: '4px',
          left: '4px',
          width: '12px',
          height: '12px',
          borderBottom: '2px solid var(--accent)',
          borderLeft: '2px solid var(--accent)',
          pointerEvents: 'none',
          opacity: 0.8,
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: '4px',
          right: '4px',
          width: '12px',
          height: '12px',
          borderBottom: '2px solid var(--accent)',
          borderRight: '2px solid var(--accent)',
          pointerEvents: 'none',
          opacity: 0.8,
        }}
      />

      {board.map((cell, index) => {
        const isWinning = winLine ? winLine.includes(index) : false;
        return (
          <Cell
            key={index}
            index={index}
            value={cell}
            disabled={disabled}
            isWinning={isWinning}
            onTap={onCellTap}
          />
        );
      })}

      {winLine && <WinLine line={winLine} />}
    </div>
  );
}
