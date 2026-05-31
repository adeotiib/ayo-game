import { Player } from '@/types/game';

export const P1_PITS = [0, 1, 2, 3, 4, 5];
export const P2_PITS = [7, 8, 9, 10, 11, 12];
export const P1_STORE = 6;
export const P2_STORE = 13;
export const TOTAL = 14;

export const INITIAL_PITS: number[] = [
  4, 4, 4, 4, 4, 4, 0,   // P1 pits 0-5, P1 store (index 6)
  4, 4, 4, 4, 4, 4, 0,   // P2 pits 7-12, P2 store (index 13)
];

// y=0.22 sits exactly on the board top surface
export const PIT_POSITIONS: [number, number, number][] = [
  [-2.5, 0.22, 0.75],  // 0 P1
  [-1.5, 0.22, 0.75],  // 1 P1
  [-0.5, 0.22, 0.75],  // 2 P1
  [ 0.5, 0.22, 0.75],  // 3 P1
  [ 1.5, 0.22, 0.75],  // 4 P1
  [ 2.5, 0.22, 0.75],  // 5 P1
  [ 3.75, 0.22, 0.0],  // 6 P1 store
  [ 2.5, 0.22,-0.75],  // 7 P2
  [ 1.5, 0.22,-0.75],  // 8 P2
  [ 0.5, 0.22,-0.75],  // 9 P2
  [-0.5, 0.22,-0.75],  // 10 P2
  [-1.5, 0.22,-0.75],  // 11 P2
  [-2.5, 0.22,-0.75],  // 12 P2
  [-3.75, 0.22, 0.0],  // 13 P2 store
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

// In Ayo/Oware, seeds are NEVER sown into stores — stores only receive captured seeds.
function nextPit(current: number): number {
  let n = (current + 1) % TOTAL;
  // Skip both stores during sowing
  if (n === P1_STORE || n === P2_STORE) n = (n + 1) % TOTAL;
  return n;
}

export interface MoveResult {
  newPits: number[];
  sowingPath: number[];
}

export function makeMove(pits: number[], pit: number, player: Player): MoveResult {
  const newPits = [...pits];
  let seeds = newPits[pit];
  newPits[pit] = 0;

  const sowingPath: number[] = [];
  let cur = pit;

  while (seeds > 0) {
    cur = nextPit(cur);
    // If seeds > 11 we'd lap the board; skip the starting pit on a full lap (Oware rule)
    if (cur === pit) cur = nextPit(cur);
    newPits[cur]++;
    sowingPath.push(cur);
    seeds--;
  }

  // Ayo capture: last seed lands in an OPPONENT pit that now has 2 or 3 seeds.
  // Also capture all consecutive opponent pits backwards (against sowing direction) with 2 or 3.
  const oppPits = player === 1 ? P2_PITS : P1_PITS;
  const store = getPlayerStore(player);

  if (oppPits.includes(cur)) {
    let idx = oppPits.indexOf(cur);
    let captured = 0;
    // Walk backwards through opponent pits (decreasing index = against sowing direction)
    while (idx >= 0) {
      const p = oppPits[idx];
      if (newPits[p] === 2 || newPits[p] === 3) {
        captured += newPits[p];
        newPits[p] = 0;
        idx--;
      } else {
        break;
      }
    }
    if (captured > 0) newPits[store] += captured;
  }

  return { newPits, sowingPath };
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

  // One side is empty — remaining seeds go to the other player's store
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
