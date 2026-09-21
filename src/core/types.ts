export type Mark = 'X' | 'O';
export type Cell = Mark | null;

/** Always length 9. Index = row * 3 + col (0 through 8). */
export type Board = readonly Cell[];

export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';
export type OpponentId = 'two-player' | `cpu-${Difficulty}`;
export type Side = 'p1' | 'p2'; // p2 = friend or CPU

export type WinLine = readonly [number, number, number];

export type Outcome =
  | { status: 'in_progress' }
  | { status: 'win'; winner: Mark; line: WinLine }
  | { status: 'tie' };

/** Function returning a float in [0, 1). Injectable for deterministic testing. */
export type Rng = () => number;

