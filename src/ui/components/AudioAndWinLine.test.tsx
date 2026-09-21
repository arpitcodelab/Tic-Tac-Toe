import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { WinLine } from './WinLine';
import { audio } from '../../services/audio';
import { haptics } from '../../services/haptics';
import type { WinLine as WinLineType } from '../../core/types';

describe('Audio, Haptics & WinLine', () => {
  it('audio service safely handles play and mute states', () => {
    audio.enabled = false;
    // Should not throw when disabled
    expect(() => audio.play('placeX')).not.toThrow();
    expect(() => audio.play('win')).not.toThrow();

    audio.enabled = true;
    // In node/jsdom without Web Audio context, should gracefully no-op without throwing
    expect(() => audio.play('placeO')).not.toThrow();
    expect(() => audio.unlock()).not.toThrow();
  });

  it('haptics safely handles environments without vibration', () => {
    expect(() => haptics.tick()).not.toThrow();
    expect(() => haptics.win()).not.toThrow();
  });

  it('WinLine renders line with win-strike class for all 8 win lines', () => {
    const testLines: WinLineType[] = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
      [0, 4, 8], [2, 4, 6],          // diagonals
    ];

    for (const line of testLines) {
      const { container } = render(<WinLine line={line} />);
      const lineEl = container.querySelector('line');
      expect(lineEl).toBeInTheDocument();
      expect(lineEl).toHaveClass('win-strike');
    }
  });
});

