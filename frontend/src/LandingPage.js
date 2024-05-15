// src/LandingPage.js
import React from 'react';
import FeatureCard from './components/FeatureCard';
import './LandingPage.css';

const LandingPage = () => {
  const features = [
    {
      title: 'Track Your Workouts',
      description: 'Log your exercises and monitor your progress over time.',
      image: '/images/workout-tracking.png'
    },
    {
      title: 'Nutrition Monitoring',
      description: 'Keep track of your daily caloric intake and nutrients.',
      image: '/images/nutrition-monitoring.png'
    },
    {
      title: 'Set Goals',
      description: 'Set personal fitness goals and achieve them.',
      image: '/images/goal-setting.png'
    }
  ];

  return (
    <div className="landing-page">
      <h1>Welcome to Fitness Tracker</h1>
      <p>Discover the features that will help you stay fit and healthy.</p>
      <div className="features">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            title={feature.title}
            description={feature.description}
            image={feature.image}
          />
        ))}
      </div>
    </div>
  );
};

export default LandingPage;
