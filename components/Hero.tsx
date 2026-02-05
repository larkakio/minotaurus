'use client';

import { motion } from 'framer-motion';
import type { Hero as HeroType } from '@/types/game';
import { TEAM_COLORS } from '@/types/game';

interface HeroProps {
  hero: HeroType;
  cellSize: number;
  selected: boolean;
  onClick: () => void;
}

export function Hero({ hero, cellSize, selected, onClick }: HeroProps) {
  const color = TEAM_COLORS[hero.team];
  const r = cellSize * 0.35;

  return (
    <motion.g
      onClick={onClick}
      style={{ cursor: 'pointer' }}
      initial={false}
      animate={{
        x: hero.position.x * cellSize + cellSize / 2,
        y: hero.position.y * cellSize + cellSize / 2,
      }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
    >
      <defs>
        <filter id={`hero-glow-${hero.id}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {selected && (
        <circle
          r={r + 4}
          fill="none"
          stroke="#06b6d4"
          strokeWidth="2"
          opacity="0.8"
        />
      )}
      <circle
        r={r}
        fill={color}
        filter={`url(#hero-glow-${hero.id})`}
        stroke={selected ? '#06b6d4' : 'rgba(255,255,255,0.4)'}
        strokeWidth={selected ? 2 : 1}
      />
      {hero.atTemple && (
        <circle r={r * 0.4} fill="#10b981" opacity={0.9} />
      )}
    </motion.g>
  );
}
