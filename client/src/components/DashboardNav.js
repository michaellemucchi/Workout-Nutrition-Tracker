import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import './DashboardNav.css';

import workout from '../images/workout.ico';
import dashboard from '../images/dashboard.png';
import nutrition from '../images/nutrition.png';
import exercise from '../images/exercise.png';
import person from '../images/person.png';

const DashboardNav = () => {
    const navigate = useNavigate();
    const { logout } = useUser();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="dashboard-nav">
            <div className="title-container">
                <img src={workout} alt="workout icon" />
                <h2>NutTracker</h2>
            </div>
            <div className="dashnav-item" onClick={() => navigate('/dashboard')}>
                <img src={dashboard} alt="Dashboard" />
                <span className="dashnav-text">Dashboard</span>
            </div>
            <div className="dashnav-item" onClick={() => navigate('/dashboard/nutrition')}>
                <img src={nutrition} alt="Nutrition" />
                <span className="dashnav-text">Nutrition</span>
            </div>
            <div className="dashnav-item" onClick={() => navigate('/dashboard/workouts')}>
                <img src={exercise} alt="Workouts" />
                <span className="dashnav-text">Workouts</span>
            </div>
            <div className="dashnav-item" onClick={() => navigate('/dashboard/profile')}>
                <img src={person} alt="Profile" />
                <span className="dashnav-text">Profile</span>
            </div>
            <div className="dashnav-item logout-button" onClick={handleLogout}>
                <span className="dashnav-text">Logout</span>
            </div>
        </div>
    );
};

export default DashboardNav;
