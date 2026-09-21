# Roadmap: Tic Tac Toe (Mobile-First Web Game)

## Overview

A 7-phase execution roadmap structured along horizontal layers and architectural milestones (from `Architecture.md §14`). We begin with foundation tooling and scaffolding, implement and test the pure TypeScript game engine and unbeatable Minimax AI, layer in state management and persistence, build the interactive UI and screens, integrate menus and settings, add animations and synthesized audio polish, and finish with accessibility, mobile optimization, and PWA offline capabilities.

## Phases

- [ ] **Phase 1: Foundation & Tooling** - Project scaffolding with Vite, React 18, TypeScript strict, Vitest, and design tokens
- [ ] **Phase 2: Core Game Engine & AI** - Pure TypeScript board logic, outcome detection, and 4 AI tiers (including unbeatable Minimax)
- [ ] **Phase 3: Game Store & State Machine** - Zustand store with phase transitions, starter alternation, and persistent per-opponent scores
- [ ] **Phase 4: UI Components & Board Interaction** - Board, Cell, Mark, Scoreboard, TurnIndicator, OpponentSelect, and Splash screen
- [ ] **Phase 5: Menus, Settings & Dialogs** - TopBar, MenuDrawer, score reset with confirmation, How to play sheet, and sound toggle
- [ ] **Phase 6: Audio, Haptics & Visual Polish** - Web Audio oscillator synthesis, SVG stroke animations, winning line strike, and confetti
- [ ] **Phase 7: Accessibility, Mobile Polish & PWA** - ARIA grid, LiveAnnouncer, keyboard controls, safe-area layout, and offline PWA precaching

---

## Phase Details

### Phase 1: Foundation & Tooling
**Goal**: Establish a solid, type-safe development environment with React 18, TypeScript strict mode, Vite, Vitest, and the CSS design tokens and base styles.
**Depends on**: Nothing (first phase)
**Requirements**: Foundation for all requirements
**Success Criteria**:
  1. `npm run dev` serves the app instantly with hot reload.
  2. `npm test` runs Vitest successfully.
  3. Design token variables (`tokens.css`) and reset (`base.css`) are loaded and functional.
**Plans**: 1 plan

Plans:
- [x] 01-01: Scaffold Vite + React + TS, install dependencies (zustand, lucide-react, canvas-confetti, @fontsource/fredoka), configure Vitest, and create design tokens/base styles.

---

### Phase 2: Core Game Engine & AI
**Goal**: Build the zero-dependency pure TypeScript game engine and 4 difficulty AI opponents with comprehensive unit tests and simulation suites.
**Depends on**: Phase 1
**Requirements**: CORE-01, CORE-02, CORE-03, CORE-04, CORE-05, CORE-06, AI-01, AI-02, AI-03, AI-04, AI-05, AI-06
**Success Criteria**:
  1. Engine correctly identifies all 8 winning lines, ties, and legal moves.
  2. Win on the 9th move is detected as a win, not a tie.
  3. Expert AI never loses across 1,000 automated simulated games.
  4. Difficulty levels exhibit strictly monotonic win rates (Easy < Medium < Hard < Expert).
**Plans**: 2 plans

Plans:
- [x] 02-01: Implement `src/core/types.ts`, `src/core/config.ts`, and `src/core/engine.ts` with comprehensive engine unit tests.
- [x] 02-02: Implement `src/core/ai/*` (easy, medium, hard, minimax expert) with exhaustive "never loses" test and monte carlo difficulty simulation.

---

### Phase 3: Game Store & State Machine
**Goal**: Implement the centralized Zustand state store, handling turn flow, starter alternation, CPU turn scheduling, and safe versioned `localStorage` score persistence.
**Depends on**: Phase 2
**Requirements**: SCORE-01, SCORE-02, SCORE-03, SCORE-04
**Success Criteria**:
  1. Starting player alternates every round (P1 -> P2/CPU -> P1...) and resets on opponent change.
  2. Scores are tracked independently for each of the 5 opponents and survive browser reload.
  3. Board input is locked during CPU thinking and outcome resolution phases.
  4. Corrupt or absent `localStorage` safely falls back to in-memory defaults.
**Plans**: 1 plan

Plans:
- [x] 03-01: Implement `src/services/storage.ts`, `src/store/gameStore.ts`, selectors, and unit tests verifying state transitions and persistence.

---

