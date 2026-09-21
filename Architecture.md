# Architecture — Tic Tac Toe (Mobile-First Web Game)

Companion to `PRD.md`. Requirement IDs (`FR-xx`, `NFR-xx`) refer to that document.
**Audience:** a beginner "vibe coder" and an AI IDE (Cursor, Windsurf, Claude Code, Copilot, etc.). Section 14 contains a step-by-step build order with paste-ready prompts.

---

## 1. Architecture Principles

1. **Logic is separate from looks.** Game rules and AI are pure TypeScript functions that know nothing about React, the DOM, or sound. This makes them easy to test and impossible to break by changing UI.
2. **One source of truth.** A single store holds game state. The UI only *reads* state and *sends actions*.
3. **Small and fast.** No game engine. A 3×3 board is best done with SVG + CSS, which gives crisp scaling, free accessibility, and a tiny bundle (NFR: ≤ 150 KB gzip).
4. **Zero runtime network.** Fonts, icons, and sounds are bundled or synthesised. Works offline (FR-71) and needs no cookies (NFR-P1).
5. **Everything tunable lives in config.** AI blunder rates, animation durations, and CPU delays are constants in one place.
6. **Fail soft.** Storage errors, audio errors, and vibration errors must never crash the game.

---

## 2. Tech Stack (all free & open source)

| Concern | Choice | Licence | Why |
|---|---|---|---|
| Language | **TypeScript** (strict) | Apache-2.0 | Catches mistakes; AI IDEs generate better code with types |
| Build tool | **Vite** | MIT | Instant dev server, tiny optimised builds |
| UI | **React 18** | MIT | Most AI-friendly UI library; component model fits screens |
| State | **Zustand** (+ `persist` middleware) | MIT | ~1 KB, minimal boilerplate, built-in localStorage persistence |
| Styling | **Plain CSS** with CSS variables + CSS Modules | – | No build complexity; theming via tokens; small |
| Animation | **CSS + SVG** (`stroke-dashoffset`, `transform`, `opacity`) | – | GPU-friendly, no library needed |
| Confetti (P1) | **canvas-confetti** | ISC | 3 KB, lazy-loaded only on win |
| Icons | **lucide-react** (import only used icons) | ISC | Tree-shakeable SVG icons |
| Font | **@fontsource/fredoka** (self-hosted) | OFL | Friendly rounded font, no Google request |
| Audio | **Web Audio API** (synthesised) | – | No sound files, no licensing, tiny |
| PWA | **vite-plugin-pwa** (Workbox) | MIT | Manifest + service worker + offline precache |
| Unit tests | **Vitest** | MIT | Vite-native, fast |
| Component tests | **@testing-library/react** | MIT | Tests behaviour, not internals |
| E2E (P1) | **Playwright** (mobile viewports) | Apache-2.0 | Real phone-size browser tests |
| Lint/format | **ESLint + Prettier** | MIT | Consistent code |
| CI/CD | **GitHub Actions** → **GitHub Pages / Cloudflare Pages / Netlify** | Free tier | Auto test + deploy |

**Why not Phaser / Unity / Godot?** They are excellent for action games but add 300 KB–20 MB and hurt "lightning fast loading" for a 9-cell board game. If you later want a physics-heavy game, revisit this choice.

---

## 3. High-Level Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                        PRESENTATION (React)                    │
│  Screens: Splash · OpponentSelect · Game                       │
│  Components: Board · Cell · Mark · WinLine · Scoreboard ·      │
│              TopBar · MenuDrawer · ResultSheet · HowToPlay     │
└───────────────▲───────────────────────────────┬────────────────┘
      reads state│                              │dispatches actions
┌───────────────┴───────────────────────────────▼────────────────┐
│                     STATE (Zustand store)                      │
│  settings · scores(per opponent) · session · round(phase)      │
│  Actions: startMatch, placeMark, runCpuTurn, nextRound,        │
│           resetScores, toggleSound ...                         │
└───────┬─────────────────────┬──────────────────────┬───────────┘
        │ uses                │ calls                │ persists via
