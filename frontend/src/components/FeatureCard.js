// src/components/FeatureCard.js
import React, { useState } from 'react';
import './FeatureCard.css';
import { FaInfoCircle, FaTimes } from 'react-icons/fa';

const FeatureCard = ({ title, description, image }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="card">
      <div className="card-inner">
        <div className="card-front" onClick={handleCardClick}>
          <h3>{title}</h3>
          <FaInfoCircle className="info-icon" />
        </div>
      </div>
      {isModalOpen && (
        <div className="modal" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <FaTimes className="close-icon" onClick={handleCloseModal} />
            <img src={image} alt={title} />
            <p>{description}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeatureCard;
