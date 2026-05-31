'use client';
import { useGameStore } from '@/lib/gameStore';
import { useAutoFullscreen } from '@/lib/useAutoFullscreen';
import { Menu } from './Menu';
import { GameCanvas } from './GameCanvas';

export default function GameApp() {
  const phase = useGameStore(s => s.phase);
  useAutoFullscreen(); // auto-fullscreen on mobile landscape

  return (
    <div className="w-full h-full">
      {phase === 'menu' ? <Menu /> : <GameCanvas />}
    </div>
  );
}
