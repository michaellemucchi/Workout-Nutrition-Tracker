import React, { useState } from 'react';
import './Register.css'; 
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';

const Register = () => {
  const [userInfo, setUserInfo] = useState({
    username: '',
    password: '',
    dateOfBirth: ''
  });

  const handleChange = (event) => {
    setUserInfo({ ...userInfo, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Here you will handle the submission logic
    console.log(userInfo); // Temporarily log user info for testing
  };

  return (
    <div>
      <Navbar />
      <form onSubmit={handleSubmit} className="register-form">
        <h2>Register Account</h2>
        <label>
          Username:
          <input type="text" name="username" value={userInfo.username} onChange={handleChange} />
        </label>
        <label>
          Password:
          <input type="password" name="password" value={userInfo.password} onChange={handleChange} />
        </label>
        <label>
          Date of Birth:
          <input type="date" name="dateOfBirth" value={userInfo.dateOfBirth} onChange={handleChange} />
        </label>
        <button type="submit">Submit</button>
      </form>
      <Footer />
    </div>
  );
};

export default Register;
