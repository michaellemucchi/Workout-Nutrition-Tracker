import React, { useState, useEffect } from 'react';
import ConsistencyCounter from './ConsistencyCounter';
import CaloriesChart from './CaloriesChart';
import WeeklyProgress from './WeeklyProgress';
import Modal from './Modal';
import './MainDash.css'; // Ensure styling is properly linked

const MainDash = () => {
    const [workouts, setWorkouts] = useState([]);
    const [meals, setMeals] = useState([]);
    const [showAchievementsModal, setShowAchievementsModal] = useState(false);

    useEffect(() => {
        // Fetch data for workouts and meals
        const fetchWorkouts = async () => {
            // Fetching logic goes here
        };
        const fetchMeals = async () => {
            // Fetching logic goes here
        };
        fetchWorkouts();
        fetchMeals();
    }, []);

    return (
        <div className="dashboard">
            <h2>Welcome to your dashboard!</h2>
            <div className="dashboard-grid">
                <div className="dashboard-item">
                    <ConsistencyCounter meals={meals} />
                </div>
                <div className="dashboard-item">
                    <CaloriesChart totalCalories={2000} goalCalories={2500} /> {/* Replace with actual data */}
                </div>
                <div className="dashboard-item">
                    <WeeklyProgress workouts={workouts} />
                </div>
                <div className="dashboard-item">
                    <button className="view-achievements-button" onClick={() => setShowAchievementsModal(true)}>
                        View Achievements
                    </button>
                    {showAchievementsModal && (
                        <Modal onClose={() => setShowAchievementsModal(false)} size="large">
                            <div className="modal-content">
                                <h3>Your Achievements</h3>
                                <ul>
                                    <li>1 Workout Logged</li>
                                    <li>5 Workouts Logged</li>
                                    <li>10 Workouts Logged</li>
                                    <li>50 Workouts Logged</li>
                                    <li>100 Workouts Logged</li>
                                    <li>1000 Workouts Logged</li>
                                    <li>1 Meal Logged</li>
                                    <li>5 Meals Logged</li>
                                    <li>10 Meals Logged</li>
                                    <li>100 Meals Logged</li>
                                </ul>
                            </div>
                        </Modal>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MainDash;