┌───────▼────────┐   ┌────────▼─────────┐   ┌────────▼───────────┐
│   CORE (pure)  │   │  SERVICES        │   │  STORAGE           │
│ engine.ts      │   │ audio.ts         │   │ localStorage       │
│ ai/*.ts        │   │ haptics.ts       │   │ (versioned schema) │
│ types.ts       │   │ confetti.ts      │   └────────────────────┘
│ config.ts      │   └──────────────────┘
└────────────────┘
```

**Dependency rule (enforce in code review):** `core` imports nothing from other layers. `store` imports `core` and `services`. `ui` imports `store` and `core` types. Never the reverse.

---

## 4. Folder Structure

```
tic-tac-toe/
├─ public/
│  ├─ icons/                  # PWA icons: 192, 512, maskable-512, apple-touch-icon
│  └─ favicon.svg
├─ src/
│  ├─ core/                   # PURE LOGIC — no React, no DOM
│  │  ├─ types.ts
│  │  ├─ config.ts            # AI rates, delays, animation durations
│  │  ├─ engine.ts            # board ops, win/tie detection
│  │  ├─ engine.test.ts
│  │  └─ ai/
│  │     ├─ index.ts          # chooseMove(board, mark, difficulty, rng)
│  │     ├─ easy.ts  medium.ts  hard.ts  expert.ts
│  │     ├─ minimax.ts
│  │     └─ ai.test.ts
│  ├─ store/
│  │  ├─ gameStore.ts         # Zustand store + actions
│  │  ├─ selectors.ts
│  │  └─ gameStore.test.ts
│  ├─ services/
│  │  ├─ audio.ts             # Web Audio synth + mute
│  │  ├─ haptics.ts
│  │  ├─ confetti.ts          # lazy import of canvas-confetti
│  │  └─ storage.ts           # safe localStorage wrapper
│  ├─ ui/
│  │  ├─ App.tsx              # screen router (no react-router needed)
│  │  ├─ screens/
│  │  │  ├─ SplashScreen.tsx
│  │  │  ├─ OpponentSelect.tsx
│  │  │  └─ GameScreen.tsx
│  │  ├─ components/
│  │  │  ├─ Board.tsx  Cell.tsx  Mark.tsx  WinLine.tsx
│  │  │  ├─ Scoreboard.tsx  TurnIndicator.tsx  TopBar.tsx
│  │  │  ├─ MenuDrawer.tsx  ResultSheet.tsx  HowToPlay.tsx
│  │  │  ├─ ConfirmDialog.tsx  Button.tsx  LiveAnnouncer.tsx
│  │  └─ hooks/
│  │     ├─ useReducedMotion.ts
│  │     └─ useKeyboardBoard.ts
│  ├─ styles/
│  │  ├─ tokens.css           # colours, spacing, radii, durations (light + dark)
│  │  ├─ base.css             # reset, html/body, touch rules, safe areas
│  │  └─ animations.css       # keyframes
│  ├─ main.tsx
│  └─ vite-env.d.ts
├─ e2e/                       # Playwright specs (P1)
├─ .github/workflows/ci.yml
├─ index.html
├─ vite.config.ts
├─ tsconfig.json
├─ package.json
├─ PRD.md
├─ Architecture.md
├─ LICENSE  LICENSES.md  README.md
```

---

## 5. Core Domain (pure TypeScript)

### 5.1 Types — `src/core/types.ts`
```ts
export type Mark = 'X' | 'O';
export type Cell = Mark | null;
/** Always length 9. Index = row * 3 + col. */
export type Board = readonly Cell[];

export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';
export type OpponentId = 'two-player' | `cpu-${Difficulty}`;
export type Side = 'p1' | 'p2';            // p2 = friend or CPU

export type WinLine = readonly [number, number, number];

export type Outcome =
  | { status: 'in_progress' }
  | { status: 'win'; winner: Mark; line: WinLine }
  | { status: 'tie' };

export type Rng = () => number;            // returns [0,1). Inject for tests.
```

### 5.2 Engine — `src/core/engine.ts`
```ts
import type { Board, Mark, Outcome, WinLine } from './types';

export const EMPTY_BOARD: Board = Object.freeze(Array(9).fill(null));

export const WIN_LINES: readonly WinLine[] = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],   // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8],   // columns
  [0, 4, 8], [2, 4, 6],              // diagonals
];

export const otherMark = (m: Mark): Mark => (m === 'X' ? 'O' : 'X');

export function getOutcome(board: Board): Outcome {
  for (const line of WIN_LINES) {
    const [a, b, c] = line;
    const m = board[a];
    if (m && m === board[b] && m === board[c]) {
      return { status: 'win', winner: m, line };
    }
  }
  return board.every((c) => c !== null) ? { status: 'tie' } : { status: 'in_progress' };
}

export const legalMoves = (board: Board): number[] =>
  board.flatMap((c, i) => (c === null ? [i] : []));

/** Returns a NEW board; throws on illegal move (programming error). */
export function applyMove(board: Board, index: number, mark: Mark): Board {
  if (index < 0 || index > 8 || board[index] !== null) {
    throw new Error(`Illegal move at ${index}`);
  }
  const next = board.slice();
  next[index] = mark;
  return next;
}

