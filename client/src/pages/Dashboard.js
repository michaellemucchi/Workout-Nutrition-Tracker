import React from 'react';
import { useUser } from '../context/UserContext';
import './Dashboard.css';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { user } = useUser();

    if (!user) {
        return <Link to="/login" className='please-login'>Please log in</Link>;
    }

    return (
        <div>Welcome to your dashboard, {user.username}!</div>
    );
};

export default Dashboard;
