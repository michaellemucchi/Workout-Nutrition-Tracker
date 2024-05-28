import React, { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';
import person from '../images/person.png';
import Loader from '../components/Loader'; 

const Profile = () => {
    const { user } = useUser();
    const [error, setError] = useState('');
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/users/profile', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                });
                const data = await response.json();
                if (response.ok) {
                    setProfile(data);
                } else {
                    throw new Error('Failed to fetch profile');
                }
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };
        fetchProfile();
    }, [user]);

    if (loading) return <Loader />; 
    if (error) return <div>Error: {error}</div>;


    return (
        <div className="profile-container">
            <div className="profile-sidebar">
                <img src={person} alt="Profile" />
                <h2>{profile.username}</h2>
                
                {/* Add other user info and stats */}
            </div>
            <div className="profile-details">
                {/* Forms for updating user details */}
            </div>
        </div>
    );
};

export default Profile;
