/** Game types for Minotaurus maze chase */

export type Direction = 'up' | 'down' | 'left' | 'right';

export interface Position {
  x: number;
  y: number;
}

export type TeamColor = 'blue' | 'red' | 'yellow' | 'white';

export interface Hero {
  id: string;
  team: TeamColor;
  position: Position;
  startPosition: Position;
  atTemple: boolean;
}

export interface Wall {
  id: string;
  /** Horizontal wall between (x,y) and (x+1,y) or vertical between (x,y) and (x,y+1) */
  x: number;
  y: number;
  orientation: 'horizontal' | 'vertical';
}

export interface GamePhase {
  type: 'rolling' | 'moving' | 'minotaur' | 'placing_wall' | 'victory' | 'caught';
  payload?: { diceValue?: number; winner?: TeamColor };
}

export interface GameState {
  gridSize: number;
  heroes: Hero[];
  minotaurPosition: Position;
  minotaurStartPosition: Position;
  walls: Wall[];
  currentDiceRoll: number;
  phase: GamePhase;
  selectedHeroId: string | null;
  currentPlayerIndex: number;
  /** Remaining moves for current hero this turn */
  movesRemaining: number;
}

export const TEAM_COLORS: Record<TeamColor, string> = {
  blue: '#3b82f6',
  red: '#ef4444',
  yellow: '#fbbf24',
  white: '#f3f4f6',
};

export const GRID_SIZE = 9;
