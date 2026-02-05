'use client';

import { motion } from 'framer-motion';
import type { Position } from '@/types/game';

interface MinotaurProps {
  position: Position;
  cellSize: number;
}

export function Minotaur({ position, cellSize }: MinotaurProps) {
  const cx = position.x * cellSize + cellSize / 2;
  const cy = position.y * cellSize + cellSize / 2;
  const r = cellSize * 0.4;

  return (
    <motion.g
      initial={false}
      animate={{ x: cx, y: cy }}
      transition={{ type: 'spring', stiffness: 350, damping: 28 }}
    >
      <defs>
        <filter id="minotaur-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feFlood floodColor="#fca5a5" floodOpacity="0.6" result="glow" />
          <feComposite in="glow" in2="blur" operator="in" result="softGlow" />
          <feMerge>
            <feMergeNode in="softGlow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <circle
        r={r}
        fill="#dc2626"
        filter="url(#minotaur-glow)"
        stroke="#fca5a5"
        strokeWidth="1.5"
      />
      <text
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#0a0e1a"
        fontSize={r * 1.2}
        fontWeight="bold"
      >
        M
      </text>
    </motion.g>
  );
}
