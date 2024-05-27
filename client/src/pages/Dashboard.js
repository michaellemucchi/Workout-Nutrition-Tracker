import React from 'react';
import { useUser } from '../context/UserContext';
import './Dashboard.css'; 
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';

const Dashboard = () => {
    const { user } = useUser();

    if (!user) {
        return (
            <div>
                <Navbar/>
                <p className="dashboard-unauthorized">Please log in</p>
                <Footer/>
            </div>
        );
    }

    // Your dashboard content for logged-in users
    return (
        <div className="dashboard">
            <div>Welcome to your dashboard, {user.username}!</div>
            {/* Additional dashboard components here */}
        </div>
    );
};

export default Dashboard;
