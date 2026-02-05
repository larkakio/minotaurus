'use client';

import { motion } from 'framer-motion';

interface DiceProps {
  value: number;
  onRoll: () => void;
  disabled?: boolean;
}

export function Dice({ value, onRoll, disabled }: DiceProps) {
  return (
    <motion.button
      type="button"
      onClick={onRoll}
      disabled={disabled}
      className="min-w-[44px] min-h-[44px] rounded-xl bg-labyrinth-wall border-2 border-labyrinth-wallGlow text-white font-bold text-xl flex items-center justify-center touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed"
      whileTap={!disabled ? { scale: 0.95 } : undefined}
      aria-label={value ? `Dice shows ${value}` : 'Roll dice'}
    >
      {value > 0 ? value : '?'}
    </motion.button>
  );
}
