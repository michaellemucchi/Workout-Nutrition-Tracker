import React from 'react';
import { useUser } from '../context/UserContext';
import './Dashboard.css'; 
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';
import DashboardNav from '../components/DashboardNav';
import { Outlet } from 'react-router-dom';


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
        <div className="viewport">
            <div className="dashboard-container">
                <DashboardNav />
                <Outlet />
            </div>
        </div>
    );
};

export default Dashboard;