import React, { useEffect, useState } from "react";
import './GameBoard.css';
import { useNavigate } from "react-router-dom";
import Cell from './Cell/Cell';
import { evaluate, is_moves_left } from '../../utils/gameUtils';
import { findBestMove } from '../../utils/bot';

function GameBoard({ player }) {
    // const [board, setBoard] = useState(Array.from({ length: 4 }, () => Array.from({ length: 4 }, () => 0)));
    const [board, setBoard] = useState([
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0]
    ]);
    const [turn, setTurn] = useState(false);
    const navigate = useNavigate();

    function isGameOver(board) {
        const score = evaluate(board);
        if (score === 10 || score === -10) {
            // give player 1 player 2 win
            console.log("Someone wins");
            navigate('/finish');
        }
        else {
            if (!is_moves_left(board)) navigate('/finish'); // draw
        }
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

        if (player === 'ai') {
            newBoard[x][y] = 1;
            const move = findBestMove(newBoard, 1, 2);
            console.log(move);
            newBoard[move[0]][move[1]] = 2;
        }
        else {
            if(turn) newBoard[x][y] = 2;
            else newBoard[x][y] = 1;
            setTurn(!turn);
        }
        setBoard(newBoard);
        isGameOver(newBoard);

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