/** Find a cell where `mark` would complete a line right now (or null). */
export function findCompletingMove(board: Board, mark: Mark): number | null {
  for (const i of legalMoves(board)) {
    if (getOutcome(applyMove(board, i, mark)).status === 'win') return i;
  }
  return null;
}
```
*Win check runs before the tie check* (FR-4).

### 5.3 AI — `src/core/ai/`
```ts
// minimax.ts
import { applyMove, getOutcome, legalMoves, otherMark } from '../engine';
import type { Board, Mark } from '../types';

function score(board: Board, turn: Mark, me: Mark, depth: number): number {
  const o = getOutcome(board);
  if (o.status === 'win') return o.winner === me ? 10 - depth : depth - 10; // faster win / slower loss
  if (o.status === 'tie') return 0;
  const scores = legalMoves(board).map((i) =>
    score(applyMove(board, i, turn), otherMark(turn), me, depth + 1),
  );
  return turn === me ? Math.max(...scores) : Math.min(...scores);
}

/** All moves that share the best score (lets us pick randomly for variety). */
export function bestMoves(board: Board, me: Mark): number[] {
  const scored = legalMoves(board).map((i) => ({
    i,
    s: score(applyMove(board, i, me), otherMark(me), me, 1),
  }));
  const best = Math.max(...scored.map((x) => x.s));
  return scored.filter((x) => x.s === best).map((x) => x.i);
}
```
(9 cells ⇒ at most 549,946 nodes for an empty board: well under 50 ms. No alpha-beta needed. If Expert lags on the first move of very old phones, add a precomputed opening table.)

```ts
// index.ts — the only AI function the rest of the app calls
import { findCompletingMove, legalMoves, otherMark } from '../engine';
import { AI_CONFIG } from '../config';
import { bestMoves } from './minimax';
import type { Board, Difficulty, Mark, Rng } from '../types';

const pick = <T,>(arr: readonly T[], rng: Rng): T => arr[Math.floor(rng() * arr.length)];

export function chooseMove(board: Board, me: Mark, level: Difficulty, rng: Rng = Math.random): number {
  const moves = legalMoves(board);
  if (moves.length === 0) throw new Error('No legal moves');
  const random = () => pick(moves, rng);
  const win = findCompletingMove(board, me);
  const block = findCompletingMove(board, otherMark(me));

  switch (level) {
    case 'easy':
      return random();
    case 'medium':
      if (win !== null) return win;
      if (block !== null && rng() < AI_CONFIG.mediumBlockChance) return block;
      return random();
    case 'hard': {
      if (rng() < AI_CONFIG.hardBlunderRate) return random();
      if (win !== null) return win;
      if (block !== null) return block;
      const prefs = [4, 0, 2, 6, 8, 1, 3, 5, 7].filter((i) => moves.includes(i));
      // prefer centre, then corners (random among corners), then edges
      if (prefs.includes(4)) return 4;
      const corners = prefs.filter((i) => [0, 2, 6, 8].includes(i));
      return corners.length ? pick(corners, rng) : pick(prefs, rng);
    }
    case 'expert':
      return pick(bestMoves(board, me), rng);
  }
}
```

### 5.4 Config — `src/core/config.ts`
```ts
export const AI_CONFIG = {
  mediumBlockChance: 0.6,
  hardBlunderRate: 0.1,
  cpuDelayMs: { min: 400, max: 800 },
} as const;

export const MOTION = {
  markDrawMs: 250,
  winLineMs: 400,
  overlayMs: 250,
  resultDelayMs: 700,   // wait for win line before showing the result sheet
} as const;

export const OPPONENTS = [
  { id: 'two-player', label: '2 Players', blurb: 'Take turns with a friend' },
  { id: 'cpu-easy',   label: 'Easy',      blurb: 'Relaxed and beatable' },
  { id: 'cpu-medium', label: 'Medium',    blurb: 'Watch your step' },
  { id: 'cpu-hard',   label: 'Hard',      blurb: 'Blocks and attacks' },
  { id: 'cpu-expert', label: 'Expert',    blurb: 'Perfect play. Can you tie?' },
] as const;
```

---

## 6. State Management

### 6.1 Shape — `src/store/gameStore.ts`
```ts
type Phase =
  | 'awaiting_input'   // human's turn, board is tappable
  | 'cpu_thinking'     // CPU delay running, board locked
  | 'resolving'        // win/tie animation playing, board locked
  | 'round_over';      // result sheet visible

interface Score { p1: number; ties: number; p2: number; }

interface GameState {
  // persisted
  settings: { sound: boolean; haptics: boolean; theme: 'system' | 'light' | 'dark' };
  scores: Record<OpponentId, Score>;
  lastOpponent: OpponentId | null;

