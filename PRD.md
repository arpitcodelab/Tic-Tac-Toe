# PRD — Tic Tac Toe (Mobile-First Web Game)

| | |
|---|---|
| **Working title** | Tic Tac Toe (final brand name TBD) |
| **Document version** | 1.0 |
| **Type** | Free, open-source, browser-based game (installable PWA) |
| **Primary platform** | Mobile browsers (phones first), then tablet and desktop |
| **Reference product** | Gametable.org "Tic Tac Toe" (https://gametable.org/games/tic-tac-toe/) |

> **How to read this document.** Every requirement has an ID (e.g. `FR-12`) so an AI IDE or a human can reference it precisely ("implement FR-12 and FR-13"). Priority: **P0** = must ship in v1.0, **P1** = should ship in v1.0, **P2** = nice to have / later.

---

## 1. Overview

### 1.1 Summary
A polished, fast-loading Tic Tac Toe game that plays instantly in a browser on any phone. The player can face a computer opponent at four difficulty levels or play a friend on the same device. It has satisfying animations, simple sound effects, and per-opponent score tracking.

### 1.2 Vision
"The nicest Tic Tac Toe you have ever tapped on." The rules are trivial, so quality comes from feel: instant response, crisp visuals, tasteful motion and sound, and an AI that is fun at every level.

### 1.3 Goals
1. Reproduce the complete feature set of the reference game (see §2).
2. Feel native on a phone: thumb-friendly, no zoom or scroll glitches, works offline.
3. Load in under 2 seconds on a mid-range phone on a 4G connection.
4. Be built only with free, open-source tools and original or openly licensed assets.
5. Have clean, well-tested code that a beginner can extend (new themes, board sizes, online play).

### 1.4 Non-goals (v1.0)
- Online multiplayer, accounts, leaderboards (see Roadmap §16).
- Ads, in-app purchases, analytics, or tracking of any kind.
- Board sizes other than 3×3.
- Copying Gametable's artwork, audio, code, or branding. We rebuild the *idea* with original assets.

---

## 2. Reference Analysis (Gametable Tic Tac Toe)

### 2.1 What the reference page explicitly states
| # | Observed fact | How we treat it |
|---|---|---|
| A1 | 3×3 grid, players X and O, three in a row (horizontal, vertical, diagonal) wins | Core rule (FR-1..FR-4) |
| A2 | Full board with no line = Tie | FR-4 |
| A3 | "Choose your opponent" is the first step | Opponent select screen (FR-10) |
| A4 | **4 computer difficulties** + **2-player mode** | 5 opponents total (FR-11) |
| A5 | **Expert AI plays a perfect game** | Minimax AI that never loses (FR-21) |
| A6 | **Starting player alternates each game**: Player 1 starts game 1, Player 2/Computer starts game 2, and so on, "to keep gameplay fair over time" | FR-5 |
| A7 | Scores are tracked **per opponent** and can be reset ("reset your scores for the current opponent") | FR-30..FR-33 |
| A8 | **Top-left menu** resets scores; **top-right menu** toggles sound | FR-40, FR-41 |
| A9 | "Beautiful graphics and animations", "simple, pleasing sound effects" | FR-50..FR-60 |
| A10 | "Lightning fast loading", "easy to use interface", desktop and mobile | NFR (§12) |
| A11 | Loading indicator, then a "press here to play" gate | Splash / tap-to-start (FR-8), also unlocks mobile audio |
| A12 | Viewport allows zoom up to 5× | We keep pinch-zoom enabled for accessibility (NFR-A) |
| A13 | Free to play, cookie and privacy settings present | We ship with no cookies or trackers (§12.3) |

### 2.2 What I could NOT verify (the game runs in a script after page load)
Exact visual style, mark drawing animations, sound files, exact AI behaviour of Easy/Medium/Hard, exact menu layout, and whether marks are fixed (P1 = X) when the starter alternates. **These are treated as design decisions in this PRD** (marked *Decision*), and the AI rules in §7 are my own definition of four sensible difficulty tiers.

### 2.3 Where we intentionally go beyond the reference (P1/P2)
Dark mode, haptics, installable offline PWA, keyboard and screen-reader support, and win-line and confetti effects.

---

## 3. Target Users

| Persona | Need | Implication |
|---|---|---|
| **Casual mobile player** (commuter, waiting in line) | Open link, tap, play in under 5 s, one hand | Instant start, big tap targets, portrait-first |
| **Parent + child** on one phone or tablet | Pass-and-play, fun feedback, easy mode | 2-player mode, Easy AI, friendly visuals |
| **Competitive tinkerer** | "Can I tie the perfect AI?" | Expert AI, score tracking |
| **Accessibility-dependent player** | Screen reader, keyboard, reduced motion, high contrast | ARIA grid, reduced-motion support, non-colour cues |

---

## 4. Platform & Constraints

- **Delivery:** static website (HTML/JS/CSS) hosted free (GitHub Pages / Cloudflare Pages / Netlify). No backend.
- **Devices:** phones 320–430 px wide first, then tablets and desktop up to 1920 px.
- **Browsers (last 2 versions):** Chrome/Android, Safari/iOS 15+, Firefox, Edge, Samsung Internet.
- **Orientation:** portrait primary; landscape must remain fully usable.
- **Cost:** everything used must be free and open source (see Architecture.md §2 for licences).
- **Data:** stored locally only (`localStorage`). No network calls after the initial load.

---

## 5. Game Rules Specification (authoritative)

- **FR-1 (P0)** Board is a 3×3 grid of 9 cells, indexed 0–8 left→right, top→bottom.
- **FR-2 (P0)** Two marks: **X** and **O**. Players alternate placing one mark on an **empty** cell. Occupied cells reject input.
- **FR-3 (P0)** A player **wins** when they own all three cells of any of the 8 lines: 3 rows, 3 columns, 2 diagonals.
- **FR-4 (P0)** If all 9 cells are filled and no line exists, the result is a **Tie**. Win check happens before tie check (a 9th move that completes a line is a win).
- **FR-5 (P0) Starter alternation.** Games alternate who moves first: Game 1 → Player 1, Game 2 → Player 2 (or Computer), Game 3 → Player 1, and so on. The counter resets when the opponent changes or scores are reset.
- **FR-6 (P0)** *Decision:* Player 1 is always **X** and Player 2/Computer is always **O**, regardless of who moves first (keeps the UI and scoreboard stable). The turn indicator shows whose move it is.
- **FR-7 (P0)** After a game ends, input is locked and the result is shown. Starting the next game is a deliberate action (button), and the next game begins with the alternated starter.
- **FR-8 (P0)** **Splash / start gate:** a loading state, then a "Tap to play" screen. (This also satisfies browser audio-unlock rules.)

---

## 6. Functional Requirements

### 6.1 Opponent selection
- **FR-10 (P0)** Home screen shows the title and 5 opponent choices: **2 Players**, **Easy**, **Medium**, **Hard**, **Expert**. One tap selects and starts the match immediately.
- **FR-11 (P0)** Each opponent card shows a name, a short descriptor (e.g. "Perfect play, try to tie!") and that opponent's saved record (W–T–L) if any.
- **FR-12 (P1)** Remember the last chosen opponent and highlight it as "Continue".

### 6.2 Gameplay screen
- **FR-13 (P0)** Layout top→bottom: top bar, scoreboard, turn indicator, board, action area.
- **FR-14 (P0)** Tapping an empty cell places the current player's mark with an animation and sound. Response to touch must feel instant (mark begins to appear within one frame).
- **FR-15 (P0)** In CPU mode, the human cannot tap while the CPU is "thinking". The board shows a visible waiting state (dimmed cells or a pulsing indicator).
- **FR-16 (P0)** CPU replies after a short natural delay of **400–800 ms** (random within range) so moves are readable.
- **FR-17 (P0)** On a win, the winning line is highlighted with a drawn strike-through and the three marks pulse. On a tie, all marks briefly settle/dim with a "Tie" message.
- **FR-18 (P0)** Result banner or overlay shows "You win!" / "Player 1 wins!" / "Player 2 wins!" / "Computer wins" / "It's a tie" with two buttons: **Play again** (primary) and **Change opponent**.
- **FR-19 (P1)** Board cells show a subtle hover/press state; the last-placed mark is briefly emphasised.

### 6.3 AI opponents (details in §7)
- **FR-20 (P0)** Four CPU levels: Easy, Medium, Hard, Expert.
- **FR-21 (P0)** **Expert never loses**. It wins when the human errs and ties otherwise.
- **FR-22 (P0)** Easy is clearly beatable by a child. Hard is beatable only with a real mistake by the AI (small blunder rate). Difficulty must feel monotonic: Easy < Medium < Hard < Expert.
- **FR-23 (P1)** Expert's opening move is randomised among *equally optimal* moves so games do not feel identical.

### 6.4 Score tracking
- **FR-30 (P0)** Scoreboard displays three counters: **Player 1 wins**, **Ties**, **Opponent wins** (Player 2 or Computer).
- **FR-31 (P0)** Scores are stored **per opponent** (5 separate records). Switching opponent shows that opponent's own scores.
- **FR-32 (P0)** Scores persist across page reloads and app restarts (`localStorage`).
- **FR-33 (P0)** **Reset scores** (in the top-left menu) resets only the **current opponent's** record, after a confirmation prompt, and resets the starter alternation to Player 1.
- **FR-34 (P1)** Show a best-streak or current-streak stat per opponent.

### 6.5 Menus & settings
- **FR-40 (P0)** **Top-left menu** (hamburger icon): *Reset scores*, *Change opponent*, *How to play*.
- **FR-41 (P0)** **Top-right controls**: *Sound on/off* toggle (speaker icon, always visible), *Settings* (P1: haptics, theme).
- **FR-42 (P0)** **How to play** sheet with the reference's 7 tips: choose opponent → tap a square → three in a row wins → block two-in-a-row → try harder modes → sound toggle location → score reset location.
- **FR-43 (P1)** Settings: Sound, Haptics, Theme (System / Light / Dark), Reduced motion override.
- **FR-44 (P0)** Sound preference persists across sessions.

### 6.6 Audio
- **FR-50 (P0)** Sound effects: mark placed (X and O sound distinct), UI tap, win, lose, tie.
- **FR-51 (P0)** Audio only starts after the first user gesture (tap-to-play gate). A global mute is available and persistent.
- **FR-52 (P1)** No background music in v1.0 (reduces load size and annoyance).

### 6.7 Visuals & animation
- **FR-55 (P0)** X and O are drawn with **animated stroke** (SVG stroke-dashoffset) in ~250 ms, not just popped in.
- **FR-56 (P0)** Winning line draws across the three cells in ~400 ms.
- **FR-57 (P1)** Confetti burst on a human win (skipped when Reduced Motion is on).
- **FR-58 (P0)** Screen transitions (home ↔ game ↔ overlays) use short fades/slides (≤ 250 ms).
- **FR-59 (P0)** All animation respects `prefers-reduced-motion`: replace movement with simple opacity changes.
- **FR-60 (P1)** Animations run at 60 fps on a mid-range phone, using only `transform` and `opacity` where possible.

### 6.8 PWA & offline
- **FR-70 (P1)** Installable to the home screen (manifest + icons) with app-like standalone display.
- **FR-71 (P1)** Fully playable offline after first load (service worker precache).
- **FR-72 (P1)** Update strategy: silent auto-update, applied on next launch.

---

## 7. AI Difficulty Specification

All levels use the same interface: `chooseMove(board, aiMark, difficulty) → cellIndex`. Tunable values live in one config file so they can be rebalanced without code changes.

| Level | Behaviour | Target feel |
|---|---|---|
| **Easy** | Picks a **random empty cell**. 100% random. | Child can win. Occasionally blocks/wins by luck. |
| **Medium** | 1) Take a winning move if available. 2) Block the human's winning move **with 60% probability**. 3) Otherwise random. | Wins if you ignore it, but exploitable. |
| **Hard** | 1) Always take a win. 2) Always block. 3) Prefer centre, then corners, then edges. **10% of the time** plays a random move instead (blunder rate). | Solid; can be beaten with fork tactics if it blunders. |
| **Expert** | **Full minimax** (depth-aware, prefers quicker wins and slower losses). Random choice among equally-best moves. | Perfect play. Best result for the human is a tie. |

