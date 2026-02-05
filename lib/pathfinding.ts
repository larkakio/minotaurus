/**
 * A* pathfinding for Minotaur AI.
 * Finds shortest path on grid, avoiding walls and respecting no diagonal movement.
 */

import type { Position } from '@/types/game';
import type { Wall } from '@/types/game';

interface AStarNode {
  pos: Position;
  g: number;
  h: number;
  f: number;
  parent: AStarNode | null;
}

function posKey(p: Position): string {
  return `${p.x},${p.y}`;
}

function manhattan(a: Position, b: Position): number {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

/** Check if there is a wall between two adjacent cells (no diagonal). */
function hasWallBetween(
  from: Position,
  to: Position,
  walls: Wall[]
): boolean {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  if (Math.abs(dx) + Math.abs(dy) !== 1) return true; // not adjacent

  for (const w of walls) {
    if (w.orientation === 'horizontal') {
      // wall between (w.x, w.y) and (w.x+1, w.y)
      const minX = Math.min(from.x, to.x);
      const maxX = Math.max(from.x, to.x);
      const sameY = from.y === to.y && from.y === w.y;
      if (sameY && w.x === minX && w.x + 1 === maxX) return true;
    } else {
      // vertical: between (w.x, w.y) and (w.x, w.y+1)
      const minY = Math.min(from.y, to.y);
      const maxY = Math.max(from.y, to.y);
      const sameX = from.x === to.x && from.x === w.x;
      if (sameX && w.y === minY && w.y + 1 === maxY) return true;
    }
  }
  return false;
}

function getNeighbors(pos: Position, walls: Wall[], gridSize: number): Position[] {
  const out: Position[] = [];
  const dirs: { dx: number; dy: number }[] = [
    { dx: 0, dy: -1 },
    { dx: 0, dy: 1 },
    { dx: -1, dy: 0 },
    { dx: 1, dy: 0 },
  ];
  for (const { dx, dy } of dirs) {
    const next: Position = { x: pos.x + dx, y: pos.y + dy };
    if (next.x < 0 || next.x >= gridSize || next.y < 0 || next.y >= gridSize) continue;
    if (hasWallBetween(pos, next, walls)) continue;
    out.push(next);
  }
  return out;
}

/**
 * A* from start to goal. Returns path including start and goal, or empty if no path.
 * Max steps can be limited for Minotaur (e.g. 8).
 */
export function aStar(
  start: Position,
  goal: Position,
  walls: Wall[],
  gridSize: number,
  maxSteps: number = 999
): Position[] {
  const open = new Map<string, AStarNode>();
  const closed = new Set<string>();
  const startKey = posKey(start);
  const startNode: AStarNode = {
    pos: start,
    g: 0,
    h: manhattan(start, goal),
    f: manhattan(start, goal),
    parent: null,
  };
  open.set(startKey, startNode);

  while (open.size > 0) {
    let current: AStarNode | null = null;
    let bestF = Infinity;
    for (const node of Array.from(open.values())) {
      if (node.f < bestF) {
        bestF = node.f;
        current = node;
      }
    }
    if (!current) break;

    const ckey = posKey(current.pos);
    open.delete(ckey);
    closed.add(ckey);

    if (current.pos.x === goal.x && current.pos.y === goal.y) {
      const path: Position[] = [];
      let n: AStarNode | null = current;
      while (n) {
        path.unshift(n.pos);
        n = n.parent;
      }
      return path.slice(0, maxSteps + 1);
    }

    if (current.g >= maxSteps) continue;

    for (const neighbor of getNeighbors(current.pos, walls, gridSize)) {
      const nkey = posKey(neighbor);
      if (closed.has(nkey)) continue;
      const g = current.g + 1;
      const h = manhattan(neighbor, goal);
      const f = g + h;
      const existing = open.get(nkey);
      if (!existing || g < existing.g) {
        open.set(nkey, {
          pos: neighbor,
          g,
          h,
          f,
          parent: current,
        });
      }
    }
  }
  return [];
}

/** Find nearest hero to Minotaur (by Manhattan distance, considering walls via path length). */
export function findPathToNearestHero(
  minotaurPos: Position,
  heroes: { position: Position; atTemple: boolean }[],
  walls: Wall[],
  gridSize: number,
  maxMoves: number = 8
): Position[] {
  const targets = heroes.filter((h) => !h.atTemple).map((h) => h.position);
  if (targets.length === 0) return [];

  let bestPath: Position[] = [];
  let bestLen = Infinity;

  for (const target of targets) {
    const path = aStar(minotaurPos, target, walls, gridSize, maxMoves);
    if (path.length > 1 && path.length < bestLen) {
      bestLen = path.length;
      bestPath = path;
    }
  }
  return bestPath;
}