  // session (not persisted)
  screen: 'splash' | 'select' | 'game';
  opponent: OpponentId | null;
  roundNumber: number;               // 0-based; even => P1 starts (FR-5)
  board: Board;
  turn: Mark;                        // whose mark is next
  phase: Phase;
  outcome: Outcome;

  // actions
  startApp(): void;                  // after "Tap to play": unlock audio, go to select
  startMatch(o: OpponentId): void;   // roundNumber = 0, new round
  placeMark(index: number): void;    // human tap; ignored unless legal
  runCpuTurn(): void;                // called by effect when phase === 'cpu_thinking'
  nextRound(): void;                 // roundNumber++, alternate starter
  resetScores(): void;               // current opponent only; roundNumber = 0
  changeOpponent(): void;
  toggleSound(): void;
}
```

### 6.2 Key rules (map to PRD)
- **Who is X/O:** `p1 = X`, `p2/CPU = O` always (FR-6).
- **Starter:** `starterSide = roundNumber % 2 === 0 ? 'p1' : 'p2'`. The starter's mark opens the round, so on odd rounds **O moves first**. Set `turn` accordingly: `turn = starterSide === 'p1' ? 'X' : 'O'`. *(If you prefer "starter is always X", change only this line and the mark-to-side mapping.)*
- **Whose turn is human?** In `cpu-*` mode, the human is `X`. If `turn === 'O'`, set `phase = 'cpu_thinking'`. In `two-player` mode, all turns are human.
- **After every placement:** compute `getOutcome`. If `win` or `tie` → `phase = 'resolving'`, update `scores[opponent]`, then after `MOTION.resultDelayMs` set `phase = 'round_over'`. Otherwise flip `turn` and set phase.
- **Score update:** win by `X` → `p1++`; win by `O` → `p2++`; tie → `ties++`.
- **Guards:** `placeMark` returns early unless `phase === 'awaiting_input'` and the cell is empty. (This is what locks input during CPU thinking and animations, FR-15.)

### 6.3 CPU turn driver
Do **not** put timers inside the store's pure logic. Use one React effect in `GameScreen`:
```tsx
useEffect(() => {
  if (phase !== 'cpu_thinking') return;
  const { min, max } = AI_CONFIG.cpuDelayMs;
  const t = setTimeout(runCpuTurn, min + Math.random() * (max - min));
  return () => clearTimeout(t);   // cancels if user leaves the screen
}, [phase, runCpuTurn]);
```
Same pattern for the `resolving → round_over` delay. `clearTimeout` prevents bugs when the player taps "Change opponent" mid-animation.

### 6.4 State machine
```
        startMatch / nextRound
                │
   ┌────────────▼─────────────┐  starter is CPU   ┌───────────────┐
   │  starter = human?        ├──────────────────►│ cpu_thinking  │◄─┐
   └────────────┬─────────────┘                   └───────┬───────┘  │ CPU moves,
                │ yes                                     │ CPU move │ game continues,
        ┌───────▼────────┐  human taps, game continues    ▼          │ next is CPU
        │ awaiting_input │◄───────────────────────────────┤──────────┘
        └───────┬────────┘                                │
                │ human taps, game ends / CPU move ends game
                ▼
          ┌───────────┐  delay   ┌────────────┐  nextRound
          │ resolving ├─────────►│ round_over ├──────────► (loop)
          └───────────┘          └────────────┘
