import { Player } from '@/types/game';
import { makeMove, checkGameOver, getValidMoves, P1_STORE, P2_STORE } from './gameLogic';

function evaluate(pits: number[]): number {
  return pits[P2_STORE] - pits[P1_STORE];
}

function minimax(
  pits: number[],
  player: Player,
  depth: number,
  alpha: number,
  beta: number,
  maximizing: boolean,
): number {
  const { isOver, finalPits } = checkGameOver(pits);
  if (isOver) return evaluate(finalPits);
  if (depth === 0) return evaluate(pits);

  const moves = getValidMoves(pits, player);
  if (moves.length === 0) return evaluate(pits);

  if (maximizing) {
    let best = -Infinity;
    for (const m of moves) {
      const { newPits, extraTurn } = makeMove(pits, m, player);
      const score = extraTurn
        ? minimax(newPits, player, depth - 1, alpha, beta, true)
        : minimax(newPits, player === 1 ? 2 : 1, depth - 1, alpha, beta, false);
      best = Math.max(best, score);
      alpha = Math.max(alpha, score);
      if (beta <= alpha) break;
    }
    return best;
  } else {
    let best = Infinity;
    for (const m of moves) {
      const { newPits, extraTurn } = makeMove(pits, m, player);
      const score = extraTurn
        ? minimax(newPits, player, depth - 1, alpha, beta, false)
        : minimax(newPits, player === 1 ? 2 : 1, depth - 1, alpha, beta, true);
      best = Math.min(best, score);
      beta = Math.min(beta, score);
      if (beta <= alpha) break;
    }
    return best;
  }
}

export function getAIMove(pits: number[], depth = 5): number {
  const moves = getValidMoves(pits, 2);
  if (moves.length === 0) return -1;

  let best = -Infinity;
  let bestMove = moves[0];

  for (const m of moves) {
    const { newPits, extraTurn } = makeMove(pits, m, 2);
    const score = extraTurn
      ? minimax(newPits, 2, depth - 1, -Infinity, Infinity, true)
      : minimax(newPits, 1, depth - 1, -Infinity, Infinity, false);
    if (score > best) {
      best = score;
      bestMove = m;
    }
  }

  return bestMove;
}
