import React from "react";
import { useState } from "react/cjs/react.development";
import './JoinGame.css';
import Join from '../../assets/join.png';
import { useNavigate } from "react-router-dom";

export default function JoinGame(props) {
    const [room, setRoom] = useState("");
    const navigate = useNavigate();

    return <div className='input-wrapper'>
        <h1 className='heading'> Enter room code to join an existing game</h1>
        <input
            className='room_input'
            value={room}
            onChange={e => setRoom(e.target.value)}
            placeholder="Enter 4 digit room code"
        />
        <img src={Join} alt='join game' onClick={() => {
            if(room.length === 4)
            navigate(`/play/rooms/${room}`)
        }
        } />

    </div>
}