import { is_moves_left, evaluate } from './gameUtils';

function minimax(board, depth, isMax, player, ai, alpha, beta) {

    const score = evaluate(board);

    // If don't have to look ahead anymore, return the score.
    if (depth === 0) return score;


    // If Maximizer or minimizer has won the game return his/her
    // evaluated score
    if (score === 10 || score === -10)
        return score;

    // If there are no more moves and no winner then
    // it is a tie
    if (is_moves_left(board) === false)
        return 0;

    // If this maximizer's move
    if (isMax) {
        let best = -1000;

        // Traverse all cells
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                // Check if cell is empty
                if (board[i][j] === 0) {
                    // Make the move
                    board[i][j] = player;

                    // Call minimax recursively and choose
                    // the maximum value
                    best = Math.max(best,
                        minimax(board, depth - 1, !isMax, player, ai, alpha, beta));

                    // Undo the move
                    board[i][j] = 0;

                    alpha = Math.max(alpha, best);

                    // Alpha Beta Pruning
                    if (beta <= alpha)
                        break;

                }
            }
        }
        return best;
    }

    // If this minimizer's move
    else {
        let best = 1000;

        // Traverse all cells
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                // Check if cell is empty
                if (board[i][j] === 0) {
                    // Make the move
                    board[i][j] = ai;

                    // Call minimax recursively and choose
                    // the minimum value
                    best = Math.min(best,
                        minimax(board, depth - 1, !isMax, player, ai, alpha, beta));

                    // Undo the move
                    board[i][j] = 0;

                    beta = Math.min(beta, best);

                    // Alpha Beta Pruning
                    if (beta <= alpha)
                        break;

                }
            }
        }
        return best;
    }
}

function findBestMove(board, player, ai) {
    let bestVal = 100000;
    let bestRow = -1;
    let bestCol = -1;

    // Traverse all cells, evaluate minimax function for
    // all empty cells. And return the cell with optimal
    // value.
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (board[i][j] === 0) {
                // Make the move
                board[i][j] = ai;

                // compute evaluation function for this
                // move.
                let moveVal = minimax(board, 6, true, player, ai, -1000, 1000); // look 6 moves ahead

                board[i][j] = 0;

                if (moveVal < bestVal) {
                    bestRow = i;
                    bestCol = j;
                    bestVal = moveVal;
                }
            }
        }
    }

    return [bestRow, bestCol, bestVal];
}

export { findBestMove };