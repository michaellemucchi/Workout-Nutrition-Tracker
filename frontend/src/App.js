import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Profile from './components/Profile';
import ChangePassword from './components/ChangePassword';
import MealDetail from './components/MealDetail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/profile" element={Profile} />
        <Route path="/change-password" element={ChangePassword} />
        <Route path="/meals/:id" element={MealDetail} />
      </Routes>
    </Router>
  );
}

export default App;
