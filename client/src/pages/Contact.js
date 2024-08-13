import React from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import './Contact.css';

const Contact = () => {
  return (
    <div className="contact-wrapper">
      <NavBar />
      <div className="contact-container">
        <h1>Contact Us</h1>
        <p>
          Feel free to reach out to me through any of the following channels:
        </p>
        <ul>
          <li><strong>Email:</strong> <a href="mailto:lemucchimichael@gmail.com">lemucchimichael@gmail.com</a></li>
          <li><strong>Instagram:</strong> <a href="https://instagram.com/lemucchim17" target="_blank" rel="noopener noreferrer">@lemucchim17</a></li>
          <li><strong>Name:</strong> Michael Lemucchi</li>
          <li><strong>Background:</strong> 4th year Computer Science and Econ minor student at UC Davis</li> 
        </ul>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
