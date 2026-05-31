'use client';
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { Scene3D } from './game/Scene3D';
import { useGameStore } from '@/lib/gameStore';
import { P1_STORE, P2_STORE } from '@/lib/gameLogic';
import { useFullscreen } from '@/lib/useFullscreen';
import { FullscreenButton } from './FullscreenButton';

function HUD() {
  const { displayPits, currentPlayer, phase, winner, mode, goToMenu, startGame, handPlayer } =
    useGameStore();
  const { isFullscreen, toggle: toggleFs, supported: fsSupported } = useFullscreen();

  const p1Score = displayPits[P1_STORE];
  const p2Score = displayPits[P2_STORE];
  const p2Name = mode === 'ai' ? 'OTA' : 'P2';

  const p2Active = currentPlayer === 2 && phase === 'playing';
  const p1Active = currentPlayer === 1 && phase === 'playing';
  const p2Playing = phase === 'animating' && handPlayer === 2;

  return (
    <div className="absolute inset-0 pointer-events-none select-none">

      {/* ── P2 pill (top centre) ── */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2">
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all
          ${p2Active
            ? 'border-amber-400 bg-amber-900/80 text-amber-200 shadow-lg shadow-amber-500/30'
            : 'border-amber-800/40 bg-black/40 text-amber-700'}`}>
          <span className="font-bold tracking-widest text-xs sm:text-sm">{p2Name}</span>
          <span className="text-base sm:text-lg font-black">{p2Score}</span>
          {p2Active && <span className="text-[10px] sm:text-xs animate-pulse">▼ TURN</span>}
          {p2Playing && <span className="text-[10px] sm:text-xs animate-bounce">✋</span>}
        </div>
      </div>

      {/* ── P1 pill (bottom centre) ── */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all
          ${p1Active
            ? 'border-amber-400 bg-amber-900/80 text-amber-200 shadow-lg shadow-amber-500/30'
            : 'border-amber-800/40 bg-black/40 text-amber-700'}`}>
          <span className="font-bold tracking-widest text-xs sm:text-sm">P1</span>
          <span className="text-base sm:text-lg font-black">{p1Score}</span>
          {p1Active && <span className="text-[10px] sm:text-xs animate-pulse">▲ TURN</span>}
        </div>
      </div>

      {/* ── Menu button (top left) ── */}
      <button
        onClick={goToMenu}
        className="absolute top-2 left-2 pointer-events-auto
          min-w-[44px] min-h-[44px] flex items-center justify-center
          px-3 py-2 text-xs text-amber-700 border border-amber-800/40 rounded-lg
          bg-black/30 hover:bg-amber-900/40 hover:text-amber-400 active:scale-95 transition-all"
      >
        ← MENU
      </button>

      {/* ── Fullscreen button (top right) ── */}
      {fsSupported && (
        <FullscreenButton
          isFullscreen={isFullscreen}
          onToggle={toggleFs}
          className="absolute top-2 right-2 pointer-events-auto"
        />
      )}

      {/* ── Game over overlay ── */}
      {phase === 'gameover' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-auto px-4">
          <div className="w-full max-w-sm bg-[#1A0800]/92 border-2 border-amber-600 rounded-2xl
            p-6 sm:p-10 text-center shadow-2xl">
            <div className="text-4xl sm:text-5xl mb-3">
              {winner === 'draw' ? '🤝' : '🏆'}
            </div>
            <h2 className="text-xl sm:text-3xl font-bold text-amber-300 mb-2 tracking-wider">
              {winner === 'draw'
                ? "IT'S A DRAW!"
                : winner === 1
                ? 'PLAYER 1 WINS!'
                : mode === 'ai' ? 'OTA WINS!' : 'PLAYER 2 WINS!'}
            </h2>
            <p className="text-amber-600 mb-6 text-sm">{p1Score} – {p2Score}</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => startGame(mode)}
                className="flex-1 max-w-[140px] py-3 bg-amber-600 hover:bg-amber-500
                  active:scale-95 text-white font-bold rounded-full text-sm transition-all"
              >
                PLAY AGAIN
              </button>
              <button
                onClick={goToMenu}
                className="flex-1 max-w-[140px] py-3 border border-amber-600 text-amber-400
                  hover:bg-amber-900/40 active:scale-95 font-bold rounded-full text-sm transition-all"
              >
                MENU
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function GameCanvas() {
  return (
    <div className="relative w-full h-full">
      <Canvas
        shadows
        gl={{ antialias: true, alpha: false }}
        style={{ background: '#1A0800' }}
      >
        <Suspense fallback={null}>
          <Scene3D />
        </Suspense>
      </Canvas>
      <HUD />
    </div>
  );
}
