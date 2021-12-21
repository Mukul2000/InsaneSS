import React, { useEffect, useState } from "react";
import './GameBoard.css';

import Cell from './Cell/Cell';

function GameBoard() {
    const [board, setBoard] = useState(Array.from({length: 4},()=> Array.from({length: 4}, () => 0)));
    const [turn, setTurn] = useState(false);

    function handleCellClick(x, y) {
        if (board[x][y] !== 0) return;
        
        const newBoard = Array.from({length: 4},()=> Array.from({length: 4}, () => 0));
        for(let i = 0; i < 4; i++) {
            for(let j = 0; j < 4; j++) newBoard[i][j] = board[i][j];
        }
        if(turn) newBoard[x][y] = 2;
        else newBoard[x][y] = 1;

        setBoard(newBoard);

        if(turn) setTurn(false);
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