*Note:* the reference site only documents that Expert is perfect; the other three tiers are this PRD's definition. Rates above are starting values to be tuned in playtesting.

**Acceptance (automated):** simulate 1,000 games Expert vs. random and Expert vs. Expert. Expert must lose 0 games in every simulation. Win rates for a fixed random opponent must be ordered Easy < Medium < Hard < Expert.

---

## 8. Screens & Flows

### 8.1 Flow
```
Loading → Tap to Play → Opponent Select ⇄ Game Screen
                                          │
                                          ├─ Menu (left): Reset scores / Change opponent / How to play
                                          ├─ Sound toggle (right)
                                          └─ Result overlay → Play again | Change opponent
```

### 8.2 Wireframes (portrait, ~390 × 844)

**Opponent Select**
```
┌──────────────────────────┐
│                      🔊  │
│                          │
│       TIC  TAC  TOE      │
│      Choose opponent     │
│                          │
│  ┌────────────────────┐  │
│  │ 👥  2 Players      │  │
│  │     W 3 · T 1 · L 2│  │
│  └────────────────────┘  │
│  ┌────────────────────┐  │
│  │ 🙂  Easy           │  │
│  └────────────────────┘  │
│  ┌────────────────────┐  │
│  │ 😎  Medium         │  │
│  └────────────────────┘  │
│  ┌────────────────────┐  │
│  │ 🤖  Hard           │  │
│  └────────────────────┘  │
│  ┌────────────────────┐  │
│  │ 🧠  Expert         │  │
│  └────────────────────┘  │
│        How to play       │
└──────────────────────────┘
```

