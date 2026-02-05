'use client';

import { useGameStore } from '@/stores/gameStore';
import { useSwipeControls } from '@/hooks/useSwipeControls';
import { useGameLogic } from '@/hooks/useGameLogic';
import { GameBoard } from './GameBoard';
import { Dice } from './Dice';
import { HUD } from './HUD';

export function Controls() {
  const phase = useGameStore((s) => s.phase);
  const rollDice = useGameStore((s) => s.rollDice);
  const currentDiceRoll = useGameStore((s) => s.currentDiceRoll);
  const activateMinotaur = useGameStore((s) => s.activateMinotaur);
  const selectHero = useGameStore((s) => s.selectHero);
  const selectedHeroId = useGameStore((s) => s.selectedHeroId);
  const heroes = useGameStore((s) => s.heroes);

  const { handleSwipe } = useGameLogic();
  const { handleTouchStart, handleTouchEnd } = useSwipeControls(handleSwipe);

  const canRoll = phase.type === 'rolling';
  const isMoving = phase.type === 'moving';

  const handleDiceRoll = () => {
    if (!canRoll) return;
    const value = rollDice();
    if (value === 6) {
      activateMinotaur();
    } else if (heroes.length > 0 && !selectedHeroId) {
      const firstMovable = heroes.find((h) => !h.atTemple);
      if (firstMovable) selectHero(firstMovable.id);
    }
  };

  return (
    <div
      className="flex flex-col items-center gap-3 p-3 min-h-[100dvh]"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <HUD />
      <div className="flex-1 flex flex-col items-center justify-center w-full">
        <GameBoard />
      </div>
      <div className="flex items-center gap-4 pb-4">
        <Dice
          value={currentDiceRoll}
          onRoll={handleDiceRoll}
          disabled={!canRoll}
        />
        {isMoving && (
          <p className="text-labyrinth-cyan text-sm">
            Tap a hero, then swipe to move
          </p>
        )}
      </div>
    </div>
  );
}
