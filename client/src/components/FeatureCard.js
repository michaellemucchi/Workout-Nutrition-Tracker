import React, { useState } from 'react';
import './FeatureCard.css';  
import info from '../images/info.png';  
import close from '../images/close.png'; 

const FeatureCard = ({ title, image, description }) => {
  const [showPopup, setShowPopup] = useState(false);

  const togglePopup = () => setShowPopup(!showPopup);

  const closePopup = (e) => {
    if (e.target.className === 'popup-overlay') {
      setShowPopup(false);
    }
  };

  return (
    <div className="feature-card">
      <div className="feature">
        <img src={image} alt={title} className="feature-image" />
        <h3>{title}</h3>
      </div>
      <button className="info-button" onClick={togglePopup}>
        <img src={info} alt="Info" />
      </button>
      {showPopup && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup">
            <button className="close-button" onClick={togglePopup}>
              <img src={close} alt="close" />
            </button>
            <p className="popup-description">{description}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeatureCard;
