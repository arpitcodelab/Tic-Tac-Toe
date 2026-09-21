import { useEffect, useState } from 'react';
import { useGameStore } from '../../store/gameStore';

interface UseKeyboardBoardOptions {
  onCloseModals?: () => void;
}

export function useKeyboardBoard(options: UseKeyboardBoardOptions = {}) {
  const [focusedIndex, setFocusedIndex] = useState<number>(4); // default to center
  const phase = useGameStore((s) => s.phase);
  const placeMark = useGameStore((s) => s.placeMark);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        options.onCloseModals?.();
        return;
      }

      if (phase !== 'awaiting_input') return;

      // Digits 1-9 to place mark directly (1 = top-left, 9 = bottom-right)
      if (/^[1-9]$/.test(e.key)) {
        const cellIndex = parseInt(e.key, 10) - 1;
        placeMark(cellIndex);
        setFocusedIndex(cellIndex);
        return;
      }

      // Arrow key navigation
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setFocusedIndex((prev) => (prev >= 3 ? prev - 3 : prev));
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setFocusedIndex((prev) => (prev <= 5 ? prev + 3 : prev));
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setFocusedIndex((prev) => (prev % 3 > 0 ? prev - 1 : prev));
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setFocusedIndex((prev) => (prev % 3 < 2 ? prev + 1 : prev));
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        placeMark(focusedIndex);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, focusedIndex, placeMark, options]);

  return { focusedIndex, setFocusedIndex };
}

