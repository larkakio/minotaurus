'use client';

import type { Wall as WallType } from '@/types/game';

interface WallProps {
  wall: WallType;
  cellSize: number;
}

export function Wall({ wall, cellSize }: WallProps) {
  const stroke = '#a78bfa';
  const strokeWidth = Math.max(2, cellSize * 0.12);

  if (wall.orientation === 'horizontal') {
    const x1 = wall.x * cellSize;
    const y1 = (wall.y + 0.5) * cellSize;
    const x2 = (wall.x + 1) * cellSize;
    const y2 = y1;
    return (
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        filter="url(#wall-glow)"
      />
    );
  }

  const x1 = (wall.x + 0.5) * cellSize;
  const y1 = wall.y * cellSize;
  const x2 = x1;
  const y2 = (wall.y + 1) * cellSize;
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      filter="url(#wall-glow)"
    />
  );
}
