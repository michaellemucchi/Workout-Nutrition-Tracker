import React from 'react';
import './NavBar.css';
import logo from '../images/workout.ico';

const Navbar = () => {
  return (
    <nav className="navbar">
      <img src={logo} alt="Workout" className="logo" style={{ marginRight: 'auto' }} />
      <div className="middle-links">
        <a href="/" className="nav-item">Home</a>
        <a href="/about" className="nav-item">About</a>
        <a href="/contact" className="nav-item">Contact</a>
      </div>
      <div>
        <a href="/login" className="nav-item special">Login</a>
        <a href="/register" className="nav-item special">Register</a>
      </div>
    </nav>
  );
};

export default Navbar;