**Game Screen**
```
┌──────────────────────────┐
│ ☰                    🔊  │  ← top bar (menu left, sound right)
│                          │
│   You     Ties    CPU    │
│    3       1       2     │  ← scoreboard
│                          │
│      Your turn  (X)      │  ← turn indicator
│                          │
│     X │   │ O            │
│    ───┼───┼───           │
│       │ X │              │  ← board (square, centered,
│    ───┼───┼───           │     min(92vw, ~60vh, 520px))
│     O │   │              │
│                          │
│  [ Play again ]          │  ← visible only after game over
└──────────────────────────┘
```

**Result overlay (after game)**: board stays visible with the win line drawn. A bottom sheet slides up: title ("You win! 🎉"), primary button *Play again*, secondary *Change opponent*.

---

## 9. Visual Design Direction

*Decision:* clean, friendly, "paper-and-marker meets modern app". Original design, not a copy of the reference.

- **Style:** rounded shapes, thick rounded strokes, soft shadows, generous whitespace.
- **Palette (starting point, defined as CSS variables):**
  - Background: soft off-white `#F6F7FB` (light) / deep navy `#12141F` (dark)
  - X colour: vivid coral `#FF5C7A`; O colour: vivid teal `#19C3B1`
  - Accent / buttons: indigo `#5B6CFF`
  - Win highlight: warm yellow `#FFC93C`
  - Text: `#1B1E2B` (light) / `#F2F3F8` (dark)