```

---

## 7. Persistence — `src/services/storage.ts`

Single key: `ttt:v1`. Use Zustand `persist` with `partialize` so **only** `settings`, `scores`, `lastOpponent` are saved.

```ts
// Saved JSON
{
  "version": 1,
  "settings": { "sound": true, "haptics": true, "theme": "system" },
  "scores": {
    "two-player": { "p1": 0, "ties": 0, "p2": 0 },
    "cpu-easy":   { "p1": 0, "ties": 0, "p2": 0 },
    "cpu-medium": { "p1": 0, "ties": 0, "p2": 0 },
    "cpu-hard":   { "p1": 0, "ties": 0, "p2": 0 },
    "cpu-expert": { "p1": 0, "ties": 0, "p2": 0 }
  },
  "lastOpponent": "cpu-expert"
}
```
- Provide a custom `storage` object that wraps `localStorage` in `try/catch` and falls back to in-memory (NFR-R1).
- Use Zustand's `version` + `migrate` to reset safely if data shape changes or is corrupt (NFR-R2).
- Validate loaded numbers (`Number.isFinite`, `>= 0`) before trusting them.

---

## 8. UI Architecture

### 8.1 Screen routing
No router library: `App.tsx` renders based on `store.screen` with a short CSS fade between screens.
```tsx
export default function App() {
  const screen = useGame((s) => s.screen);
  return (
    <main className="app">
      {screen === 'splash' && <SplashScreen />}
      {screen === 'select' && <OpponentSelect />}
      {screen === 'game'   && <GameScreen />}
    </main>
  );
}
```

### 8.2 Component contracts
| Component | Props | Responsibility |
|---|---|---|
| `SplashScreen` | – | Shows loader → "Tap to play" button → `audio.unlock()` + `startApp()` |
| `OpponentSelect` | – | Lists `OPPONENTS` with saved W–T–L; tap → `startMatch(id)` |
| `GameScreen` | – | Composes everything; owns CPU-turn effect |
| `TopBar` | – | Hamburger (left) → `MenuDrawer`; sound toggle (right) |
| `MenuDrawer` | `open, onClose` | Reset scores (with `ConfirmDialog`), Change opponent, How to play |
| `Scoreboard` | `score, labels` | Three counters; animates number change |
| `TurnIndicator` | `turn, phase, opponent` | "Your turn (X)", "Computer thinking…", "Player 2's turn (O)" |
| `Board` | `board, onCellTap, disabled, winLine` | Square SVG/grid; renders 9 `Cell`s and `WinLine` |
| `Cell` | `index, value, disabled, isWinning, onTap` | `<button>` with ARIA label; press feedback |
| `Mark` | `type: 'X' \| 'O', animate` | SVG with stroke-draw animation |
| `WinLine` | `line` | SVG line drawn across the 3 cells |
| `ResultSheet` | `outcome, opponent, onPlayAgain, onChange` | Bottom sheet with result and buttons |
| `LiveAnnouncer` | `message` | Visually hidden `aria-live="polite"` region |

### 8.3 Board rendering approach
- Board container: CSS grid, 3×3, `aspect-ratio: 1`, `gap: var(--gap)`.
- Marks and win line are drawn in an **SVG overlay** (`viewBox="0 0 300 300"`) so they scale perfectly on any screen.
- Cells are real `<button>` elements (keyboard, screen-reader, and touch for free) with transparent backgrounds over a drawn grid.

```tsx
// Mark.tsx (idea) — stroke draw animation
export function Mark({ type }: { type: 'X' | 'O' }) {
  return (
    <svg viewBox="0 0 100 100" className={`mark mark--${type}`} aria-hidden="true">
      {type === 'X' ? (
        <>
          <path d="M25 25 L75 75" pathLength="1" className="stroke s1" />
          <path d="M75 25 L25 75" pathLength="1" className="stroke s2" />
        </>
      ) : (
        <circle cx="50" cy="50" r="27" pathLength="1" className="stroke" />
      )}
    </svg>
  );
}
```
```css
.stroke { fill:none; stroke:currentColor; stroke-width:9; stroke-linecap:round;
          stroke-dasharray:1; stroke-dashoffset:1;
          animation: draw var(--mark-ms, 250ms) ease-out forwards; }
.s2 { animation-delay: 120ms; }
@keyframes draw { to { stroke-dashoffset: 0; } }
@media (prefers-reduced-motion: reduce) {
  .stroke { animation: none; stroke-dashoffset: 0; }
}
```

### 8.4 Responsive layout & mobile rules (FR-80..86)
```css
/* base.css */
html, body, #root { height: 100%; }
body {
  margin: 0;
  overscroll-behavior: none;                 /* no pull-to-refresh bounce during play */
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  user-select: none;
  font-family: 'Fredoka', system-ui, sans-serif;
  background: var(--bg); color: var(--text);
}
button { touch-action: manipulation; min-width: 48px; min-height: 48px; }

.app {
  min-height: 100dvh;
  padding: env(safe-area-inset-top) env(safe-area-inset-right)
           env(safe-area-inset-bottom) env(safe-area-inset-left);
  display: flex; flex-direction: column;
}

/* Board size: never exceeds width, remaining height, or 520px */
.board {
  --size: min(92vw, calc(100dvh - 280px), 520px);
  width: var(--size); aspect-ratio: 1; margin-inline: auto;
}

