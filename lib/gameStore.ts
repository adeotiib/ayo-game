'use client';
import { create } from 'zustand';
import { Player, GameMode, GamePhase } from '@/types/game';
import { INITIAL_PITS, makeMove, checkGameOver, isValidMove } from './gameLogic';
import { getAIMove } from './aiPlayer';

interface GameStore {
  pits: number[];
  displayPits: number[];
  currentPlayer: Player;
  mode: GameMode;
  phase: GamePhase;
  winner: Player | 'draw' | null;
  handPit: number | null;
  handPlayer: Player | null;
  isHandGrabbing: boolean;
  capturedPits: number[];

  startGame: (mode: GameMode) => void;
  selectPit: (pit: number) => void;
  goToMenu: () => void;
}

const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

async function runAnimation(
  pitIndex: number,
  get: () => GameStore,
  set: (s: Partial<GameStore>) => void,
) {
  const { pits, currentPlayer, mode } = get();

  // Grab animation
  set({ phase: 'animating', handPit: pitIndex, handPlayer: currentPlayer, isHandGrabbing: true, capturedPits: [] });
  await sleep(420);

  const { newPits, sowingPath } = makeMove(pits, pitIndex, currentPlayer);

  // Clear picked pit visually
  const display = [...pits];
  display[pitIndex] = 0;
  set({ displayPits: display, isHandGrabbing: false });

  // Animate sowing — one seed per pit
  let d = [...display];
  for (const target of sowingPath) {
    await sleep(280);
    set({ handPit: target });
    await sleep(160);
    d = [...d];
    d[target]++;
    set({ displayPits: [...d] });
  }

  await sleep(320);

  // Highlight captured pits (any pit that lost seeds)
  const capturedPits: number[] = [];
  for (let i = 0; i < INITIAL_PITS.length; i++) {
    if (newPits[i] < d[i]) capturedPits.push(i);
  }
  if (capturedPits.length > 0) {
    set({ displayPits: newPits, capturedPits });
    await sleep(700);
  }

  // Check game over
  const { isOver, finalPits, winner } = checkGameOver(newPits);
  if (isOver) {
    set({ pits: finalPits, displayPits: finalPits, phase: 'gameover', winner, handPit: null, capturedPits: [] });
    return;
  }

  // Switch to next player (no extra turns in Ayo)
  const next: Player = currentPlayer === 1 ? 2 : 1;
  set({
    pits: newPits,
    displayPits: newPits,
    currentPlayer: next,
    phase: 'playing',
    handPit: null,
    handPlayer: next,
    capturedPits: [],
  });

  // AI turn
  if (mode === 'ai' && next === 2) {
    await sleep(800);
    const aiPit = getAIMove(newPits);
    if (aiPit >= 0) runAnimation(aiPit, get, set);
  }
}

export const useGameStore = create<GameStore>((set, get) => ({
  pits: [...INITIAL_PITS],
  displayPits: [...INITIAL_PITS],
  currentPlayer: 1,
  mode: 'pvp',
  phase: 'menu',
  winner: null,
  handPit: null,
  handPlayer: 1,
  isHandGrabbing: false,
  capturedPits: [],

  startGame: (mode) => {
    set({
      pits: [...INITIAL_PITS],
      displayPits: [...INITIAL_PITS],
      currentPlayer: 1,
      mode,
      phase: 'playing',
      winner: null,
      handPit: null,
      handPlayer: 1,
      isHandGrabbing: false,
      capturedPits: [],
    });
  },

  selectPit: (pit) => {
    const { phase, pits, currentPlayer } = get();
    if (phase !== 'playing') return;
    if (!isValidMove(pits, pit, currentPlayer)) return;
    runAnimation(pit, get, set);
  },

  goToMenu: () =>
    set({
      phase: 'menu',
      pits: [...INITIAL_PITS],
      displayPits: [...INITIAL_PITS],
      winner: null,
      handPit: null,
      capturedPits: [],
    }),
}));