- **Colour is never the only signal:** X and O have different shapes; win line is drawn, not only coloured.
- **Typography:** rounded, friendly, open-licence font (Fredoka, SIL OFL), self-hosted. Sizes: title 40 px, scoreboard numbers 32 px, body 16 px minimum.
- **Spacing:** 4-px base grid. Board cell gap 8 px. Corner radius 16 px (cards) / 20 px (board).
- **Iconography:** inline SVG (Lucide, ISC licence) so no icon font loads.

---

## 10. Mobile-Specific Requirements

- **FR-80 (P0)** Every interactive element has a touch target of **≥ 48 × 48 px**.
- **FR-81 (P0)** Layout uses dynamic viewport units (`dvh`) and safe-area insets so nothing hides behind notches or browser toolbars.
- **FR-82 (P0)** No accidental double-tap zoom or 300 ms tap delay (`touch-action: manipulation`); no text selection or long-press callout on game elements. Pinch-zoom on the page stays available.
- **FR-83 (P0)** Page never scrolls or bounces during play (single-screen layout, `overscroll-behavior: none`).
- **FR-84 (P1)** Haptic feedback via the Vibration API: short tick on placement, pattern on win. Silently ignored on unsupported devices (e.g. iOS Safari).
- **FR-85 (P0)** Works in both orientations. In landscape on short screens, the scoreboard moves to a side column and the board scales to fit the height.
- **FR-86 (P1)** Correct `theme-color` meta and manifest so the browser chrome matches the app.

---

## 11. Accessibility Requirements

- **NFR-A1 (P0)** Board is a semantic grid (`role="grid"` / cells are `<button>`s) with labels like "Row 1, column 2, empty" / "…, X".
- **NFR-A2 (P0)** A polite `aria-live` region announces moves and results ("O placed at row 2 column 3", "Player 1 wins").
- **NFR-A3 (P0)** Fully keyboard-playable: Tab/Arrow keys to move focus, Enter/Space to place, Esc to close menus. Visible focus ring.
- **NFR-A4 (P0)** Text contrast ≥ WCAG AA (4.5:1); non-text contrast ≥ 3:1.
- **NFR-A5 (P0)** Honour `prefers-reduced-motion`.
- **NFR-A6 (P1)** Dark theme; optional colour-blind-safe check for X/O colours.

---

## 12. Non-Functional Requirements

### 12.1 Performance
| Metric | Target |
|---|---|
| JS bundle (gzip) | **≤ 150 KB** total; no heavy game engine |
| First Contentful Paint (4G, mid-range phone) | ≤ 1.5 s |
| Time to Interactive | ≤ 2.0 s |
| Lighthouse (Mobile) Performance / Accessibility / Best Practices / PWA | ≥ 95 / ≥ 95 / ≥ 95 / installable |
| Tap-to-visual-feedback latency | ≤ 100 ms |
| Frame rate during animation | 60 fps target |

