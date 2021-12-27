import React from "react";
import playButton from '../../assets/play.png';
import { useNavigate } from 'react-router';
import './Play.css';


function Play(props) {
    const navigate = useNavigate();
    return <div className='play-wrapper'>
        <div className='play-button' onClick={() => navigate('/play')}>
            <img id='play-button' src={playButton} alt='play multiplayer' />
        </div>
    </div>
}

export default Play;