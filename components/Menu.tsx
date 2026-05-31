'use client';
import { useGameStore } from '@/lib/gameStore';

export function Menu() {
  const { startGame } = useGameStore();

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-[#1A0800] overflow-hidden">

      {/* Background diagonal pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg, #C8860A 0, #C8860A 2px, transparent 2px, transparent 14px
          ), repeating-linear-gradient(
            -45deg, #C8860A 0, #C8860A 2px, transparent 2px, transparent 14px
          )`,
        }}
      />

      {/* Glow */}
      <div className="absolute w-64 h-64 bg-amber-700/20 rounded-full blur-3xl pointer-events-none" />

      {/* Title */}
      <div className="relative text-center mb-8 sm:mb-10 px-4">
        <h1
          className="text-7xl sm:text-8xl font-black tracking-[0.3em] text-amber-400 drop-shadow-lg"
          style={{ textShadow: '0 0 40px rgba(200,134,10,0.6), 0 0 80px rgba(200,134,10,0.3)' }}
        >
          AYO
        </h1>
        <p className="text-amber-700 tracking-[0.4em] sm:tracking-[0.5em] text-[10px] sm:text-xs mt-2 uppercase">
          The Ancient Seed Game
        </p>
      </div>

      {/* Divider */}
      <div className="relative flex items-center gap-4 mb-8 sm:mb-10">
        <div className="h-px w-20 sm:w-24 bg-gradient-to-r from-transparent to-amber-700" />
        <div className="w-2 h-2 rounded-full bg-amber-600" />
        <div className="h-px w-20 sm:w-24 bg-gradient-to-l from-transparent to-amber-700" />
      </div>

      {/* Buttons — full-width on small screens */}
      <div className="relative flex flex-col gap-4 w-full max-w-xs px-6 sm:px-0 sm:w-64">
        <button
          onClick={() => startGame('pvp')}
          className="w-full min-h-[52px] py-4 px-6
            border-2 border-amber-600 rounded-full
            text-amber-300 font-bold tracking-widest text-sm
            hover:bg-amber-600 hover:text-white
            active:scale-95
            transition-all duration-200"
        >
          👥 2 PLAYERS
        </button>

        <button
          onClick={() => startGame('ai')}
          className="w-full min-h-[52px] py-4 px-6
            bg-amber-600 border-2 border-amber-500 rounded-full
            text-white font-bold tracking-widest text-sm
            hover:bg-amber-500
            active:scale-95
            transition-all duration-200 shadow-lg shadow-amber-700/30"
        >
          🤖 PLAY VS OTA
        </button>
      </div>

      {/* Rules — hidden on very small screens to save space */}
      <div className="relative mt-8 sm:mt-12 text-amber-800 text-xs text-center max-w-xs px-6 leading-relaxed hidden sm:block">
        <p>Sow seeds counter-clockwise. Capture when your last seed lands in an opponent pit with 2 or 3 seeds.</p>
      </div>

      {/* Kente strips top & bottom */}
      {['bottom-0', 'top-0'].map((pos) => (
        <div key={pos} className={`absolute ${pos} left-0 right-0 h-3 flex`}>
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
      ))}
    </div>
  );
}
