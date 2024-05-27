import React from 'react';
import './NavBar.css';
import logo from '../images/workout.ico';
import { Link } from 'react-router-dom';


const Navbar = () => {
  return (
    <nav className="navbar">
      <img src={logo} alt="Workout" className="logo" style={{ marginRight: 'auto' }} />
      <div className="middle-links">
        <Link to="/" className="nav-item">Home</Link>
        <Link to="/about" className="nav-item">About</Link>
        <Link to="/contact" className="nav-item">Contact</Link>
      </div>
      <div>
        <Link to="/login" className="nav-item special">Login</Link>
        <Link to="/register" className="nav-item special">Register</Link>
      </div>
    </nav>
  );
};

export default Navbar;