import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <p>Michael Lemucchi</p>
      <p>
        Email: 
        <a href="mailto:lemucchimichael@gmail.com" style={{ color: 'white' }}>
          lemucchimichael@gmail.com
        </a>
      </p>
      <p>If you have any criticisms or want to make this look better please contact me.</p>
    </footer>
  );
};

export default Footer;
