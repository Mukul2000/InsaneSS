import React from "react";
import playButton from '../../assets/play.png';
import { useNavigate } from 'react-router';
import './Play.css';

import AI from '../../assets/AI.png';

function Play(props) {
    const navigate = useNavigate();
    return <div className='play-wrapper'>
        <div className='play-button' onClick={() => navigate('/play')}>
            <img id='play-button' src={playButton} alt='play multiplayer' />
        </div>
        <div className='play-button' onClick={() => navigate('/play/ai')}>
            <img id='play-button' src={AI} alt='play AI'/>
        </div>       
    </div>
}

export default Play;