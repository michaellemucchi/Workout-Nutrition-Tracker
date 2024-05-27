import React, { useState } from 'react';
import './Register.css'; 
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [step, setStep] = useState(1); // Step 1 for initial registration, Step 2 for additional information
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    userId: '',
    username: '',
    password: '',
    dateOfBirth: '',
    bio: '',
    fitnessGoals: ''
  });

  const [error, setError] = useState('');

  const [message, setMessage] = useState('');

  const handleChange = (event) => {
    setUserInfo({ ...userInfo, [event.target.name]: event.target.value });
  };

  const handleFirstPartSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/api/users/register/initiate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: userInfo.username,
          password: userInfo.password,
          dateOfBirth: userInfo.dateOfBirth
        })
      });
  
      const data = await response.json();
      if (response.ok) {
        const updatedInfo = { ...userInfo, userId: data.userId };
        setMessage(data.message);
        setUserInfo(updatedInfo);
        setStep(2);
        setError('');
      } else {
        throw new Error(data.errors ? data.errors.map(err => err.msg).join(', ') : data.error);
      }
    } catch (err) {
      setError(err.message);
    }
  };


  const handleSecondPartSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/users/register/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userInfo.userId,
          bio: userInfo.bio,
          fitnessGoals: userInfo.fitnessGoals
        })
      });
      const data = await response.json();
      if (response.ok) {
        navigate('/login');
      } else {
          setMessage('');
          throw new Error(data.errors ? data.errors.map(err => err.msg).join(', ') : data.error);
      }
    } catch (err) {
      setError(err.message);
    }
  };


  return (
    <div>
      <Navbar />
      {step === 1 ? (
        <form onSubmit={handleFirstPartSubmit} className="register-form">
          <h2>Register Account</h2>
          {error && <p className="error">{error}</p>}
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
          <button type="submit">Next</button>
        </form>
      ) : (
        <form onSubmit={handleSecondPartSubmit} className="register-form">
          {message && <p className="message">{message}</p>}
          <h2>Complete Your Profile</h2>
          {error && <p className="error">{error}</p>}
          <label>
            Bio:
            <textarea name="bio" value={userInfo.bio} onChange={handleChange} />
          </label>
          <label>
            Fitness Goals:
            <textarea name="fitnessGoals" value={userInfo.fitnessGoals} onChange={handleChange} />
          </label>
          <button type="submit">Register</button>
        </form>
      )}
      <Footer />
    </div>
  );
};

export default Register;
