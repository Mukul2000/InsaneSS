import React, { useEffect, useState } from "react";
import './GameBoard.css';
import { useNavigate } from "react-router-dom";
import Cell from './Cell/Cell';

function GameBoard() {
    const [board, setBoard] = useState(Array.from({ length: 4 }, () => Array.from({ length: 4 }, () => 0)));
    const [turn, setTurn] = useState(false);
    const navigate = useNavigate();

    function checkWinorFinish(board) {
        /*
            This function implements the logic to check the end of the game 
            either through a win or a draw.
        */
        for(let row = 0; row < 4; row++) {
            if(board[row][0] === board[row][1] && board[row][1] === board[row][2] && board[row][2] === board[row][3]) {
                if(board[row][0] == 0) continue;
                else navigate('/finish');
            }
        }

        for(let col = 0; col < 4; col++) {
            if(board[0][col] === board[1][col] && board[1][col] === board[2][col] && board[2][col] === board[3][col]) {
                if(board[0][col] === 0) continue;
                else navigate('/finish');
            }
        }

        // check main diagonal
        const top = board[0][0];
        let diag_f = 1;
        for(let i = 1; i < 4; i++) {
            if(board[i][i] != top) {diag_f = 0; break;}
        }
        if(diag_f) {
            if(top !== 0) navigate('/finish');
        }

        // the other diagonal
        const right_top = board[0][3];
        let diag_f2 = 1;
        for(let i = 1, j = 2; i < 4, j >= 0; i++, j--) {
            if(board[i][j] != right_top) {
                diag_f2 = 0;
                break;
            }
        }

        if(diag_f2) {
            if(right_top !== 0) navigate('/finish');
        }


        let is_empty_cell = 0;
        // check for a full grid
        for(let i = 0; i < 4; i++) {
            for(let j = 0; j < 4; j++) {
                if(board[i][j] === 0) {
                    is_empty_cell = 1;
                }
            }
        }

        if(!is_empty_cell) navigate('/finish');

    }

    function handleCellClick(x, y) {
        /*
            Fired when user clicks on an empty cell, updates the board and the 
            cell accordingly. Also checks for a win/draw condition.
        */

        if (board[x][y] !== 0) return; // Don't let an occupied cell change

        // Note: Need a new board because updating the old one doesn't work
        // react sees the reference to be the same and doesn't trigger a re-render.
        const newBoard = Array.from({ length: 4 }, () => Array.from({ length: 4 }, () => 0));
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) newBoard[i][j] = board[i][j];
        }
        if (turn) newBoard[x][y] = 2;
        else newBoard[x][y] = 1;

        checkWinorFinish(newBoard);
        setBoard(newBoard);


        if (turn) setTurn(false);
        else setTurn(true);
    }

    return <div className='board-wrapper'>
        {board.map((item, x) => {
            return <div className='board-row' key={x} > {item.map((cell, y) => {
                return <Cell key={y} cell={cell} handleCellClick={handleCellClick} x={x} y={y} />
            })}
            </div>
        })}
    </div>
}

export default GameBoard;