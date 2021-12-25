import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import CreateGame from './Components/CreateGame/CreateGame';
import GameBoard from './Components/GameBoard/GameBoard';
import JoinGame from './Components/JoinGame/JoinGame';
import Play from './Components/Play/Play';

function App() {
  return <BrowserRouter>
    <Routes>
      <Route path='/play/rooms/join' element={<JoinGame />} />
      <Route path='/play/rooms/:room_code' element={<GameBoard mode='multiplayer' />} />
      <Route path='/play/ai' element={<GameBoard mode='ai' />} />
      <Route path='/play' element={<CreateGame />} />
      <Route path='/' element={<Play />} />
    </Routes>
  </BrowserRouter>
}

export default App;
