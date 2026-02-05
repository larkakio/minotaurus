/**
 * Victory conditions and valid move checks.
 */

import type { Position, Hero, Wall } from '@/types/game';
import { GRID_SIZE } from '@/types/game';

function hasWallBetween(
  from: Position,
  to: Position,
  walls: Wall[]
): boolean {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  if (Math.abs(dx) + Math.abs(dy) !== 1) return true;

  for (const w of walls) {
    if (w.orientation === 'horizontal') {
      const minX = Math.min(from.x, to.x);
      const maxX = Math.max(from.x, to.x);
      if (from.y === to.y && from.y === w.y && w.x === minX && w.x + 1 === maxX) return true;
    } else {
      const minY = Math.min(from.y, to.y);
      const maxY = Math.max(from.y, to.y);
      if (from.x === to.x && from.x === w.x && w.y === minY && w.y + 1 === maxY) return true;
    }
  }
  return false;
}

/** Check if position is occupied by another hero (not the one moving). */
function isOccupiedByOtherHero(
  pos: Position,
  heroes: Hero[],
  excludeHeroId: string
): boolean {
  return heroes.some(
    (h) => h.id !== excludeHeroId && !h.atTemple && h.position.x === pos.x && h.position.y === pos.y
  );
}

/** Check if position is the temple center (4,4) or one of the 4 colored temple cells. */
export function isTempleCell(pos: Position): boolean {
  const cx = GRID_SIZE / 2 - 0.5; // 4
  const cy = GRID_SIZE / 2 - 0.5;
  return pos.x === cx && pos.y === cy;
}

/** Temple zones: each team has one cell that counts as "their" temple. */
export function getTemplePositionForTeam(team: 'blue' | 'red' | 'yellow' | 'white'): Position {
  const c = Math.floor(GRID_SIZE / 2);
  switch (team) {
    case 'blue':
      return { x: c - 1, y: c - 1 };
    case 'red':
      return { x: c, y: c - 1 };
    case 'yellow':
      return { x: c - 1, y: c };
    case 'white':
      return { x: c, y: c };
    default:
      return { x: c, y: c };
  }
}

/** Valid move: one step in direction, inside grid, no wall, no other hero. */
export function isValidMove(
  from: Position,
  direction: 'up' | 'down' | 'left' | 'right',
  walls: Wall[],
  heroes: Hero[],
  excludeHeroId: string,
  gridSize: number = GRID_SIZE
): { valid: boolean; newPosition: Position } {
  let dx = 0,
    dy = 0;
  switch (direction) {
    case 'up':
      dy = -1;
      break;
    case 'down':
      dy = 1;
      break;
    case 'left':
      dx = -1;
      break;
    case 'right':
      dx = 1;
      break;
  }
  const newPosition: Position = { x: from.x + dx, y: from.y + dy };
  if (newPosition.x < 0 || newPosition.x >= gridSize || newPosition.y < 0 || newPosition.y >= gridSize) {
    return { valid: false, newPosition };
  }
  if (hasWallBetween(from, newPosition, walls)) {
    return { valid: false, newPosition };
  }
  if (isOccupiedByOtherHero(newPosition, heroes, excludeHeroId)) {
    return { valid: false, newPosition };
  }
  return { valid: true, newPosition };
}

/** Check if hero at position is on their team's temple cell → victory for that team. */
export function checkVictory(heroes: Hero[]): 'blue' | 'red' | 'yellow' | 'white' | null {
  for (const hero of heroes) {
    if (hero.atTemple) continue;
    const templePos = getTemplePositionForTeam(hero.team);
    if (hero.position.x === templePos.x && hero.position.y === templePos.y) {
      return hero.team;
    }
  }
  return null;
}

/** First team to have a hero reach their temple cell wins. */
export function getWinningTeam(heroes: Hero[]): 'blue' | 'red' | 'yellow' | 'white' | null {
  for (const h of heroes) {
    if (h.atTemple) return h.team;
    const tp = getTemplePositionForTeam(h.team);
    if (h.position.x === tp.x && h.position.y === tp.y) return h.team;
  }
  return null;
}
