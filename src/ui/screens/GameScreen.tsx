import { useEffect, useState, useRef, type JSX } from 'react';
import { useGameStore } from '../../store/gameStore';
import { Board } from '../components/Board';
import { Scoreboard } from '../components/Scoreboard';
import { TurnIndicator } from '../components/TurnIndicator';
import { TopBar } from '../components/TopBar';
import { MenuDrawer } from '../components/MenuDrawer';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { HowToPlay } from '../components/HowToPlay';
import { ResultSheet } from '../components/ResultSheet';
import { LiveAnnouncer } from '../components/LiveAnnouncer';
import { useKeyboardBoard } from '../hooks/useKeyboardBoard';
import { AI_CONFIG, MOTION, OPPONENTS } from '../../core/config';
import { audio } from '../../services/audio';
import { haptics } from '../../services/haptics';
import { celebrate } from '../../services/confetti';

export function GameScreen(): JSX.Element {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false);

  const board = useGameStore((s) => s.board);
  const phase = useGameStore((s) => s.phase);
  const turn = useGameStore((s) => s.turn);
  const opponent = useGameStore((s) => s.opponent);
  const scores = useGameStore((s) => s.scores);
  const outcome = useGameStore((s) => s.outcome);
  const sound = useGameStore((s) => s.settings.sound);
  const hapticsEnabled = useGameStore((s) => s.settings.haptics);
  const placeMark = useGameStore((s) => s.placeMark);
  const runCpuTurn = useGameStore((s) => s.runCpuTurn);
  const finishResolving = useGameStore((s) => s.finishResolving);
  const resetScores = useGameStore((s) => s.resetScores);

  // Keyboard navigation
  useKeyboardBoard({
    onCloseModals: () => {
      setIsMenuOpen(false);
      setIsConfirmOpen(false);
      setIsHowToPlayOpen(false);
    },
  });

  const opponentInfo = OPPONENTS.find((o) => o.id === opponent);
  const opponentLabel = opponentInfo?.label ?? 'Opponent';
  const currentScore = opponent ? scores[opponent] ?? { p1: 0, ties: 0, p2: 0 } : { p1: 0, ties: 0, p2: 0 };

  // Sync services settings
  useEffect(() => {
    audio.enabled = sound;
  }, [sound]);

  useEffect(() => {
    haptics.enabled = hapticsEnabled;
  }, [hapticsEnabled]);

  // Track previous board to detect when a mark was placed
  const prevBoardRef = useRef(board);
  useEffect(() => {
    const prev = prevBoardRef.current;
    if (prev !== board) {
      const changedIndex = board.findIndex((cell, i) => cell !== null && prev[i] === null);
      if (changedIndex !== -1) {
        const mark = board[changedIndex];
        if (mark === 'X') {
          audio.play('placeX');
        } else if (mark === 'O') {
          audio.play('placeO');
        }
        haptics.tick();
      }
      prevBoardRef.current = board;
    }
  }, [board]);

  // Outcome reaction (sound + haptics + confetti)
  const outcomeHandledRef = useRef<string | null>(null);
  useEffect(() => {
    if (outcome.status === 'in_progress') {
      outcomeHandledRef.current = null;
      return;
    }

    const key = `${outcome.status}-${outcome.status === 'win' ? outcome.winner : ''}`;
    if (outcomeHandledRef.current === key) return;
    outcomeHandledRef.current = key;

    if (outcome.status === 'win') {
      const isHumanWin = opponent === 'two-player' || outcome.winner === 'X';
      if (isHumanWin) {
        audio.play('win');
        haptics.win();
        void celebrate();
      } else {
        audio.play('lose');
      }
    } else if (outcome.status === 'tie') {
      audio.play('tie');
    }
  }, [outcome, opponent]);

  // CPU Turn Effect with natural random delay (400-800ms)
  useEffect(() => {
    if (phase !== 'cpu_thinking') return;
    const { min, max } = AI_CONFIG.cpuDelayMs;
    const delay = min + Math.random() * (max - min);
    const timer = setTimeout(runCpuTurn, delay);
    return () => clearTimeout(timer);
  }, [phase, runCpuTurn]);

  // Resolving -> Round Over transition
  useEffect(() => {
    if (phase !== 'resolving') return;
    const timer = setTimeout(finishResolving, MOTION.resultDelayMs);
    return () => clearTimeout(timer);
  }, [phase, finishResolving]);

  const winLine = outcome.status === 'win' ? outcome.line : null;
  const isBoardDisabled = phase !== 'awaiting_input';
  const isResultOpen = phase === 'round_over';

  return (
    <div
      className="game-layout"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        height: '100%',
        padding: '8px 0',
        boxSizing: 'border-box',
      }}
    >
      <LiveAnnouncer />
      <TopBar onOpenMenu={() => setIsMenuOpen(true)} />
      <Scoreboard score={currentScore} opponentLabel={opponentLabel} />
      <TurnIndicator turn={turn} phase={phase} opponent={opponent} />
      <Board board={board} disabled={isBoardDisabled} winLine={winLine} onCellTap={placeMark} />
      <div style={{ minHeight: '40px' }} />

      <MenuDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onOpenResetConfirm={() => setIsConfirmOpen(true)}
        onOpenHowToPlay={() => setIsHowToPlayOpen(true)}
      />

      <ConfirmDialog
        isOpen={isConfirmOpen}
        title="Reset Scores?"
        message={`Are you sure you want to reset all scores for ${opponentLabel}? This cannot be undone.`}
        confirmLabel="Reset"
        cancelLabel="Cancel"
        onConfirm={() => {
          resetScores();
          setIsConfirmOpen(false);
        }}
        onCancel={() => setIsConfirmOpen(false)}
      />

      <HowToPlay
        isOpen={isHowToPlayOpen}
        onClose={() => setIsHowToPlayOpen(false)}
      />

      <ResultSheet isOpen={isResultOpen} />
    </div>
  );
}
