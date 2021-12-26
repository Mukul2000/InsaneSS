import React, { useEffect, useState } from "react";
import './GameBoard.css';
import Cell from './Cell/Cell';
import { evaluate, is_moves_left } from '../../utils/gameUtils';
import { findBestMove } from '../../utils/bot';
import Finish from "../Finish/Finish";
import { connect, GameStatus, joinGameRoom, onGameStart, onGameUpdate, updateGame } from '../../utils/sockets';
import { useParams } from "react-router-dom";

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

        // set up listener for game start, when two players are in the room
        onGameStart(socket, (options) => {
            setGameStarted(true);
            setSymbol(options.symbol);
            if (options.start === true) {
                setTurn(true);
            }
            else setTurn(false);
        });


        // set up listener for move updates
        onGameUpdate(socket, (board) => {
            setBoard(board);
            setTurn(true);
        });

        // set up listener in case a player wins
        GameStatus(socket, (result) => {
            console.log(result);
            if (result === false) setWinner("You lost the game");
            else setWinner("You won the game");
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
            if (score === 10 && playerSymbol === 1 || score === -10 && playerSymbol === 2) {
                setWinner("You won the game.");
                if (mode === 'multiplayer') socket.emit('game_status');
            }
            else
                setWinner("You lost the game.");
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

        if (board[x][y] !== 0) return; // Don't let an occupied cell change

        if (mode === 'multiplayer' && turn === false) return; // No clicks allowed if it's your turn

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


    if (isGameStarted || mode === 'ai') {
        if (winner === "None") {
            return <div className='board-wrapper'>
                {turn && <div className='turn-text'> Your turn </div>}
                {!turn && <div className='turn-text'>Opponent's turn</div>}

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
        return <div className='board-wrapper'>
            <h1> Waiting for other player to join </h1>

            <h2>Room Code </h2>
            <h2> <b> {room_code} </b> </h2>
        </div>
    }
}


export default GameBoard;