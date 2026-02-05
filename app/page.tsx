'use client';

import { Controls } from '@/components/Controls';
import { VictoryModal } from '@/components/VictoryModal';
import { CaughtModal } from '@/components/CaughtModal';

export default function Home() {
  return (
    <main className="min-h-[100dvh] bg-[#0a0e1a] overflow-x-hidden">
      <div className="pt-4 pb-2 text-center">
        <h1 className="text-xl font-bold text-labyrinth-cyan tracking-wide">
          Minotaurus
        </h1>
        <p className="text-sm text-white/70">Cyberpunk Maze Chase</p>
      </div>
      <Controls />
      <VictoryModal />
      <CaughtModal />
    </main>
  );
}
