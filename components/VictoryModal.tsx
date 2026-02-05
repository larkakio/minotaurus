'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import { TEAM_COLORS } from '@/types/game';
import type { TeamColor } from '@/types/game';

export function VictoryModal() {
  const phase = useGameStore((s) => s.phase);
  const resetGame = useGameStore((s) => s.resetGame);
  const open = phase.type === 'victory' && phase.payload?.winner;

  const winner = phase.payload?.winner as TeamColor | undefined;
  const color = winner ? TEAM_COLORS[winner] : '#10b981';

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
          onClick={() => resetGame()}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="rounded-2xl p-6 max-w-sm w-full text-center border-2 shadow-xl"
            style={{
              backgroundColor: '#0a0e1a',
              borderColor: color,
              boxShadow: `0 0 24px ${color}40`,
            }}
          >
            <h2 className="text-2xl font-bold text-white mb-2">Victory!</h2>
            <p
              className="text-lg font-medium capitalize mb-4"
              style={{ color }}
            >
              {winner} team wins
            </p>
            <button
              type="button"
              onClick={() => resetGame()}
              className="min-h-[44px] px-6 py-2 rounded-xl font-semibold text-white touch-manipulation"
              style={{ backgroundColor: color }}
            >
              Play again
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
