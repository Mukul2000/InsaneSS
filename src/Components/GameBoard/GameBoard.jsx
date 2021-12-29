import React, { useEffect, useState } from "react";
import './GameBoard.css';
import Cell from './Cell/Cell';
import { evaluate, is_moves_left } from '../../utils/gameUtils';
import { findBestMove } from '../../utils/bot';
import { connect, GameStatus, joinGameRoom, onGameStart, onGameUpdate, updateGame, playerLeftGame } from '../../utils/sockets';
import { useParams } from "react-router-dom";
import PlayAgain from '../../assets/playAgain.png';
import Quit from '../../assets/quit.png';
import { useNavigate } from 'react-router';



function GameBoard({ mode }) {
    const [isInRoom, setInRoom] = useState(false);
    const [winner, setWinner] = useState("None");
    const [isJoining, setJoining] = useState(true);
    const [socket, setSocket] = useState();
    const [playerSymbol, setSymbol] = useState(1);
    const [isGameStarted, setGameStarted] = useState(false);
    const navigate = useNavigate();
    const [board, setBoard] = useState([
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ]);
    const [turn, setTurn] = useState(true);

    const { room_code } = useParams();

    function clearBoard() {
        setBoard([
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ])
    }

    // connect socket in case of multiplayer game
    const connectSocket = async () => {
        const socket = await connect('http://localhost:8000').catch(e => {
            console.log(e);
            alert(e);
        });
        setSocket(socket);

        // join the room
        setJoining(true);
        const joined = await joinGameRoom(socket, room_code).catch(err => {
            alert(err)
            navigate('/play');
        });
        console.log(joined);
        if (joined) setInRoom(true);
        setJoining(false);

        // set up listener for game start, when two players are in the room
        socket.on('start_game', (config) => {
            setGameStarted(true);
            setSymbol(config.symbol);
            if (config.start === true) {
                setTurn(true);
            }
            else setTurn(false);
        });


        // set up listener for move updates
        socket.on('on_game_update', (board) => {
            setBoard(board);
            setTurn(true);
        });

        // set up listener in case a player wins
        socket.on('game_status', ({ result }) => {
            if (result === false) setWinner("You lost the game");
            else if (result === "draw") setWinner("It's a draw");
        });

        // set up disconnect event in case any of the players leave the game
        socket.on('player_left', () => {
            alert('The opponent has left the game');
            setGameStarted(false);
            clearBoard();
        });

    }


    useEffect(() => {
        if (mode === 'multiplayer') {
            connectSocket();
        }
    }, [])

    function isGameOver(board) {
        /* 
            Function to check whether the game has ended or not and 
            make changes for finishing the game.
        */
        const score = evaluate(board);
        if (score === 10 || score === -10) {
            // give player 1 player 2 win
            if ((score === 10 && playerSymbol === 1) || (score === -10 && playerSymbol === 2)) {
                setWinner("You won the game.");
                if (mode === 'multiplayer') socket.emit('game_status', { result: 'win' });
            }
            else
                setWinner("You lost the game.");
        }
        else {
            if (!is_moves_left(board)) {
                setWinner("It's a draw");
                if (mode === 'multiplayer') socket.emit('game_status', { result: 'draw' });
            }
        }
    }


    function handleCellClick(x, y) {
        /*
            Fired when user clicks on an empty cell, updates the board and the 
            cell accordingly. Also checks for a win/draw condition.
        */

        if (board[x][y] !== 0) return; // Don't let an occupied cell change

        if (mode === 'multiplayer' && turn === false) return; // No clicks allowed if it's not your turn

        // Note: Need a new board because updating the old one doesn't work
        // react sees the reference to be the same and doesn't trigger a re-render.
        const newBoard = Array.from({ length: 4 }, () => Array.from({ length: 4 }, () => 0));
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) newBoard[i][j] = board[i][j];
        }

        if (mode === 'ai') {
            setTurn(false);
            newBoard[x][y] = 1;
            const move = findBestMove(newBoard, 1, 2);
            newBoard[move[0]][move[1]] = 2;
            setTurn(true);
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
        else {
            // Results page
            return <div className='board-wrapper'>
                <div className='result-text'>
                    {winner}
                </div>
                <div id='play-again' onClick={() => {
                    clearBoard();
                    setWinner("None");
                }}>
                    <img src={PlayAgain} alt='play again' />
                </div>
                <div id='quit' onClick={() => navigate('/')}>
                    <img src={Quit} alt='quit game' />
                </div>
            </div>
        }
    }
    else {
        // Show room details if 2 players haven't joined yet.
        return <div className='board-wrapper'>
            <h1> Waiting for other player to join </h1>

            <h2> Room Code </h2>
            <h2> <b> {room_code} </b> </h2>
        </div>
    }
}


export default GameBoard;