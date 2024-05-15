import React from 'react';
import FeatureCard from './components/FeatureCard';
import './LandingPage.css';

const LandingPage = () => {
  const features = [
    {
      title: 'Track Nutrition',
      description: 'Keep track of your daily caloric intake and nutrients.',
      image: '/images/nutrition-monitoring.png',
    },
    {
      title: 'Set Goals',
      description: 'Set personal fitness goals and achieve them.',
      image: '/images/goal-setting.png',
    },
  ];

  return (
    <div className="landing-page">
      <div className="feature-cards">
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
