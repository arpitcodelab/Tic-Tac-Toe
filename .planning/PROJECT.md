# Tic Tac Toe (Mobile-First Web Game)

## What This Is

A polished, fast-loading, mobile-first Tic Tac Toe web game built with React 18, TypeScript, and Vite, designed to run instantly in any mobile browser as an installable PWA. It provides single-device 2-player pass-and-play and 4 computer difficulty levels (Easy, Medium, Hard, and an unbeatable Minimax Expert), featuring crisp SVG stroke animations, synthesized Web Audio sound effects, and persistent per-opponent score tracking.

## Core Value

The most satisfying, responsive, and tactile Tic Tac Toe experience on mobile browsers, featuring an unbeatable Expert AI and zero bloat.

## Business Context

- **Customer**: Casual mobile gamers, kids, parents, and competitive players looking for a quick, high-quality classic game.
- **Revenue model**: 100% Free and open-source (no ads, no tracking, no paywalls, zero backend).
- **Success metric**: 60fps animations, under 150KB gzip bundle, < 2s TTI on 4G, 100% unbeatable Expert AI.
- **Strategy notes**: Reference product is Gametable.org Tic Tac Toe (rebuilt with original design, open-licensed assets, and modern Web standards).

## Requirements

### Validated

(None yet — ship phases to validate)

### Active

- [ ] **CORE-01**: 3×3 grid, standard win (3-in-a-row) and tie rules (FR-1..FR-4)
- [ ] **CORE-02**: Starter alternation across games (Game 1: P1, Game 2: P2/CPU, etc.) (FR-5)
- [ ] **CORE-03**: Stable player mark mapping (P1 is always X, P2/CPU is always O) (FR-6)
- [ ] **AI-01**: 4 distinct CPU levels (Easy random, Medium 60% block, Hard blunder rate, Expert perfect Minimax) (FR-20..FR-23)
- [ ] **SCORE-01**: Scoreboard tracking Wins, Ties, Losses per opponent with persistence in localStorage (FR-30..FR-34)
- [ ] **MENU-01**: Top navigation with menu drawer (Reset current opponent scores, Change opponent, How to play) (FR-40..FR-44)
- [ ] **AUDIO-01**: Synthesized Web Audio sound effects (mark placement, UI taps, win, lose, tie) with audio unlock gate (FR-50..FR-52)
- [ ] **VIS-01**: Animated SVG stroke-dashoffset marks, winning strike-through line, and confetti celebration (FR-55..FR-60)
- [ ] **MOB-01**: Touch targets >= 48px, dvh viewport sizing, overscroll lock, safe-area insets, portrait & landscape support (FR-80..FR-86)
- [ ] **A11Y-01**: Semantic ARIA grid, LiveAnnouncer for screen readers, full keyboard navigation, AA contrast (NFR-A1..NFR-A6)
- [ ] **PWA-01**: Installable PWA with offline precaching via vite-plugin-pwa (FR-70..FR-72)

### Out of Scope

- Online multiplayer or backend servers — keeps game pure, offline-first, zero cost.
- Boards larger than 3×3 in v1.0 — maintain focus on classic game perfection.
- Copying Gametable.org proprietary assets/branding — reference mechanics only, original code/art/sound.
- Ads, user accounts, and tracking cookies — respect user privacy and guarantee instant loading.

## Context

- Reference implementation in `tic/` analyzed for UI/flow mechanics.
- Detailed architectural blueprint in `Architecture.md` and requirements in `PRD.md`.
- Uses Web Audio API oscillator synthesis instead of external audio files to eliminate audio asset licensing and bandwidth.
- Fredoka rounded font (SIL OFL) self-hosted for a friendly, modern feel.

## Constraints

- **Tech Stack**: React 18, TypeScript (strict), Vite, Zustand, Plain CSS modules/tokens.
- **Bundle Budget**: Total gzipped JS/CSS <= 150 KB.
- **Licensing**: Permissive open source only (MIT / ISC / OFL).
- **Environment**: Local browser storage (`localStorage`) only; zero network requests at runtime.
- **Mobile First**: Optimized for phones (320px–430px wide), responsive to tablets and desktop.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| React 18 + Zustand | Minimal footprint (~1KB state), easy component hierarchy, clean separation of engine from UI | Pending |
| Pure TS Core Engine | Pure logic decoupled from React/DOM allows 100% automated test coverage and fast AI benchmarking | Pending |
| Synthesized Web Audio | Zero audio file downloads, no licensing issues, low latency | Pending |
| Starter Alternation with Fixed Marks | Player 1 is always X and Opponent is always O to keep UI stable, while starter alternates | Pending |
| SVG Stroke-Dashoffset Animations | Lightweight GPU-accelerated drawing effect without heavy external animation libraries | Pending |

---
*Last updated: 2026-09-21 after project initialization*

