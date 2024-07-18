import React from 'react';

const Modal = ({ onClose, children }) => {
    const handleBackdropClick = (event) => {
        // Close modal when clicking outside the modal content
        if (event.currentTarget === event.target) {
            onClose();
        }
    };

    return (
        <div className="modal-backdrop" onClick={handleBackdropClick}>
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>Close</button>
                {children} 
            </div>
        </div>
    );
};

export default Modal;