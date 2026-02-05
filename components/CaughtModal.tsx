'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';

export function CaughtModal() {
  const phase = useGameStore((s) => s.phase);
  const setPhase = useGameStore((s) => s.setPhase);
  const open = phase.type === 'caught';

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
          onClick={() => setPhase({ type: 'rolling' })}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            onClick={(e) => e.stopPropagation()}
            className="rounded-2xl p-6 max-w-sm w-full text-center border-2 border-labyrinth-minotaur bg-labyrinth-bg shadow-[0_0_24px_rgba(220,38,38,0.3)]"
          >
            <p className="text-xl font-bold text-labyrinth-minotaurGlow mb-2">
              Minotaur caught you!
            </p>
            <p className="text-white/80 text-sm mb-4">
              Back to start. Roll again.
            </p>
            <button
              type="button"
              onClick={() => setPhase({ type: 'rolling' })}
              className="min-h-[44px] px-6 py-2 rounded-xl font-semibold bg-labyrinth-minotaur text-white touch-manipulation"
            >
              OK
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
