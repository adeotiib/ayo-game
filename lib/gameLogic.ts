import { Player } from '@/types/game';

export const P1_PITS = [0, 1, 2, 3, 4, 5];
export const P2_PITS = [7, 8, 9, 10, 11, 12];
export const P1_STORE = 6;
export const P2_STORE = 13;
export const TOTAL = 14;

export const INITIAL_PITS: number[] = [
  4, 4, 4, 4, 4, 4, 0,
  4, 4, 4, 4, 4, 4, 0,
];

// 3D world positions for each pit/store index
export const PIT_POSITIONS: [number, number, number][] = [
  [-2.5, 0.05, 0.8],  // 0 P1
  [-1.5, 0.05, 0.8],  // 1 P1
  [-0.5, 0.05, 0.8],  // 2 P1
  [ 0.5, 0.05, 0.8],  // 3 P1
  [ 1.5, 0.05, 0.8],  // 4 P1
  [ 2.5, 0.05, 0.8],  // 5 P1
  [ 3.9, 0.05, 0.0],  // 6 P1 store
  [ 2.5, 0.05,-0.8],  // 7 P2
  [ 1.5, 0.05,-0.8],  // 8 P2
  [ 0.5, 0.05,-0.8],  // 9 P2
  [-0.5, 0.05,-0.8],  // 10 P2
  [-1.5, 0.05,-0.8],  // 11 P2
  [-2.5, 0.05,-0.8],  // 12 P2
  [-3.9, 0.05, 0.0],  // 13 P2 store
];

export function getPlayerStore(player: Player) {
  return player === 1 ? P1_STORE : P2_STORE;
}

export function getPlayerPits(player: Player) {
  return player === 1 ? P1_PITS : P2_PITS;
}

export function isValidMove(pits: number[], pit: number, player: Player) {
  return getPlayerPits(player).includes(pit) && pits[pit] > 0;
}

export function getValidMoves(pits: number[], player: Player) {
  return getPlayerPits(player).filter(i => pits[i] > 0);
}

function nextIndex(current: number, player: Player): number {
  let n = (current + 1) % TOTAL;
  // skip opponent store
  if (player === 1 && n === P2_STORE) n = 0;
  if (player === 2 && n === P1_STORE) n = P1_STORE + 1;
  return n;
}

export interface MoveResult {
  newPits: number[];
  extraTurn: boolean;
  sowingPath: number[];
}

export function makeMove(pits: number[], pit: number, player: Player): MoveResult {
  const newPits = [...pits];
  let seeds = newPits[pit];
  newPits[pit] = 0;

  const sowingPath: number[] = [];
  let cur = pit;

  while (seeds > 0) {
    cur = nextIndex(cur, player);
    newPits[cur]++;
    sowingPath.push(cur);
    seeds--;
  }

  const store = getPlayerStore(player);
  const extraTurn = cur === store;

  // Capture: last seed in own empty pit (now has 1) with non-empty opposite
  if (!extraTurn && getPlayerPits(player).includes(cur) && newPits[cur] === 1) {
    const opp = 12 - cur; // works for pits 0-5 and 7-12
    if (newPits[opp] > 0) {
      newPits[store] += newPits[opp] + 1;
      newPits[cur] = 0;
      newPits[opp] = 0;
    }
  }

  return { newPits, extraTurn, sowingPath };
}

export interface GameOverResult {
  isOver: boolean;
  finalPits: number[];
  winner: Player | 'draw' | null;
}

export function checkGameOver(pits: number[]): GameOverResult {
  const p1Has = P1_PITS.some(i => pits[i] > 0);
  const p2Has = P2_PITS.some(i => pits[i] > 0);

  if (p1Has && p2Has) return { isOver: false, finalPits: pits, winner: null };

  const fp = [...pits];
  if (!p1Has) {
    P2_PITS.forEach(i => { fp[P2_STORE] += fp[i]; fp[i] = 0; });
  } else {
    P1_PITS.forEach(i => { fp[P1_STORE] += fp[i]; fp[i] = 0; });
  }

  const winner: Player | 'draw' =
    fp[P1_STORE] > fp[P2_STORE] ? 1 :
    fp[P2_STORE] > fp[P1_STORE] ? 2 : 'draw';

  return { isOver: true, finalPits: fp, winner };
}
