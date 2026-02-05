import { create } from 'zustand';
import type { GameState, Hero, Position, Wall, GamePhase, TeamColor } from '@/types/game';
import { GRID_SIZE } from '@/types/game';
import { getTemplePositionForTeam, getWinningTeam, isValidMove } from '@/lib/gameRules';
import { findPathToNearestHero } from '@/lib/pathfinding';

const TEAMS: TeamColor[] = ['blue', 'red', 'yellow', 'white'];

function createInitialHeroes(): Hero[] {
  const heroes: Hero[] = [];
  const g = GRID_SIZE;
  const corners: [number, number][] = [[0, 0], [g - 1, 0], [0, g - 1], [g - 1, g - 1]];
  TEAMS.forEach((team, i) => {
    const [x, y] = corners[i];
    heroes.push({
      id: `hero-${team}`,
      team,
      position: { x, y },
      startPosition: { x, y },
      atTemple: false,
    });
  });
  return heroes;
}

const minotaurStart: Position = {
  x: Math.floor(GRID_SIZE / 2),
  y: Math.floor(GRID_SIZE / 2),
};

interface GameStore extends GameState {
  rollDice: () => number;
  moveHero: (heroId: string, direction: 'up' | 'down' | 'left' | 'right') => boolean;
  selectHero: (heroId: string | null) => void;
  activateMinotaur: () => Promise<void>;
  placeWall: (x: number, y: number, orientation: 'horizontal' | 'vertical') => void;
  nextTurn: () => void;
  resetGame: () => void;
  setPhase: (phase: GamePhase) => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  gridSize: GRID_SIZE,
  heroes: createInitialHeroes(),
  minotaurPosition: { ...minotaurStart },
  minotaurStartPosition: { ...minotaurStart },
  walls: [],
  currentDiceRoll: 0,
  phase: { type: 'rolling' },
  selectedHeroId: null,
  currentPlayerIndex: 0,
  movesRemaining: 0,

  rollDice: () => {
    const value = Math.floor(Math.random() * 6) + 1;
    set({
      currentDiceRoll: value,
      movesRemaining: value,
      phase: { type: 'moving' },
    });
    return value;
  },

  moveHero: (heroId, direction) => {
    const state = get();
    if (state.phase.type !== 'moving' || state.movesRemaining <= 0) return false;
    const hero = state.heroes.find((h) => h.id === heroId);
    if (!hero || hero.atTemple) return false;

    const { valid, newPosition } = isValidMove(
      hero.position,
      direction,
      state.walls,
      state.heroes,
      heroId,
      state.gridSize
    );
    if (!valid) return false;

    const heroes = state.heroes.map((h) =>
      h.id === heroId ? { ...h, position: newPosition } : h
    );

    const templePos = getTemplePositionForTeam(hero.team);
    const atTemple =
      newPosition.x === templePos.x && newPosition.y === templePos.y;
    const updatedHeroes = heroes.map((h) =>
      h.id === heroId ? { ...h, position: newPosition, atTemple: h.atTemple || atTemple } : h
    );

    const winner = getWinningTeam(
      updatedHeroes.map((h) =>
        h.id === heroId ? { ...h, position: newPosition, atTemple: h.atTemple || atTemple } : h
      )
    );
    if (winner) {
      set({
        heroes: updatedHeroes.map((h) =>
          h.id === heroId ? { ...h, position: newPosition, atTemple: h.atTemple || atTemple } : h
        ),
        phase: { type: 'victory', payload: { winner } },
        movesRemaining: 0,
      });
      return true;
    }

    let movesRemaining = state.movesRemaining - 1;
    let phase: GamePhase = state.phase;
    if (movesRemaining <= 0) {
      phase = { type: 'rolling' };
    }

    set({
      heroes: updatedHeroes,
      movesRemaining,
      phase,
    });
    return true;
  },

  selectHero: (heroId) => {
    set({ selectedHeroId: heroId });
  },

  activateMinotaur: async () => {
    let state = get();
    const path = findPathToNearestHero(
      state.minotaurPosition,
      state.heroes,
      state.walls,
      state.gridSize,
      8
    );
    if (path.length <= 1) {
      set({ phase: { type: 'rolling' } });
      return;
    }

    for (let i = 1; i < path.length; i++) {
      const newPos = path[i];
      set({ minotaurPosition: newPos });
      await new Promise((r) => setTimeout(r, 180));

      state = get();
      const caught = state.heroes.find(
        (h) => !h.atTemple && h.position.x === newPos.x && h.position.y === newPos.y
      );
      if (caught) {
        set((s) => ({
          heroes: s.heroes.map((h) =>
            h.id === caught.id
              ? { ...h, position: { ...h.startPosition }, atTemple: false }
              : h
          ),
          phase: { type: 'caught' },
        }));
        await new Promise((r) => setTimeout(r, 600));
        set({ phase: { type: 'rolling' } });
        return;
      }
    }
    set({ phase: { type: 'rolling' } });
  },

  placeWall: (x, y, orientation) => {
    const state = get();
    const id = `wall-${x}-${y}-${orientation}`;
    if (state.walls.some((w) => w.x === x && w.y === y && w.orientation === orientation)) return;
    set({ walls: [...state.walls, { id, x, y, orientation }] });
  },

  nextTurn: () => {
    set((s) => ({
      currentPlayerIndex: (s.currentPlayerIndex + 1) % 4,
      phase: { type: 'rolling' },
    }));
  },

  resetGame: () => {
    set({
      heroes: createInitialHeroes(),
      minotaurPosition: { ...minotaurStart },
      walls: [],
      currentDiceRoll: 0,
      phase: { type: 'rolling' },
      selectedHeroId: null,
      currentPlayerIndex: 0,
      movesRemaining: 0,
    });
  },

  setPhase: (phase) => set({ phase }),
}));
