import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import './ConsistencyCounter.css';
import { useUser } from '../context/UserContext';

const ConsistencyCounter = ({ meals }) => {
    const { user } = useUser();
    const [consistencyCount, setConsistencyCount] = useState(0);
    const [showInfoModal, setShowInfoModal] = useState(false);

    useEffect(() => {
        const fetchConsistency = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/workouts/consistency', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${user.token}`,
                    }
                });
    
                const data = await response.json();
                if (response.ok) {
                    setConsistencyCount(data.consistencyStreak);  // Set streak directly from server response
                } else {
                    console.error("Failed to fetch consistency streak");
                }
            } catch (error) {
                console.error("Error fetching consistency streak:", error);
            }
        };
    
        fetchConsistency();
    }, [meals, user.token]);  // Update whenever meals change or token changes
    

    return (
        <div className="consistency-counter">
            <h4>Consistency Counter</h4>
            <p>{consistencyCount} {consistencyCount === 1 ? 'day' : 'days'}</p>
            <button className="info-button" onClick={() => setShowInfoModal(true)}>Info</button>
            {showInfoModal && (
                <Modal onClose={() => setShowInfoModal(false)}>
                    <div className="info-popup">
                        <p>Log at least one meal and one workout each day to increase your consistency counter.</p>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default ConsistencyCounter;
