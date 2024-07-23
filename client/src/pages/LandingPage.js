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
  { 
    id: 1, 
    title: "Nutrition", 
    description: "Track your daily meals and monitor your calorie intake. Log breakfast, lunch, dinner, snacks, and desserts, and get detailed nutritional breakdowns to stay on top of your dietary goals.", 
    image: nutrition 
  },
  { 
    id: 2, 
    title: "Workouts", 
    description: "Log your workouts and track your fitness progress. Record different exercises, sets, and reps, and visualize your progress over time with detailed workout logs.", 
    image: exercise 
  },
  { 
    id: 3, 
    title: "Charts", 
    description: "Visualize your nutrition and workout data with comprehensive charts. Analyze your calorie intake, nutrient distribution, and exercise performance to make informed decisions about your fitness journey.", 
    image: analytics 
  },
  { 
    id: 4, 
    title: "Login Authentication", 
    description: "Securely log in to access your personalized workout and nutrition data. Our robust authentication system ensures that your information is safe and accessible only to you.", 
    image: key 
  }
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