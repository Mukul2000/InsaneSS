function evaluate(board) {
    /*
        This function implements the logic to check the end of the game 
        either through a win or a draw. Player 1 wins +10, Player 2 wins - 10
        Draw is a 0;
    */

    // horizontal 4 in a row
    for (let row = 0; row < 4; row++) {
        if (board[row][0] === board[row][1] && board[row][1] === board[row][2] && board[row][2] === board[row][3]) {
            if (board[row][0] === 1) return 10;
            else if (board[row][0] === 2) return -10;
        }
    }

    // vertical 4 in a row
    for (let col = 0; col < 4; col++) {
        if (board[0][col] === board[1][col] && board[1][col] === board[2][col] && board[2][col] === board[3][col]) {
            if (board[0][col] === 1) return 10;
            if (board[0][col] === 2) return -10;

        }
    }

    // check main diagonal
    const top = board[0][0];
    let diag_f = 1;
    for (let i = 1; i < 4; i++) {
        if (board[i][i] !== top) { diag_f = 0; break; }
    }
    if (diag_f) {
        if (top === 1) return 10;
        if (top === 2) return -10;
    }

    // the other diagonal
    const right_top = board[0][3];
    let diag_f2 = 1;
    for (let i = 1, j = 2; i < 4, j >= 0; i++, j--) {
        if (board[i][j] !== right_top) {
            diag_f2 = 0;
            break;
        }
    }

    if (diag_f2) {
        if (right_top === 1) return 10;
        if (right_top === 2) return -10;
    }
    return 0;
}

function is_moves_left(board) {
    // checks whether the board is full or not
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (board[i][j] === 0) return true;
        }
    }
    return false;
}

export { evaluate, is_moves_left };