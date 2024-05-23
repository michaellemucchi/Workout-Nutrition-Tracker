import React from 'react';
import './NavBar.css';

const NavBar = () => {
  return (
    <nav className="navbar">
      <div>
        <a href="/" className="nav-item">Home</a>
        <a href="/about" className="nav-item">About</a>
        {/* if you want to add more hlinks*/}
      </div>
      <div>
        <a href="/login" className="nav-item special">Login</a>
        <a href="/register" className="nav-item special">Register</a>
      </div>
    </nav>
  );
};

export default NavBar;
