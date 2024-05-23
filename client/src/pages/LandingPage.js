import React from 'react';
import NavBar from '../components/NavBar';
import './LandingPage.css'; 


const LandingPage = () => {
  return (
    <div>
      <NavBar />
      <h1>Welcome to My Fitness App!</h1>
      <p>Track your workouts and nutrition easily.</p>
    </div>
  );
};

export default LandingPage;