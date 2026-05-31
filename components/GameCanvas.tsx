'use client';
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { Scene3D } from './game/Scene3D';
import { useGameStore } from '@/lib/gameStore';
import { P1_STORE, P2_STORE } from '@/lib/gameLogic';

function LoadingScreen() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[#1A0800]">
      <p className="text-amber-400 text-xl tracking-widest animate-pulse">LOADING…</p>
    </div>
  );
}

function HUD() {
  const { displayPits, currentPlayer, phase, winner, mode, goToMenu, startGame } = useGameStore();

  const p1Score = displayPits[P1_STORE];
  const p2Score = displayPits[P2_STORE];
  const p2Name = mode === 'ai' ? 'OTA' : 'PLAYER 2';

  return (
    <div className="absolute inset-0 pointer-events-none select-none">
      {/* Top bar - P2 */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 flex items-center gap-4">
        <div className={`px-5 py-2 rounded-full border-2 transition-all ${
          currentPlayer === 2 && phase === 'playing'
            ? 'border-amber-400 bg-amber-900/70 text-amber-200 shadow-lg shadow-amber-500/30'
            : 'border-amber-800/50 bg-black/40 text-amber-700'
        }`}>
          <span className="font-bold tracking-widest text-sm">{p2Name}</span>
          <span className="ml-3 text-lg font-bold">{p2Score}</span>
          {currentPlayer === 2 && phase === 'playing' && (
            <span className="ml-2 text-xs animate-pulse">▼ YOUR TURN</span>
          )}
          {phase === 'animating' && useGameStore.getState().handPlayer === 2 && (
            <span className="ml-2 text-xs animate-bounce">✋ PLAYING…</span>
          )}
        </div>
      </div>

      {/* Bottom bar - P1 */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-4">
        <div className={`px-5 py-2 rounded-full border-2 transition-all ${
          currentPlayer === 1 && phase === 'playing'
            ? 'border-amber-400 bg-amber-900/70 text-amber-200 shadow-lg shadow-amber-500/30'
            : 'border-amber-800/50 bg-black/40 text-amber-700'
        }`}>
          <span className="font-bold tracking-widest text-sm">PLAYER 1</span>
          <span className="ml-3 text-lg font-bold">{p1Score}</span>
          {currentPlayer === 1 && phase === 'playing' && (
            <span className="ml-2 text-xs animate-pulse">▲ YOUR TURN</span>
          )}
        </div>
      </div>

      {/* Back button */}
      <button
        onClick={goToMenu}
        className="absolute top-3 left-3 pointer-events-auto px-3 py-1 text-xs text-amber-700 border border-amber-800/40 rounded bg-black/30 hover:bg-amber-900/40 hover:text-amber-400 transition-all"
      >
        ← MENU
      </button>

      {/* Game over overlay */}
      {phase === 'gameover' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
          <div className="bg-[#1A0800]/90 border-2 border-amber-600 rounded-2xl p-10 text-center shadow-2xl">
            <div className="text-5xl mb-4">
              {winner === 'draw' ? '🤝' : winner === 1 ? '🏆' : '🏆'}
            </div>
            <h2 className="text-3xl font-bold text-amber-300 mb-2 tracking-wider">
              {winner === 'draw'
                ? "IT'S A DRAW!"
                : winner === 1
                ? 'PLAYER 1 WINS!'
                : mode === 'ai' ? 'OTA WINS!' : 'PLAYER 2 WINS!'}
            </h2>
            <p className="text-amber-600 mb-6 text-sm">
              {p1Score} – {p2Score}
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => startGame(mode)}
                className="px-6 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-full transition-all"
              >
                PLAY AGAIN
              </button>
              <button
                onClick={goToMenu}
                className="px-6 py-2 border border-amber-600 text-amber-400 hover:bg-amber-900/40 font-bold rounded-full transition-all"
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
