'use client';

import { useGameStore } from '@/stores/gameStore';
import { TEAM_COLORS } from '@/types/game';
import type { TeamColor } from '@/types/game';

export function HUD() {
  const phase = useGameStore((s) => s.phase);
  const movesRemaining = useGameStore((s) => s.movesRemaining);
  const selectedHeroId = useGameStore((s) => s.selectedHeroId);
  const heroes = useGameStore((s) => s.heroes);

  const teams: TeamColor[] = ['blue', 'red', 'yellow', 'white'];

  return (
    <div className="flex items-center justify-between gap-2 px-3 py-2 bg-labyrinth-bg/90 rounded-xl border border-labyrinth-grid">
      <div className="flex gap-1">
        {teams.map((team) => {
          const teamHeroes = heroes.filter((h) => h.team === team);
          const atTemple = teamHeroes.filter((h) => h.atTemple).length;
          return (
            <div
              key={team}
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border border-white/30"
              style={{ backgroundColor: TEAM_COLORS[team], color: team === 'white' ? '#1f2937' : '#fff' }}
              title={`${team}: ${atTemple} at temple`}
            >
              {atTemple}
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-2">
        {phase.type === 'moving' && (
          <span className="text-labyrinth-cyan text-sm">
            Moves: {movesRemaining}
          </span>
        )}
        {phase.type === 'moving' && selectedHeroId && (
          <span className="text-labyrinth-wallGlow text-xs">
            Swipe to move
          </span>
        )}
      </div>
    </div>
  );
}
