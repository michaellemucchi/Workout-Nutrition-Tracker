import React, { useState } from 'react';

const Register = () => {
  const [userInfo, setUserInfo] = useState({
    username: '',
    password: '',
    dateOfBirth: '',
    bio: '',
    fitnessGoals: ''
  });

  const handleChange = (event) => {
    setUserInfo({ ...userInfo, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Implement the API call to your backend to register the user
    console.log(userInfo); // For testing, replace with API call
  };

  return (
    <div style={{ background: 'linear-gradient(135deg, var(--primary-color), var(--accent2-color))', textAlign: 'center', padding: '50px 0' }}>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="username" placeholder="Username" value={userInfo.username} onChange={handleChange} /><br />
        <input type="password" name="password" placeholder="Password" value={userInfo.password} onChange={handleChange} /><br />
        <input type="date" name="dateOfBirth" value={userInfo.dateOfBirth} onChange={handleChange} /><br />
        <input type="submit" value="Register" />
      </form>
    </div>
  );
};

export default Register;
