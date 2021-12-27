import React from "react";
import './CreateGame.css';
import { useNavigate } from "react-router-dom";
import Create from '../../assets/create.png';
import Join from '../../assets/join.png';
import { generateRoomCode } from "../../utils/utils";
import AI from '../../assets/AI.png';

function CreateGame() {
    const navigate = useNavigate();
    return <div className='outer-wrapper'>
        <div id='create-button' onClick={() => {
            const roomCode = generateRoomCode();
            navigate(`/play/rooms/${roomCode}`);
        }}>
            <img src={Create} alt='create' />
        </div>

        <div className='play-button' onClick={() => navigate('/play/ai')}>
            <img id='play-button' src={AI} alt='play AI' />
        </div>

        <div id='join-button' onClick={() => {
            navigate('/play/rooms/join');
        }}>
            <img src={Join} alt='join' />
        </div>
    </div>
}

export default CreateGame;