'use client';

import { useMemo } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { Hero } from './Hero';
import { Minotaur } from './Minotaur';
import { Wall } from './Wall';
import { getTemplePositionForTeam } from '@/lib/gameRules';

const BOARD_PADDING = 8;

export function GameBoard() {
  const heroes = useGameStore((s) => s.heroes);
  const minotaurPosition = useGameStore((s) => s.minotaurPosition);
  const walls = useGameStore((s) => s.walls);
  const gridSize = useGameStore((s) => s.gridSize);
  const selectedHeroId = useGameStore((s) => s.selectedHeroId);
  const selectHero = useGameStore((s) => s.selectHero);

  const { size, cellSize } = useMemo(() => {
    const maxW = typeof window !== 'undefined' ? Math.min(window.innerWidth - 24, 400) : 360;
    const maxH = typeof window !== 'undefined' ? Math.min(window.innerHeight - 200, 400) : 360;
    const boardPx = Math.min(maxW, maxH, 360);
    const cellSize = (boardPx - BOARD_PADDING * 2) / gridSize;
    const size = cellSize * gridSize + BOARD_PADDING * 2;
    return { size, cellSize };
  }, [gridSize]);

  const templePositions = useMemo(() => {
    return (['blue', 'red', 'yellow', 'white'] as const).map((team) =>
      getTemplePositionForTeam(team)
    );
  }, []);

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className="w-full max-w-[min(100vw-24px,400px)] aspect-square select-none"
      style={{ touchAction: 'none' }}
    >
      <defs>
        <filter id="wall-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1" result="blur" />
          <feFlood floodColor="#a78bfa" floodOpacity="0.5" result="glow" />
          <feComposite in="glow" in2="blur" operator="in" result="softGlow" />
          <feMerge>
            <feMergeNode in="softGlow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <pattern
          id="grid-pattern"
          width={cellSize}
          height={cellSize}
          patternUnits="userSpaceOnUse"
        >
          <path
            d={`M ${cellSize} 0 L 0 0 0 ${cellSize}`}
            fill="none"
            stroke="#1e3a8a"
            strokeWidth="0.5"
            opacity="0.6"
          />
        </pattern>
      </defs>

      <rect
        x={0}
        y={0}
        width={size}
        height={size}
        fill="#0a0e1a"
        rx={12}
      />
      <rect
        x={BOARD_PADDING}
        y={BOARD_PADDING}
        width={cellSize * gridSize}
        height={cellSize * gridSize}
        fill="url(#grid-pattern)"
      />

      {templePositions.map((pos, i) => {
        const colors = ['#3b82f6', '#ef4444', '#fbbf24', '#f3f4f6'];
        return (
          <rect
            key={i}
            x={BOARD_PADDING + pos.x * cellSize + 2}
            y={BOARD_PADDING + pos.y * cellSize + 2}
            width={cellSize - 4}
            height={cellSize - 4}
            fill={colors[i]}
            opacity={0.4}
            rx={4}
          />
        );
      })}

      <g transform={`translate(${BOARD_PADDING}, ${BOARD_PADDING})`}>
        <rect
          x={(gridSize / 2 - 0.5) * cellSize + 2}
          y={(gridSize / 2 - 0.5) * cellSize + 2}
          width={cellSize - 4}
          height={cellSize - 4}
          fill="#10b981"
          opacity={0.7}
          rx={4}
        />

        {walls.map((wall) => (
          <Wall key={wall.id} wall={wall} cellSize={cellSize} />
        ))}

        {heroes.map((hero) => (
          <Hero
            key={hero.id}
            hero={hero}
            cellSize={cellSize}
            selected={selectedHeroId === hero.id}
            onClick={() => selectHero(hero.id)}
          />
        ))}

        <Minotaur position={minotaurPosition} cellSize={cellSize} />
      </g>
    </svg>
  );
}
