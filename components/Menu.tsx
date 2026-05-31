'use client';
import { useGameStore } from '@/lib/gameStore';

export function Menu() {
  const { startGame } = useGameStore();

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-[#1A0800] overflow-hidden">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            #C8860A 0, #C8860A 2px,
            transparent 2px, transparent 14px
          ), repeating-linear-gradient(
            -45deg,
            #C8860A 0, #C8860A 2px,
            transparent 2px, transparent 14px
          )`,
        }}
      />

      {/* Glow behind title */}
      <div className="absolute w-64 h-64 bg-amber-700/20 rounded-full blur-3xl" />

      {/* Title */}
      <div className="relative text-center mb-10">
        <h1
          className="text-8xl font-black tracking-[0.3em] text-amber-400 drop-shadow-lg"
          style={{ textShadow: '0 0 40px rgba(200,134,10,0.6), 0 0 80px rgba(200,134,10,0.3)' }}
        >
          AYO
        </h1>
        <p className="text-amber-700 tracking-[0.5em] text-xs mt-2 uppercase">
          The Ancient Seed Game
        </p>
      </div>

      {/* Divider */}
      <div className="relative flex items-center gap-4 mb-10">
        <div className="h-px w-24 bg-gradient-to-r from-transparent to-amber-700" />
        <div className="w-2 h-2 rounded-full bg-amber-600" />
        <div className="h-px w-24 bg-gradient-to-l from-transparent to-amber-700" />
      </div>

      {/* Buttons */}
      <div className="relative flex flex-col gap-4 w-64">
        <button
          onClick={() => startGame('pvp')}
          className="group w-full py-4 px-6 border-2 border-amber-600 rounded-full text-amber-300 font-bold tracking-widest text-sm hover:bg-amber-600 hover:text-white transition-all duration-200 hover:shadow-lg hover:shadow-amber-600/30"
        >
          <span className="group-hover:scale-105 inline-block transition-transform">
            👥 2 PLAYERS
          </span>
        </button>

        <button
          onClick={() => startGame('ai')}
          className="group w-full py-4 px-6 bg-amber-600 border-2 border-amber-500 rounded-full text-white font-bold tracking-widest text-sm hover:bg-amber-500 transition-all duration-200 hover:shadow-lg hover:shadow-amber-500/40"
        >
          <span className="group-hover:scale-105 inline-block transition-transform">
            🤖 PLAY VS OTA
          </span>
        </button>
      </div>

      {/* Rules snippet */}
      <div className="relative mt-12 text-amber-800 text-xs text-center max-w-xs leading-relaxed">
        <p>Sow seeds counter-clockwise. Land your last seed in your store for a bonus turn.</p>
        <p className="mt-1">Capture when your last seed lands in an empty pit on your side.</p>
      </div>

      {/* Bottom kente strip */}
      <div className="absolute bottom-0 left-0 right-0 h-3 flex">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 h-full"
            style={{
              backgroundColor: ['#C8860A', '#8B0000', '#2F4F00', '#FFD700', '#C8860A', '#8B0000'][i % 6],
            }}
          />
        ))}
      </div>
      <div className="absolute top-0 left-0 right-0 h-3 flex">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 h-full"
            style={{
              backgroundColor: ['#FFD700', '#C8860A', '#8B0000', '#2F4F00', '#FFD700', '#C8860A'][i % 6],
            }}
          />
        ))}
      </div>
    </div>
  );
}
