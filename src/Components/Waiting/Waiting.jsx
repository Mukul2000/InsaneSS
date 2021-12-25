import React from "react";

function Waiting({code}) {
    return <div className='board-wrapper'>
        <h1> Waiting for other player to join </h1>

        <h2>Room Code </h2> 
        <h2> <b> {code} </b></h2>

    </div>
}

export default Waiting;