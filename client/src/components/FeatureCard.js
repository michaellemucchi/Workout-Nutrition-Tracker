import React, { useState } from 'react';
import './FeatureCard.css';  

const FeatureCard = ({ title, image, description }) => {
  const [showPopup, setShowPopup] = useState(false);

  const togglePopup = () => setShowPopup(!showPopup);

  return (
    <div className="feature-card">
      <div className="feature">
        <img src={image} alt={title} className="feature-image" />
        <h3>{title}</h3>
      </div>
      <button className="info-button" onClick={togglePopup}>Info</button>
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <button className="close-button" onClick={togglePopup}>Close</button>
            <p>{description}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeatureCard;
