import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ChatApp from './pages/ChatApp';
import RealChat from './pages/RealChat';
import { Toaster } from './components/ui/toaster';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RealChat />} />
          <Route path="/real" element={<RealChat />} />
          <Route path="/classic" element={<ChatApp />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </div>
  );
}

export default App;