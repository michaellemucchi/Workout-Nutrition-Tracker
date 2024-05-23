import React from 'react';
import NavBar from '../components/NavBar';
import './LandingPage.css'; 
import chart from '../images/chart.jpg';


const LandingPage = () => {
  return (
    <div>

      <NavBar />

      <div className="landing-container">
        <div className="title-section">
          <h1>Fitness-Nutrition Tracker</h1>
          <p>This is your one-stop solution for tracking your workouts and nutrition!</p>
        </div>
        <div className="image-section">
          <h1>Data Driven Tracking</h1>
          <p>When storing your workouts in our tracker, you will be able to see your progress visually through 
             motivating charts and graphs
          </p>
          <img src={chart} alt="Fitness Chart" />
        </div>
      </div>

    </div>
  );
};

export default LandingPage;