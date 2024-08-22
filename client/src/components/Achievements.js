import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import './Achievements.css';

const Achievements = ({ workouts, meals }) => {
    const [showModal, setShowModal] = useState(false);
    const [achievements, setAchievements] = useState([]);

    useEffect(() => {
        // Calculate achievements based on workouts and meals count
        const workoutCount = workouts.length;
        const mealCount = meals.length;
        const newAchievements = [];

        const icons = [
            '🥉', // Bronze tier for 1 logged
            '🥈', // Silver tier for 5 logged
            '🥇', // Gold tier for 10 logged
            '🏅', // Medal for 50 logged
            '🎖️', // Ribbon for 100 logged
            '🏆'  // Trophy for 1000 logged
        ];

        // Workout achievements
        if (workoutCount >= 1) newAchievements.push(`${icons[0]} 1 Workout Logged`);
        if (workoutCount >= 5) newAchievements.push(`${icons[1]} 5 Workouts Logged`);
        if (workoutCount >= 10) newAchievements.push(`${icons[2]} 10 Workouts Logged`);
        if (workoutCount >= 50) newAchievements.push(`${icons[3]} 50 Workouts Logged`);
        if (workoutCount >= 100) newAchievements.push(`${icons[4]} 100 Workouts Logged`);
        if (workoutCount >= 1000) newAchievements.push(`${icons[5]} 1000 Workouts Logged`);

        // Meal achievements
        if (mealCount >= 1) newAchievements.push(`${icons[0]} 1 Meal Logged`);
        if (mealCount >= 5) newAchievements.push(`${icons[1]} 5 Meals Logged`);
        if (mealCount >= 10) newAchievements.push(`${icons[2]} 10 Meals Logged`);
        if (mealCount >= 50) newAchievements.push(`${icons[3]} 50 Meals Logged`);
        if (mealCount >= 100) newAchievements.push(`${icons[4]} 100 Meals Logged`);
        if (mealCount >= 1000) newAchievements.push(`${icons[5]} 1000 Meals Logged`);

        setAchievements(newAchievements);
    }, [workouts, meals]);

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
