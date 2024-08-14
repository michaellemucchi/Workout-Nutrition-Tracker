import React, { useState, useEffect } from 'react';
import Modal from './Modal'; // Import the Modal component
import './ConsistencyCounter.css';
import { useUser } from '../context/UserContext';

const ConsistencyCounter = ({ meals }) => {
    const { user } = useUser();
    const [consistencyCount, setConsistencyCount] = useState(0);
    const [showInfoModal, setShowInfoModal] = useState(false);

    useEffect(() => {
        const checkConsistency = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/workouts/WorkoutsToday', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${user.token}`,
                    }
                });

                const workouts = await response.json();
                if (meals.length > 0 && workouts.length > 0) {
                    setConsistencyCount(prevCount => prevCount + 1);
                } else {
                    setConsistencyCount(0);
                }
            } catch (error) {
                console.error("Failed to fetch workouts", error);
            }
        };

        checkConsistency();
    }, [meals, user.token]);

    return (
        <div className="consistency-counter">
            <h4>Consistency Counter</h4>
            <p>{consistencyCount} days</p>
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
