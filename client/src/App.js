import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Register from './pages/Register';
function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<LandingPage/>} />
        <Route exact path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;