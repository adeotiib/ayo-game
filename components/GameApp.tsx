'use client';
import { useGameStore } from '@/lib/gameStore';
import { Menu } from './Menu';
import { GameCanvas } from './GameCanvas';

export default function GameApp() {
  const phase = useGameStore(s => s.phase);

  return (
    <div className="w-full h-full">
      {phase === 'menu' ? <Menu /> : <GameCanvas />}
    </div>
  );
}
