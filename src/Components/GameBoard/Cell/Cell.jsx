import React from 'react';

import './Cell.css';
import EmptyCell from '../../../assets/cell.png';
import Sword from '../../../assets/sword.png';
import Shield from '../../../assets/shield.png';

function Cell({cell, handleCellClick, x, y}) {

    function cellClick() {
        handleCellClick(x,y);
    }
    return <div className='cell'>
        {cell === 0 && <img className='cell-image' src={EmptyCell} onClick={cellClick} alt='empty cell' />}
        {cell === 1 && <img className='cell-image' src={Sword} onClick={cellClick} alt='sword' />}
        {cell === 2 && <img className='cell-image' src={Shield} onClick={cellClick} alt='shield' />}
    </div>;
}

export default Cell;