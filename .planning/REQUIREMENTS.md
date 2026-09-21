# Requirements: Tic Tac Toe (Mobile-First Web Game)

**Defined:** 2026-09-21  
**Core Value:** The most satisfying, responsive, and tactile Tic Tac Toe experience on mobile browsers, featuring an unbeatable Expert AI and zero bloat.

## v1 Requirements

### Core Rules & Mechanics
- [x] **CORE-01**: 3×3 grid of 9 cells indexed 0–8; players alternate placing marks on empty cells.
- [x] **CORE-02**: Detect all 8 winning lines (3 horizontal, 3 vertical, 2 diagonal) for both X and O.
- [x] **CORE-03**: Detect Tie when all 9 cells are filled without a line (win evaluation precedes tie evaluation).
- [x] **CORE-04**: Starter alternation: Game 1 starts with Player 1, Game 2 with Opponent/CPU, resetting on opponent switch or score reset.
- [x] **CORE-05**: Fixed side assignment: Player 1 is always X, Player 2/CPU is always O.
- [x] **CORE-06**: Input locking: Occupied cells reject input; board is locked when game ends or while CPU thinks.
- [x] **CORE-07**: Splash / start gate: "Tap to play" screen unlocks Web Audio context and initializes app.

### Opponents & AI
- [x] **AI-01**: 5 opponent options selectable on home screen: 2 Players, Easy, Medium, Hard, Expert.
- [x] **AI-02**: Easy AI picks randomly among legal empty cells.
- [x] **AI-03**: Medium AI completes wins, blocks human wins with 60% probability, otherwise picks randomly.
- [x] **AI-04**: Hard AI completes wins, always blocks, prioritizes center/corners, with a 10% blunder rate.
- [x] **AI-05**: Expert AI uses depth-aware Minimax and never loses (1,000 game simulation test passes).
- [x] **AI-06**: Natural CPU delay of 400–800ms to simulate thinking and ensure readable move pacing.

### Score Tracking & Persistence
- [x] **SCORE-01**: Displays Player 1 wins, Ties, and Opponent wins per opponent.
- [x] **SCORE-02**: Stores separate scores for each of the 5 opponents in `localStorage`.
- [x] **SCORE-03**: Reset scores action clears only the active opponent's record after user confirmation.
- [x] **SCORE-04**: Fallback gracefully to in-memory state if `localStorage` is disabled or fails.

### UI & Navigation
- [x] **UI-01**: Opponent selection screen displaying opponent descriptors and saved records.
- [x] **UI-02**: Game screen layout: TopBar, Scoreboard, TurnIndicator, Board, Result Sheet.
- [x] **UI-03**: TopBar containing hamburger menu (left) and sound toggle (right).
- [x] **UI-04**: MenuDrawer providing Reset Scores, Change Opponent, and How to Play instructions.
- [x] **UI-05**: Result sheet showing outcome ("You win!", "Computer wins", "Tie") with "Play again" and "Change opponent".

### Visuals, Motion & Polish
- [x] **VIS-01**: X and O marks animate with SVG `stroke-dashoffset` draw in ~250ms.
- [x] **VIS-02**: Winning line draws across the 3 winning cells in ~400ms before showing result sheet.
- [x] **VIS-03**: Confetti burst on human win (lazy-loaded canvas-confetti).
- [x] **VIS-04**: Screen transitions and drawer overlays use smooth fades/slides (<= 250ms).
- [x] **VIS-05**: Full `prefers-reduced-motion` support disabling animations and particle bursts.

### Audio & Haptics
- [x] **AUD-01**: Synthesized Web Audio sound effects for UI tap, mark placement (distinct for X and O), win, lose, and tie.
- [x] **AUD-02**: Audio unlocked via initial user gesture on Splash screen.
- [x] **AUD-03**: Global sound toggle with persistent mute state.
- [x] **AUD-04**: Haptic tick on mark placement and vibration pattern on win (Vibration API where supported).

### Mobile & Accessibility
- [x] **MOB-01**: All interactive tap targets >= 48×48px.
- [x] **MOB-02**: Viewport sizing via `dvh` and safe-area insets (`env(safe-area-inset-*)`).
- [x] **MOB-03**: Disable double-tap zoom, pull-to-refresh bounce, and text selection during gameplay (`touch-action: manipulation`).
- [x] **MOB-04**: Full portrait and landscape responsiveness (landscape repositions scoreboard beside board).
- [x] **A11Y-01**: Board semantic structure with `role="grid"` and accessible cell button labels.
- [x] **A11Y-02**: `LiveAnnouncer` with `aria-live="polite"` announcing moves and game outcomes.
- [x] **A11Y-03**: Keyboard navigation (arrow keys to move, Enter/Space to place mark, 1-9 direct placement, Esc to close).
- [x] **A11Y-04**: WCAG AA contrast compliance in both light and dark color schemes.

### PWA & Performance
- [x] **PWA-01**: Installable PWA web manifest and service worker precaching via `vite-plugin-pwa`.
- [x] **PWA-02**: 100% playable offline in airplane mode after initial visit.
- [x] **PWA-03**: Production gzipped bundle size <= 150KB (actual: 56.85 KB).

## v2 Requirements

### Post-v1.0 Enhancements
- **V2-01**: WebRTC peer-to-peer online multiplayer.
- **V2-02**: Custom mark skins and board themes unlocked by wins.
- **V2-03**: 4×4 and Ultimate Tic Tac Toe variants.
- **V2-04**: Move undo and win-probability hint mode for learning.
- **V2-05**: Multi-language localization (i18n).

## Out of Scope

| Feature | Reason |
|---------|--------|
| Online backend / user accounts | Unnecessary complexity; keep game instant, private, and cost-free |
| Ads and telemetry tracking | Hurts performance and violates clean user experience goals |
| External audio files | Web Audio oscillator synthesis is lighter, zero-dependency, and avoids asset licensing |
| Copying Gametable proprietary assets | Legal and design integrity; build original clean aesthetic |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| CORE-01, CORE-02, CORE-03, CORE-04, CORE-05, CORE-06 | Phase 2 | Complete |
| AI-01, AI-02, AI-03, AI-04, AI-05, AI-06 | Phase 2 | Complete |
| SCORE-01, SCORE-02, SCORE-03, SCORE-04 | Phase 3 | Complete |
| CORE-07, UI-01, UI-02 | Phase 4 | Complete |
| UI-03, UI-04, UI-05 | Phase 5 | Complete |
| VIS-01, VIS-02, VIS-03, VIS-04, VIS-05 | Phase 6 | Complete |
| AUD-01, AUD-02, AUD-03, AUD-04 | Phase 6 | Complete |
| MOB-01, MOB-02, MOB-03, MOB-04 | Phase 7 | Complete |
| A11Y-01, A11Y-02, A11Y-03, A11Y-04 | Phase 7 | Complete |
| PWA-01, PWA-02, PWA-03 | Phase 7 | Complete |

**Coverage:**
- v1 requirements: 33 total
- Mapped to phases: 33
- Completed: 33 ✅
- Unmapped: 0 ✅

---
*Requirements defined: 2026-09-21*
