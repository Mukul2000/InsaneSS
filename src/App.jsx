import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Play from './Components/Play/Play';

function App() {
  return <BrowserRouter>
    <Routes>
      <Route path='/' element={<Play/>} />
    </Routes>
  </BrowserRouter>
}

export default App;
