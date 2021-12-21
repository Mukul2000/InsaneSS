import React from "react";
import playButton from '../../assets/play.png';
import { useNavigate } from 'react-router';
import './Play.css';

function Play(props) {
    const navigate = useNavigate();
    return <div id='play-button' onClick={() => navigate('/play')}>
        <img id='play-button' src={playButton} />
    </div>
}

export default Play;