import React from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

import './LandingPage.css'; 
import chart from '../images/chart.jpg';
import FeatureCard from '../components/FeatureCard';
import nutrition from '../images/nutrition.png';
import exercise from '../images/exercise.png';
import analytics from '../images/analytics.png';
import key from '../images/key.png';


const features = [
  { id: 1, title: "Nutrition", description: "Description for Feature 1", image: nutrition },
  { id: 2, title: "Workouts", description: "Description for Feature 2", image: exercise },
  { id: 3, title: "Charts", description: "Description for Feature 3", image: analytics },
  { id: 4, title: "Login Authentication", description: "Description for Feature 4", image: key }
];


const LandingPage = () => {
  return (
    <div>

      <NavBar />

      <div className="landing-container">

        <div className="circle-large"></div> 
        <div className="circle-small"></div>

        <div className="title-section">
          <h1>Fitness-Nutrition Tracker</h1>
          <p>This is your one-stop solution for tracking your workouts and nutrition!</p>
        </div>

        <div className="image-part">

          <div className="image-description">
            <h1>Data Driven Tracking</h1>
            <p>When storing your workouts in our tracker, you will be able to see your progress visually through 
              motivating charts and graphs
            </p>
          </div>

          <div className="image-photo">
            <img src={chart} alt="Fitness Chart" />
          </div>

        </div>

      </div>

      <div className="feature-section">
        <h2>Features of the Tracker</h2>
        <div className="feature-card-container">
          {features.map(feature => (
            <FeatureCard 
              key={feature.id}
              title={feature.title} 
              image={feature.image}
              description={feature.description} 
            />
          ))}
        </div>
      </div>
      
      <Footer />

    </div>
  );
};

export default LandingPage;