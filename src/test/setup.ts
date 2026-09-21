import '@testing-library/jest-dom';

// Stub canvas getContext for jsdom environment to prevent canvas-confetti warnings
if (typeof HTMLCanvasElement !== 'undefined') {
  HTMLCanvasElement.prototype.getContext = (() => null) as unknown as typeof HTMLCanvasElement.prototype.getContext;
}
