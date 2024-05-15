import React, { useState } from 'react';
import Modal from './Modal';
import './FeatureCard.css';

const FeatureCard = ({ title, description, image }) => {
  const [showModal, setShowModal] = useState(false);

  const handleModalOpen = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  return (
    <div className="feature-card">
      <img src={image} alt={title} className="feature-card-image" />
      <div className="feature-card-content">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      <div className="feature-card-icon" onClick={handleModalOpen}>
        <i className="fas fa-info-circle"></i>
      </div>
      <Modal show={showModal} onClose={handleModalClose}>
        <h2>{title}</h2>
        <p>{description}</p>
      </Modal>
    </div>
  );
};

export default FeatureCard;