/* Landscape phones: scoreboard beside board */
@media (orientation: landscape) and (max-height: 520px) {
  .game { flex-direction: row; align-items: center; justify-content: center; gap: 24px; }
  .board { --size: min(80dvh, 60vw); }
}
```
`index.html` head:
```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
<meta name="theme-color" content="#F6F7FB" media="(prefers-color-scheme: light)" />
<meta name="theme-color" content="#12141F" media="(prefers-color-scheme: dark)" />
```
*Do not* set `user-scalable=no` or `maximum-scale=1` (accessibility).

### 8.5 Design tokens — `src/styles/tokens.css`
```css
:root {
  --bg:#F6F7FB; --surface:#FFFFFF; --text:#1B1E2B; --muted:#6B7085;
  --x:#FF5C7A; --o:#19C3B1; --accent:#5B6CFF; --win:#FFC93C;
  --radius-card:16px; --radius-board:20px; --gap:8px;
  --mark-ms:250ms; --line-ms:400ms; --overlay-ms:250ms;
  --shadow: 0 6px 24px rgba(20,24,50,.10);
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme='light']) {
    --bg:#12141F; --surface:#1C2030; --text:#F2F3F8; --muted:#9AA0B8;
    --shadow: 0 6px 24px rgba(0,0,0,.45);
  }
}
:root[data-theme='dark'] {
  --bg:#12141F; --surface:#1C2030; --text:#F2F3F8; --muted:#9AA0B8;
}
```

### 8.6 Accessibility implementation
- Board wrapper: `role="grid"` with `aria-label="Tic Tac Toe board"`; each cell button `aria-label="Row 2, column 3, empty"` (or `"…, X"`). Disabled cells use `aria-disabled` rather than removal from the tab order when the game is locked.
- `LiveAnnouncer` updates on each move and result.
- `useKeyboardBoard`: Arrow keys move focus in the 3×3 grid; digits `1–9` place a mark; `Esc` closes overlays.
- Focus is moved to the "Play again" button when the result sheet opens, and restored to the board after.
- Honour `prefers-reduced-motion` in CSS and in JS (`useReducedMotion` gates confetti and haptics patterns).

---

## 9. Services

### 9.1 Audio — `src/services/audio.ts`
Synthesised with the Web Audio API, so there are **no audio files**. The `AudioContext` is created/resumed on the first tap (the "Tap to play" gate), which is required on iOS/Android.
```ts
type Sfx = 'tapUi' | 'placeX' | 'placeO' | 'win' | 'lose' | 'tie';

class AudioService {
  private ctx: AudioContext | null = null;
  enabled = true;

  unlock() {
    try {
      this.ctx ??= new (window.AudioContext || (window as any).webkitAudioContext)();
      if (this.ctx.state === 'suspended') void this.ctx.resume();
    } catch { /* audio unsupported: stay silent */ }
  }