### Phase 4: UI Components & Board Interaction
**Goal**: Build the mobile-first React component tree, rendering the responsive board grid, cells, SVG marks, scoreboard, turn indicator, and screen routing.
**Depends on**: Phase 3
**Requirements**: CORE-07, UI-01, UI-02
**Success Criteria**:
  1. Splash screen displays "Tap to play" and unlocks the app.
  2. Opponent selection screen displays 5 cards with saved records.
  3. Game screen renders responsive 3×3 board, scoreboard, and turn indicator.
  4. Tapping empty cells places marks and triggers CPU responses with natural delay.
**Plans**: 2 plans

Plans:
- [x] 04-01: Build core board components: `Board`, `Cell`, `Mark`, `Scoreboard`, `TurnIndicator`.
- [x] 04-02: Build screens (`SplashScreen`, `OpponentSelect`, `GameScreen`) and wire up screen router in `App.tsx`.

---

### Phase 5: Menus, Settings & Dialogs
**Goal**: Add the top navigation bar, sliding menu drawer, score reset confirmation dialog, How to Play instructions, and sound toggle.
**Depends on**: Phase 4
**Requirements**: UI-03, UI-04, UI-05
**Success Criteria**:
  1. TopBar hamburger button opens MenuDrawer smoothly.
  2. "Reset scores" prompts for confirmation before resetting only the current opponent's score.
  3. "How to play" opens the reference guide with tips and rules.
  4. Sound toggle button toggles audio state and updates icon.
**Plans**: 1 plan

Plans:
- [x] 05-01: Implement `TopBar`, `MenuDrawer`, `ConfirmDialog`, `HowToPlay`, and `ResultSheet`.

---

### Phase 6: Audio, Haptics & Visual Polish
**Goal**: Implement zero-asset synthesized Web Audio effects, SVG stroke-dashoffset drawing animations, winning line strike, and confetti celebrations.
**Depends on**: Phase 5
**Requirements**: VIS-01, VIS-02, VIS-03, VIS-04, VIS-05, AUD-01, AUD-02, AUD-03, AUD-04
**Success Criteria**:
  1. Web Audio produces distinct synthesizer tones for X placement, O placement, UI taps, wins, losses, and ties.
  2. Marks and winning strike line animate with smooth stroke-dashoffset transitions.
  3. Human wins trigger celebratory confetti burst.
  4. `prefers-reduced-motion` suppresses motion animations and particle effects.
**Plans**: 2 plans

Plans:
- [x] 06-01: Implement `src/services/audio.ts` (synthesized Web Audio) and `src/services/haptics.ts`.
- [x] 06-02: Implement SVG stroke draw animations, `WinLine.tsx`, `confetti.ts`, and reduced motion support.

---

### Phase 7: Accessibility, Mobile Polish & PWA
**Goal**: Complete mobile viewport optimizations, semantic ARIA support, keyboard navigation, Lighthouse score auditing, and offline PWA service worker precaching.
**Depends on**: Phase 6
**Requirements**: MOB-01, MOB-02, MOB-03, MOB-04, A11Y-01, A11Y-02, A11Y-03, A11Y-04, PWA-01, PWA-02, PWA-03
**Success Criteria**:
  1. Full keyboard playability (arrow keys + 1-9 direct placement + Enter/Space).
  2. Screen reader announcements via `LiveAnnouncer` on moves and game results.
  3. No viewport bouncing or double-tap zoom glitches on mobile devices; safe-area insets respected.
  4. PWA installs to home screen and plays fully offline in airplane mode.
  5. Total gzipped bundle size <= 150KB.
**Plans**: 2 plans

Plans:
- [x] 07-01: Implement `LiveAnnouncer`, keyboard navigation hook (`useKeyboardBoard`), ARIA grid roles, and mobile layout hardening.
- [x] 07-02: Configure `vite-plugin-pwa`, app manifest, offline service worker caching, and bundle size verification.

---

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation & Tooling | 1/1 | Complete | 2026-09-21 |
| 2. Core Game Engine & AI | 2/2 | Complete | 2026-09-21 |
| 3. Game Store & State Machine | 1/1 | Complete | 2026-09-21 |
| 4. UI Components & Board Interaction | 2/2 | Complete | 2026-09-21 |
| 5. Menus, Settings & Dialogs | 1/1 | Complete | 2026-09-21 |
| 6. Audio, Haptics & Visual Polish | 2/2 | Complete | 2026-09-21 |
| 7. Accessibility, Mobile Polish & PWA | 2/2 | Complete | 2026-09-21 |

