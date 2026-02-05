'use client';

import { useCallback } from 'react';
import { useGameStore } from '@/stores/gameStore';
import type { Direction } from '@/types/game';

export function useGameLogic() {
  const moveHero = useGameStore((s) => s.moveHero);
  const selectedHeroId = useGameStore((s) => s.selectedHeroId);
  const phase = useGameStore((s) => s.phase);
  const movesRemaining = useGameStore((s) => s.movesRemaining);

  const handleSwipe = useCallback(
    (direction: Direction) => {
      if (phase.type !== 'moving' || movesRemaining <= 0) return;
      const heroId = selectedHeroId;
      if (!heroId) return;
      const success = moveHero(heroId, direction);
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(success ? 30 : 80);
      }
    },
    [phase.type, movesRemaining, selectedHeroId, moveHero]
  );

  return { handleSwipe };
}
