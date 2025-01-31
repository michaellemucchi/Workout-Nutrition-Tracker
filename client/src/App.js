import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import LandingPage from './pages/LandingPage';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Nutrition from './components/Nutrition';
import Workouts from './components/Workouts';
import Profile from './components/Profile';
import MainDash from './components/MainDash';
import About from './pages/About';
import Contact from './pages/Contact';

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* Dashboard nested routes */}
          <Route path="/dashboard" element={<Dashboard />}>
            <Route index element={<MainDash />} />
            <Route path="nutrition" element={<Nutrition />} />
            <Route path="workouts" element={<Workouts />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
