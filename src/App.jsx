import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import GameBoard from './Components/GameBoard/GameBoard';
import Play from './Components/Play/Play';

function App() {
  return <BrowserRouter>
    <Routes>
      <Route path='/play/human' element={<GameBoard player='human'/>} />
      <Route path='/play/ai' element={<GameBoard player='ai'/>} />
      <Route path='/' element={<Play/>} />
    </Routes>
  </BrowserRouter>
}

export default App;