  private tone(freq: number, start: number, dur: number, type: OscillatorType = 'sine', vol = 0.15) {
    if (!this.ctx) return;
    const t0 = this.ctx.currentTime + start;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type; osc.frequency.setValueAtTime(freq, t0);
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(vol, t0 + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(gain).connect(this.ctx.destination);
    osc.start(t0); osc.stop(t0 + dur + 0.02);
  }

  play(name: Sfx) {
    if (!this.enabled || !this.ctx) return;
    switch (name) {
      case 'tapUi':  this.tone(520, 0, 0.06, 'triangle'); break;
      case 'placeX': this.tone(440, 0, 0.09, 'triangle'); this.tone(560, 0.05, 0.09, 'triangle'); break;
      case 'placeO': this.tone(330, 0, 0.12, 'sine');     this.tone(392, 0.05, 0.10, 'sine'); break;
      case 'win':    [523, 659, 784, 1047].forEach((f, i) => this.tone(f, i * 0.09, 0.22, 'triangle')); break;
      case 'lose':   [392, 330, 262].forEach((f, i) => this.tone(f, i * 0.14, 0.26, 'sine')); break;
      case 'tie':    this.tone(392, 0, 0.16, 'sine'); this.tone(392, 0.2, 0.2, 'sine'); break;
    }
  }
}
export const audio = new AudioService();
```
The store syncs `audio.enabled = settings.sound`. **Alternative:** use CC0 files from Kenney.nl in `/public/sfx/*.ogg` plus a tiny `<audio>`/Howler wrapper. Keep the same `audio.play(name)` interface so nothing else changes.

### 9.2 Haptics — `src/services/haptics.ts`
```ts
export const haptics = {
  enabled: true,
  tick()   { if (this.enabled) navigator.vibrate?.(10); },
  win()    { if (this.enabled) navigator.vibrate?.([30, 40, 30, 40, 60]); },
};
```
Always optional-chain (`?.`): iOS Safari has no `vibrate`.

### 9.3 Confetti — `src/services/confetti.ts`
```ts
export async function celebrate() {
  const { default: confetti } = await import('canvas-confetti');  // lazy chunk, loads on first win
  confetti({ particleCount: 90, spread: 70, origin: { y: 0.7 }, disableForReducedMotion: true });
}
```

---

## 10. PWA & Offline (FR-70..72)

`vite.config.ts` (key parts):
```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: './',   // works on GitHub Pages sub-paths. For user/org root or Netlify/Cloudflare, '/' is fine too.
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons/apple-touch-icon.png'],
      manifest: {
        name: 'Tic Tac Toe',
        short_name: 'TicTacToe',
        description: 'A polished, offline-ready Tic Tac Toe game.',
        display: 'standalone',
        orientation: 'any',
        start_url: '.',
        background_color: '#F6F7FB',
        theme_color: '#5B6CFF',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: { globPatterns: ['**/*.{js,css,html,svg,png,woff2}'] },
    }),
  ],
  build: { target: 'es2019', sourcemap: false },
});
```
Everything is precached, so the game runs in airplane mode after the first visit.

---

## 11. Performance Budget & Techniques (NFR §12.1)

- Ship only what is used: import individual Lucide icons; only load Fredoka weights 500 and 700 (`@fontsource/fredoka/500.css`, `700.css`, latin subset).
- Lazy-load `canvas-confetti` and the *How to play* sheet with `import()`.
- Animate only `transform` and `opacity`; avoid layout-thrashing properties. Add `will-change: transform` sparingly.
- `font-display: swap` plus system fallback so text shows immediately.
- Expert AI computed synchronously (≤ ~50 ms). If a low-end device stalls, move it to a Web Worker or an opening lookup table.
- Track bundle size in CI (`vite build` + `gzip -c dist/assets/*.js | wc -c` check, fail over 150 KB).
- Lighthouse CI check for mobile scores ≥ 95.

---

## 12. Testing Strategy

| Layer | Tool | What to test |
|---|---|---|
| **engine** | Vitest | All 8 lines for X and O; 9th-move win beats tie; tie board; `applyMove` rejects illegal moves; input boards never mutated |
| **AI** | Vitest with seeded RNG | Easy/Medium/Hard return legal moves only; Medium/Hard win-in-one; Hard blocks; **Expert never loses**: exhaustively explore every possible opponent reply from the empty board as X and as O and assert no loss; difficulty ordering vs. a random opponent over 1,000 games |
| **store** | Vitest | Starter alternation (P1, P2, P1…); reset only affects current opponent; scores increment correctly; input ignored during `cpu_thinking`/`resolving`; storage failure fallback |
| **UI** | Testing Library | Tapping a cell places a mark; occupied cell ignored; result sheet buttons work; menu → reset asks confirmation; sound toggle updates icon and persists |
| **E2E** | Playwright (iPhone SE, Pixel 7, iPad, desktop; portrait + landscape) | Full game vs Expert ends in tie/loss; reload keeps scores; offline works; no horizontal scroll; tap targets ≥ 48 px |
| **A11y** | axe-core (via Playwright) | Zero serious/critical violations |

**Exhaustive "Expert never loses" sketch:**
```ts
function neverLoses(board: Board, turn: Mark, ai: Mark): boolean {
  const o = getOutcome(board);
  if (o.status === 'win') return o.winner === ai;
  if (o.status === 'tie') return true;
  if (turn === ai) return neverLoses(applyMove(board, bestMoves(board, ai)[0], ai), otherMark(turn), ai);
  return legalMoves(board).every((i) => neverLoses(applyMove(board, i, turn), otherMark(turn), ai));
}
// expect(neverLoses(EMPTY_BOARD, 'X', 'X')).toBe(true);
// expect(neverLoses(EMPTY_BOARD, 'X', 'O')).toBe(true);
```

---

## 13. Tooling, CI/CD & Deployment

**`package.json` scripts**
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc --noEmit && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest",
    "lint": "eslint . --max-warnings 0",
    "format": "prettier --write .",
    "e2e": "playwright test"
  }
}
```

**Setup commands**
```bash
npm create vite@latest tic-tac-toe -- --template react-ts
cd tic-tac-toe
npm i zustand lucide-react canvas-confetti @fontsource/fredoka
npm i -D vite-plugin-pwa vitest jsdom @testing-library/react @testing-library/jest-dom \
         @testing-library/user-event @types/canvas-confetti eslint prettier @playwright/test
```

**`.github/workflows/ci.yml`** (idea): on push/PR → `npm ci` → `npm run lint` → `npm test` → `npm run build` → upload `dist/`. On `main`, deploy to GitHub Pages (or connect the repo to Cloudflare Pages/Netlify, which auto-build with `npm run build`, publish dir `dist`).

**Security headers (Cloudflare/Netlify `_headers` file):**
```
/*
  Content-Security-Policy: default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self'; worker-src 'self'; manifest-src 'self'
  X-Content-Type-Options: nosniff
  Referrer-Policy: no-referrer
```
(GitHub Pages cannot set headers; a `<meta http-equiv>` CSP is a partial alternative.)

---

## 14. Build Order for the AI IDE (paste-ready prompts)

> **Tip for vibe coding:** put `PRD.md` and `Architecture.md` in the project root and tell the IDE to always follow them. Give it **one step at a time**, run the app and the tests after each step, and commit to git after every green step.

**Step 0 — Scaffold**
> "Read PRD.md and Architecture.md. Scaffold the project exactly as in Architecture §4, §13 (Vite + React + TypeScript strict, Zustand, Vitest, ESLint, Prettier). Create `styles/tokens.css` and `base.css` from §8.4 and §8.5. Make `npm run dev`, `test` and `build` work. Do not build features yet."

**Step 1 — Core engine + tests**
> "Implement `src/core/types.ts`, `config.ts`, and `engine.ts` from Architecture §5. Write Vitest tests in `engine.test.ts` covering everything in §12 for the engine. No UI code."

**Step 2 — AI + tests**
> "Implement `src/core/ai/*` (Easy, Medium, Hard, Expert with minimax) per PRD §7 and Architecture §5.3, using an injectable RNG. Write `ai.test.ts` including the exhaustive 'Expert never loses' test and the difficulty-ordering simulation."

**Step 3 — Store**
> "Implement `store/gameStore.ts` per Architecture §6 and §7: phases, starter alternation (FR-5), per-opponent scores, persistence with safe storage and versioned migration. Write store tests from §12."

**Step 4 — Static UI**
> "Build `Board`, `Cell`, `Mark`, `WinLine`, `Scoreboard`, `TurnIndicator` per §8.2–8.4, mobile-first, using tokens. Render a hard-coded board on `GameScreen` first. Must look right at 320, 390 and 768 px widths."

**Step 5 — Game flow**
> "Wire `GameScreen` to the store: taps place marks, CPU turn effect (§6.3), win/tie detection, `ResultSheet` with Play again / Change opponent. Add `SplashScreen` and `OpponentSelect` (FR-8, FR-10, FR-11)."

**Step 6 — Menus, scores, settings**
> "Add `TopBar`, `MenuDrawer` (Reset scores with ConfirmDialog, Change opponent, How to play), sound toggle, and persistence of scores and sound (FR-30..FR-44)."

**Step 7 — Animation & polish**
> "Add stroke-draw marks, win-line drawing, screen transitions, and confetti per FR-55..FR-60 and §8.3, §9.3. Respect `prefers-reduced-motion`."

**Step 8 — Audio & haptics**
> "Implement `services/audio.ts` and `haptics.ts` per §9. Unlock audio on the Splash tap. Hook sounds to placement, win, lose, tie and UI taps."

**Step 9 — Accessibility**
> "Implement §8.6: ARIA grid labels, `LiveAnnouncer`, keyboard navigation, focus management, contrast check. Add axe tests."

**Step 10 — PWA & performance**
> "Add vite-plugin-pwa per §10, icons, meta tags. Meet the budgets in §11. Run Lighthouse mobile and fix issues until ≥ 95."

**Step 11 — E2E & deploy**
> "Add Playwright tests for phone/tablet viewports per §12, the GitHub Actions workflow per §13, README with screenshots, LICENSE (MIT) and LICENSES.md listing dependencies. Deploy to the chosen free host."

---

## 15. Extensibility Notes (so v2 is easy)

- **Board size / variants:** `WIN_LINES` and `EMPTY_BOARD` are the only 3×3-specific constants in the engine; generate them from a `size` parameter later (and replace full minimax with alpha-beta + depth limit for 4×4).
- **Online multiplayer:** the store's `placeMark` becomes "send move → apply on ack". Because state transitions are pure and deterministic, you can sync by exchanging moves only.
- **Themes/skins:** all colours flow from CSS variables; a skin = another token set plus optional `Mark` SVG variants.
- **i18n:** move visible strings into `src/i18n/en.ts` and read through a tiny `t()` helper from day one if you plan to localise.

---

## 16. Risks & Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| iOS Safari blocks audio until a gesture | No sound | Splash "Tap to play" gate unlocks the `AudioContext` (FR-8) |
| Mobile browser toolbars change viewport height | Board clipped | Use `dvh` + `min()` sizing; test on real iOS/Android |
| Timers firing after leaving the screen | Ghost CPU moves | Effects clean up with `clearTimeout`; store ignores actions outside valid phases |
| Storage blocked or corrupt | Lost scores / crash | Safe wrapper + versioned migration (§7) |
| AI difficulty tiers feel off | Poor experience | Rates in `config.ts`; simulation tests; playtest and tune |
| Accidental copying of reference assets | Legal | Original art/sound only; list licences in `LICENSES.md` |
| Scope creep | Delays | Ship M0–M6 before touching §15 |
