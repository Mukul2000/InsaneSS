import React, { useEffect, useState } from "react";
import './GameBoard.css';
import Cell from './Cell/Cell';
import { evaluate, is_moves_left } from '../../utils/gameUtils';
import { findBestMove } from '../../utils/bot';
import Finish from "../Finish/Finish";
import { connect, joinGameRoom, onGameStart, onGameUpdate, updateGame } from '../../utils/sockets';
import { useParams } from "react-router-dom";
import Waiting from '../Waiting/Waiting';

function GameBoard({ mode }) {
    const [isInRoom, setInRoom] = useState(false);
    const [winner, setWinner] = useState("None");
    const [isJoining, setJoining] = useState(true);
    const [socket, setSocket] = useState();
    const [playerSymbol, setSymbol] = useState(1);
    const [isGameStarted, setGameStarted] = useState(false);

    const { room_code } = useParams();
    const [board, setBoard] = useState([
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ]);
    const [turn, setTurn] = useState(false);

    // connect socket in case of multiplayer game
    const connectSocket = async () => {
        const socket = await connect('http://localhost:8000').catch(e => {
            console.log(e);
            alert(e);
        });
        setSocket(socket);

        // join the room
        setJoining(true);
        const joined = await joinGameRoom(socket, room_code).catch(err => alert(err));
        console.log(joined);
        if (joined) setInRoom(true);
        setJoining(false);

        // set up listener for move updates
        onGameUpdate(socket, (board) => {
            setBoard(board);
            setTurn(true);
        });

        // set up listener for game start
        onGameStart(socket, (options) => {
            setGameStarted(true);
            setSymbol(options.symbol);
            if (options.start === true) {
                setTurn(true);
            }
            else setTurn(false);
        });

    }


    useEffect(() => {
        if (mode === 'multiplayer') {
            connectSocket();
        }
    }, [])

    function isGameOver(board) {
        const score = evaluate(board);
        if (score === 10 || score === -10) {
            // give player 1 player 2 win
            if (score === 10) setWinner("You win");
            else setWinner("Player 2 wins");
        }
        else {
            if (!is_moves_left(board)) setWinner("It's a draw");
        }
    }


    function handleCellClick(x, y) {
        /*
            Fired when user clicks on an empty cell, updates the board and the 
            cell accordingly. Also checks for a win/draw condition.
        */

        if (isJoining) return;

        if (board[x][y] !== 0) return; // Don't let an occupied cell change

        if (mode === 'multiplayer' && turn === false) return;
        // Note: Need a new board because updating the old one doesn't work
        // react sees the reference to be the same and doesn't trigger a re-render.
        const newBoard = Array.from({ length: 4 }, () => Array.from({ length: 4 }, () => 0));
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) newBoard[i][j] = board[i][j];
        }

        if (mode === 'ai') {
            newBoard[x][y] = 1;
            const move = findBestMove(newBoard, 1, 2);
            console.log(move);
            newBoard[move[0]][move[1]] = 2;
        }
        else {
            newBoard[x][y] = playerSymbol;
            updateGame(socket, newBoard);
            setTurn(false);
        }
        setBoard(newBoard);
        isGameOver(newBoard);
    }


    if (isGameStarted) {
        if (winner === "None") {
            { isJoining && <h3> Joining the room... </h3> }
            return <div className='board-wrapper'>
                {board.map((item, x) => {
                    return <div className='board-row' key={x} > {item.map((cell, y) => {
                        return <Cell key={y} cell={cell} handleCellClick={handleCellClick} x={x} y={y} />
                    })}
                    </div>
                })}
            </div>
        }
        else return <Finish text={winner} mode={mode} />
    }
    else {
        return <Waiting code = {room_code} />
    }
}


export default GameBoard;