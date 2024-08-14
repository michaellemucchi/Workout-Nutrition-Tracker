import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import './Achievements.css';

const Achievements = ({ workouts }) => {
    const [showModal, setShowModal] = useState(false);
    const [achievements, setAchievements] = useState([]);

    useEffect(() => {
        // Define the achievements logic here
        const workoutCount = workouts.length;
        const newAchievements = [];

        if (workoutCount >= 1) newAchievements.push('1 Workout Logged');
        if (workoutCount >= 5) newAchievements.push('5 Workouts Logged');
        if (workoutCount >= 10) newAchievements.push('10 Workouts Logged');
        if (workoutCount >= 50) newAchievements.push('50 Workouts Logged');
        if (workoutCount >= 100) newAchievements.push('100 Workouts Logged');
        if (workoutCount >= 1000) newAchievements.push('1000 Workouts Logged');

        setAchievements(newAchievements);
    }, [workouts]);

    return (
        <div className="achievements">
            <button onClick={() => setShowModal(true)}>View Achievements</button>
            {showModal && (
                <Modal onClose={() => setShowModal(false)}>
                    <div className="modal-content">
                        <h3>Your Achievements</h3>
                        <ul>
                            {achievements.map((ach, index) => (
                                <li key={index}>{ach}</li>
                            ))}
                        </ul>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default Achievements;