### 12.2 Reliability
- **NFR-R1** If `localStorage` is unavailable (private mode, quota), the game still works; scores just do not persist.
- **NFR-R2** Corrupt or old saved data is discarded safely (versioned schema), never crashing the app.
- **NFR-R3** The game logic must be deterministic and testable with a seedable random source.

### 12.3 Privacy & Security
- **NFR-P1** No cookies, no trackers, no third-party requests at runtime. All fonts and assets self-hosted.
- **NFR-P2** Only data stored: settings and scores, locally on the device. State this in a short in-app note.
- **NFR-P3** Serve over HTTPS with a strict Content-Security-Policy (no inline eval, no external origins).

### 12.4 Maintainability
- Game rules and AI are **pure TypeScript functions with no UI imports** and ≥ 95% test coverage.
- Strict TypeScript, ESLint and Prettier configured; CI runs lint, tests and build on every push.

---

## 13. Legal & Licensing

- Build with permissive open-source dependencies (MIT/ISC/Apache/OFL). List them in `LICENSES.md`.
- **Do not** copy Gametable's graphics, sounds, code, name or branding. Tic Tac Toe rules and the concept are public domain. Our implementation, art and sounds are original or openly licensed.
- Sound: synthesised in-browser (no files, no licensing issues), or CC0 packs (e.g. Kenney.nl) if files are preferred. Record attribution if any asset requires it.
- Project licence for our own code: MIT (suggested).

---

## 14. Release Plan & Milestones

| Milestone | Scope | Definition of done |
|---|---|---|
| **M0 – Foundation** | Repo, tooling, CI, design tokens | `npm run dev/build/test` all pass |
| **M1 – Core engine** | Rules, win/tie detection, AI (4 levels), unit tests | All engine tests + AI simulations green |
| **M2 – Playable MVP** | Opponent select, board, turn flow, result overlay | Full game vs every opponent works on a phone |
| **M3 – Scores & menus** | Scoreboard, persistence, reset, sound toggle, How to play | FR-30..FR-44 pass |
| **M4 – Polish** | Animations, audio, haptics, dark mode, confetti | FR-50..FR-60, FR-84 pass; feels great |
| **M5 – PWA & a11y** | Offline, install, keyboard/screen reader, Lighthouse ≥ 95 | NFR-A*, FR-70..72 pass |
| **M6 – Launch** | Deploy to free hosting, README, screenshots, licence file | Public URL works on iOS + Android |

---

## 15. QA Acceptance Checklist (v1.0)

**Rules**
- [ ] All 8 winning lines are detected for both X and O.
- [ ] A win on the 9th move is a win, not a tie.
- [ ] Occupied cells cannot be overwritten; input is locked after game over and while the CPU is thinking.
- [ ] Starting player alternates: P1, P2/CPU, P1, …; resets on opponent change and score reset.

**AI**
- [ ] Expert loses 0 of 1,000 simulated games as X and as O.
- [ ] Difficulty ordering holds in simulation (Easy < Medium < Hard < Expert).
- [ ] CPU never picks an occupied cell or moves after the game ended.

**Scores & persistence**
- [ ] Scores are separate per opponent and survive reload.
- [ ] Reset affects only the current opponent, after confirmation.
- [ ] Sound preference persists. App works with storage disabled.

**Mobile**
- [ ] iPhone SE size (320 px) through Pro Max size: no overflow, board fully visible with controls.
- [ ] Landscape works. Notch/safe areas are respected. No page scroll or zoom-on-tap.
- [ ] Installable; works offline in airplane mode after first load.

**Accessibility**
- [ ] Complete a game using only the keyboard. Screen reader announces moves and result.
- [ ] Reduced motion setting removes movement animations.

---

## 16. Roadmap (post v1.0, P2)
- Online multiplayer via free WebRTC/peer-to-peer or a free-tier backend.
- Themes and mark skins (unlockable by wins), daily challenge.
- Variants: 4×4, Misère (lose-on-three), Ultimate Tic Tac Toe.
- Win-probability hint mode and "undo" for learners.
- Localisation (Hindi, Spanish, French, etc.) via a simple string table.
- Share-result button using the Web Share API.

---

## 17. Open Decisions (defaults chosen; change if you disagree)
1. **Marks fixed (P1 = X)** while the starter alternates. Alternative: the starter is always X.
2. **Difficulty definitions** for Easy/Medium/Hard (only Expert is documented by the reference).
3. **Framework:** React + TypeScript (see Architecture.md). Alternative: Phaser or vanilla JS.
4. **Sound:** synthesised in-browser (zero files) vs. CC0 sound files.
5. **Brand name and logo** for the final release.
