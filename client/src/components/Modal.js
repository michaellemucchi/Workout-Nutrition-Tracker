import React from 'react';
import './Modal.css';

const Modal = ({ onClose, children, size }) => {
    const handleBackdropClick = (event) => {
        if (event.currentTarget === event.target) {
            onClose();
        }
    };

    const modalSize = size === 'large' ? 'modal-content-large' : 'modal-content';

    return (
        <div className="modal-backdrop" onClick={handleBackdropClick}>
            <div className={modalSize}>
                <button className="close-button" onClick={onClose}>Close</button>
                {children}
            </div>
        </div>
    );
};

export default Modal;
