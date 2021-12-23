import React from "react";

import './Finish.css';
import PlayAgain from '../../assets/playAgain.png';
import Quit from '../../assets/quit.png';
import { useNavigate } from 'react-router';

function Finish({ text, mode }) {
    const navigate = useNavigate();

    return <div className='wrapper'>
        <div className='result-text'>
            {text}
        </div>
        <div id='play-again' onClick={() => {
            if(mode === 'ai') navigate('/play/ai');
            else navigate('/play/human')
        }}>
            <img src={PlayAgain} />
        </div>
        <div id='quit' onClick={() => navigate('/')}>
            <img src={Quit} />
        </div>
    </div>
}

export default Finish;