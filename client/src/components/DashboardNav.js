import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import './DashboardNav.css';

import workout from '../images/workout.ico';
import dashboard from '../images/dashboard.png';
import nutrition from '../images/nutrition.png';
import exercise from '../images/exercise.png';
import settings from '../images/settings.png';

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
                <h2>Nutritrack</h2>
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
            <div className="dashnav-item" onClick={() => navigate('/dashboard/settings')}>
                <img src={settings} alt="Settings" />
                <span className="dashnav-text">Settings</span>
            </div>
            <div className="dashnav-item logout-button" onClick={handleLogout}>
                <span className="dashnav-text">Logout</span>
            </div>
        </div>
    );
};

export default DashboardNav;
